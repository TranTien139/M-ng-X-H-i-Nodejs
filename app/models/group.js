var mongoose = require('mongoose');

module.exports = mongoose.model('Group',{
    creator: String ,
    name: String,
    member:[{id:String,image:String,name: String}],
    cover: String,
    description: String,
    date_create: {type: Date, default: Date.now}
});