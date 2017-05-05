/**
 * Created by Tran Tien on 14/02/2017.
 */
var Waste = require('../../app/models/status.js');
var UserPost = require('../../app/models/user.js');

function getNewFeed(id_user,follower,skip,callback) {
        var requestedWastes = [];
        if(follower.length>0) {
            for (var i = 0, len = follower.length; i < len; i++) {
                requestedWastes.push({userId: follower[i].userId});
            }
        }
     requestedWastes.push({userId: id_user});
        Waste.find({$and: [{$or: requestedWastes},{ group_id : { $exists: false }}]})
            .sort({date: -1}).skip(skip).limit(10)
            .exec(function(err, allWastes){
                callback(err,allWastes);
            });
}
function  getNewFeedMe(id,skip,callback) {
    Waste.find({$and: [{"userId":id},{group_id : {$exists: false}}]})
        .sort({date: -1}).skip(skip).limit(10)
        .exec(function(err, allWastes){
            callback(err,allWastes);
        });
}

function  getNewFeedMeImage(id,skip,callback) {
    Waste.find({$and: [{"userId":id},{group_id : {$exists: false}},{image : {$ne: [] }} ]})
        .sort({date: -1}).skip(skip).limit(12)
        .exec(function(err, allWastes){
            callback(err,allWastes);
        });
}

function  getNewFeedGroup(id,skip,callback) {
    Waste.find({"group_id":id})
        .sort({date: -1}).skip(skip).limit(10)
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

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + min + sec + day + month +year;

}

function DeleteStatus(id,id_user) {
    Waste.remove({$and: [{'_id':id},{'userId':id_user}]}).exec(function(err, allWastes){
        });
}

module.exports.getNewFeedMe = getNewFeedMe;
module.exports.getNewFeed = getNewFeed;
module.exports.getStatusPost = getStatusPost;
module.exports.getUserPostStatus = getUserPostStatus;
module.exports.getNewFeedGroup = getNewFeedGroup;
module.exports.getNewFeedMeImage = getNewFeedMeImage;
module.exports.getDateTime = getDateTime;
module.exports.DeleteStatus = DeleteStatus;
