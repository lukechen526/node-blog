var mongoose = require('mongoose'),
    Schema= mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Define model Post
var Post = new Schema
({
    _id       : ObjectId
  , author    : {type:String, default:'default'} 
  , title     : String
  , body      : String
  , modified  : {type:Date, default: Date.now}

});


//Export the Models class, used to access all the other classes defined in this package

function Models()
{

    //Connection
    mongoose.connect('mongodb://localhost/my_database');
    
    //Attach the models to Models
    this.Post = mongoose.model('Post', Post);

}


module.exports = new Models();




