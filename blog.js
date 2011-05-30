var express = require('express'),
    app     = express.createServer(),
    models  = require('./models.js'),
    Post = models.Post,
    auth = require('./auth');

app.configure(function()       
{

    app.use(express.cookieParser());
    app.use(express.session({ secret: 'pgdxKERFI2YPzhjO3l1atTA5v/XhtVax9DI8BSm5UpE=' }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/static',express.static(__dirname+'/static'));
    app.use(express.errorHandler({
        dumpExceptions:true, 
        showStack:true}));

    app.set('views',__dirname+'/views');
    
}
);


//Homepage
app.get('/', function(req, res)
{
    

    Post.find({}).sort('modified',-1).run(function(err, docs)
    {

	    if(!err)
        { 
            res.render('home.jade',
                {
                    title:"Blog Title", 
                    posts:docs, 
                    user:req.session.user?req.session.user:null
                }
                );
        }

        console.log(err);
    }
    );
	
}
);

//Editing new posts
app.all('/new', auth.loginRequired);


app.get('/new', function(req,res)
{

    res.render('edit.jade', {title:'', body: '', method:'post'});

}
);

app.post('/new', function(req,res)
{

    var post = new Post({author:req.session.user.username,title:req.body.title, body:req.body.body});
    post.save(function(err)
    {
        if(!err) res.redirect('/');
        console.log(err);
    });

});


//Edit existing posts
app.all('/edit/:postid', auth.loginRequired);

app.get('/edit/:postid',function(req,res,next)
{
    Post.findById(req.params.postid, function(err, doc)
    {
    
        if(!doc)
        {
            return next(new Error('Could not load document'));
        }
        
        else
        {
            res.render('edit.jade', {title:doc.title, body: doc.body, method:'put'});
        }
    
    }
    );

}
);

app.put('/edit/:postid', function(req,res)
{
    Post.findById(req.params.postid, function(err, doc)
    { 
        if (!doc)
        {  
            return next(new Error('Could not load Document'));
        }

        else 
        {
            // do your updates here
            doc.modified = new Date();
            doc.title = req.body.title;
            doc.body = req.body.body;

            doc.save(function(err) 
            {
               if (err)
                 console.log('Update error');
               else
                 console.log('Update success');


               res.redirect('/');



              }
              );
           }
         
    }
    );

}
);


//Login, logout, and new account creation
app.get('/login', auth.login.get) ;
app.post('/login', auth.login.post);
app.all('/logout', auth.logout.all);
app.all('/newaccount', auth.newaccount.all);
app.get('/newaccount', auth.newaccount.get);
app.post('/newaccount',auth.newaccount.post);
app.get('/viewaccounts', auth.adminLoginRequired, auth.viewaccounts.get);



//Start app
app.listen(8000);
console.log('App running at port 8000');
