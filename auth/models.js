var mongoose = require('mongoose'),
    Schema= mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Account = new Schema(
{
    _id : ObjectId,
    username : {type:String, match:/[A-Za-z0-9]/, unique:true},
    passwd_hash: String,
    passwd_salt: String,
    type: {type: String, default: 'user'},
    last_logged_in : {type: Date, default: Date.now},
    email: {type: String, default:'example@example.com'}

});

function Models()
{

    //Connection
    mongoose.connect('mongodb://localhost/my_database');
    

    //Attach the models to Models
    this.Account=mongoose.model('Account', Account);

}


module.exports = new Models();
