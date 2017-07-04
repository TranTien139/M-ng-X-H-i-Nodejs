/**
 * Created by Tien on 7/4/2017.
 */

var mongoose = require('mongoose');
module.exports = mongoose.model('Hastag',{
    tag: String,
    data: []
});