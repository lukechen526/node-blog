var mongoose = require('mongoose'),
    Schema= mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Define model Post
var Post = new Schema({
    _id        : ObjectId
  , title     : String
  , body      : String
  , modified  : {type:Date, default: Date.now}

});









function Models(){

    //Connection
    mongoose.connect('mongodb://localhost/my_database');
    

    //Attach the models to Models
    //
    this.Post = mongoose.model('Post', Post);

}


module.exports = new Models();




