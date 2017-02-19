/**
 * Created by Tran Tien on 14/02/2017.
 */
var Waste = require('../../app/models/status.js');

function  getNewFeed(follower,callback) {

        var requestedWastes = [];
        if(follower.length>0) {
            for (var i = 0, len = follower.length; i < len; i++) {
                requestedWastes.push({userId: follower[i].userId});
            }
        }
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

module.exports.getNewFeedMe = getNewFeedMe;
module.exports.getNewFeed = getNewFeed;
