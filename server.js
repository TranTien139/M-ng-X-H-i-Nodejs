
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var multer  = require('multer');

var server = require('http').createServer(app);

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.logger('dev')); // log every request to the console
app.use(express.cookieParser());
app.use(express.bodyParser());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.session({secret: 'vantientran'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(flash());

require('./app/routes.js')(app, passport,server,multer);

// app.listen(port,function () {
//     console.log('The magic happens on port ' + port);
// });

server.listen(port, "127.0.0.1",function () {
    console.log('The magic happens on port ' + port);
});

