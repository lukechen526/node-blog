var rbytes  = require('rbytes'),
    hashlib = require('hashlib');


var Account = require('./models').Account;

exports.loginRequired = loginRequired;

function loginRequired(req, res,next, type)
{

    if(type === undefined)
    {    
        type = 'user';
    }
  
    if(req.session && req.session.user && req.session.user.type === type)
    {     
        next();
    }

    else
    {     
        res.redirect('/login'+'?redirect='+req.url);
    }
}


exports.adminLoginRequired = function(req,res,next)
{
    loginRequired(req,res,next,type='admin');
}



exports.login = {};


exports.login.get = function(req,res)
{

    res.render('login.jade', {title:'Login',errors:[]});

};

exports.login.post = function(req,res)
{

    authenticateUser(req.body.username,req.body.password,function(err, user)

    {
        if(!err)
        { 
            req.session.user=user;
            res.redirect((req.query.redirect!==undefined)?req.query.redirect:'/'); 
        }

        else
        {
        
            res.render('login.jade',{title:'Login Failure', errors:[err]});
        }
           
    });

};


exports.logout={};

exports.logout.all = function(req,res,next)
{
    req.session.destroy(function(err)
    {
        if(!err)
        {
            res.redirect((req.query.redirect!==undefined)?req.query.redirect:'/'); 

        }

        else
        {   
            next(err);
        }
    }                
    );

}


exports.newaccount ={};

exports.newaccount.all = function(req,res, next)
{
    loginRequired(req,res,next,type='admin');


}

exports.newaccount.get = function(req,res)
{

    res.render('newaccount.jade',{title:'Create New Account', errors:[]});

}

exports.newaccount.post = function(req,res)  
{
    
    //TODO Validate the submitted form 

    var errors = [];

    //Create a new account
    createNewAccount(username=req.body.username,password=req.body.password,type=req.body.type, email=req.body.email, callback=function(err, account)
    {

        if(!err)
        {
            console.log('User Account Created Successfully!');
        }

        else
        {
            console.log(err);
        }

        res.redirect('/logout');
    }
    );

    
}

exports.createNewAccount = createNewAccount;

function createNewAccount(username, password, type, email, callback)
{

    passwd_salt = generateSalt();
    passwd_hash = passwdHash(password,passwd_salt);

    account = new Account({username:username, passwd_hash:passwd_hash, passwd_salt:passwd_salt, type:type, email:email});

    account.save(function(err)
    {

        if(!err)
        { 
        callback(null,account);
        }

      else
      {
         callback(err, null); 
      }

    });
   
}


function passwdHash(password,salt)
{
    return hashlib.sha256(password+'$'+salt);

}

//Generate a random 256-bit salt and return in Base64 format
function generateSalt()
{
    rSalt = rbytes.randomBytes(32); 
    return rSalt.toString(encoding='base64'); 
}


exports.authenticateUser = authenticateUser;

function authenticateUser(username, password, callback)
{

   Account.findOne({username:username}, function(err,user)
    
    {
   
      if(!err && user )
        { //Found the user in database and no errors

          if(user.passwd_hash === passwdHash(password,user.passwd_salt))
   
            { //Check if the password is correct
            
              user.last_logged_in = new Date();
              
              user.save(function(err)
              { 
                  
                 if(!err)
                 { 
                    callback(null,user);
                 }


                 else
                 {
                 
                    callback(err,null);
                 
                 }

              });
             
          }

          else
          {
              callback('Incorrect Password', null);
          }
      
      }

      else
      { //User not in database or error(s) occured
      
        if(!user)
        {
            callback('User Not Found',null);
        }

        else
        {
            callback(err,null);
        }

    }
   
   });

}

exports.viewaccounts = {};
exports.viewaccounts.get = function(req,res, next) 
{
    Account.find({}).sort('type',1).run(function(err, accounts)
    {

	    if(!err)
        { 
            res.render('viewaccounts.jade',{title:"View All Accounts", accounts: accounts});
        }

        else
        {
        
            console.log(err);
            next(err);
        
        }

    }
    );

}
