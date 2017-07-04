var mongoose = require('mongoose');

module.exports = mongoose.model('Status',{
    user: {email:String,image:String,name: String},
    userId: String,
    content: String,
    image: [],
    date: {type: Date, default: Date.now},
    like: [],
    share: [],
    hastag: [],
    comment: [{id:String,email:String,image:String,name: String,content: String,date: {type: Date, default: Date.now},like: []}],
    group_id: String,
    write_wall: {email:String,image:String,name: String},
    id_write_wall:String
});