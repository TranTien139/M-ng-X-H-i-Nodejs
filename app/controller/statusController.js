/**
 * Created by Tran Tien on 14/02/2017.
 */
var Waste = require('../../app/models/status.js');
var UserPost = require('../../app/models/user.js');

function  getNewFeed(id_user,follower,callback) {

        var requestedWastes = [];
        if(follower.length>0) {
            for (var i = 0, len = follower.length; i < len; i++) {
                requestedWastes.push({userId: follower[i].userId});
            }
        }
     requestedWastes.push({userId: id_user});
        Waste.find({$or: requestedWastes})
            .sort({date: -1})
            .exec(function(err, allWastes){
                callback(err,allWastes);
            });
}
function  getNewFeedMe(id,callback) {

    Waste.find({"userId":id})
        .sort({date: -1})
        .exec(function(err, allWastes){
            callback(err,allWastes);
        });
}

function  getStatusPost(id,callback) {
    Waste.findOne({"_id":id})
        .sort({date: -1})
        .exec(function(err, allWastes){
            callback(err,allWastes);
        });
}

function  getUserPostStatus(id,callback) {
    UserPost.findOne({"_id":id})
        .sort({date: -1})
        .exec(function(err, allWastes){
            callback(err,allWastes);
        });
}

module.exports.getNewFeedMe = getNewFeedMe;
module.exports.getNewFeed = getNewFeed;
module.exports.getStatusPost = getStatusPost;
module.exports.getUserPostStatus = getUserPostStatus;
