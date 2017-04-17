var mongoose = require('mongoose');

module.exports = mongoose.model('Status',{
    user: {email:String,image:String,name: String},
    userId: String,
    content: String,
    image: [],
    date: {type: Date, default: Date.now},
    like: [],
    share: [],
    comment: [{id:String,email:String,image:String,name: String,content: String,date: {type: Date, default: Date.now},like: []}],
    group_id: String,
});