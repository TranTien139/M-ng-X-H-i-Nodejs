var mongoose = require('mongoose');

module.exports = mongoose.model('Group',{
    creator: String ,
    name: String,
    member:[{id:String,image:String,name: String}],
    data: {
        user: {email: String, image: String, name: String},
        userId: String,
        content: String,
        image: [],
        date: {type: Date, default: Date.now},
        like: [],
        share: [],
        comment: [{
            id: String,
            email: String,
            image: String,
            name: String,
            content: String,
            date: {type: Date, default: Date.now},
            like: []
        }]
    }
});