/**
 * Created by Tran Tien on 22/02/2017.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Chat',{
    user: {user1:String,user2:String},
    first:String,
    content: [{id:String,image:String,name: String,content: String,date: {type: Date, default: Date.now},seen:String}]
});