// app/routes.js

var User = require('../app/models/user.js');
var Status = require('../app/models/status.js');
var NewFeed = require('../app/controller/statusController.js');
var mongoose = require('mongoose');

module.exports = function(app, passport,server) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================

	app.get('/', function(req, res) {

        if(req.isAuthenticated()){
        	res.redirect('/home');
		}else {
            res.render('login.ejs', { message: req.flash('loginMessage') });
		}

	});

	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else {
            res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else {
            res.render('signup.ejs', {message: req.flash('signupMessage')});
        }
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/home', isLoggedIn, function(req, res) {
        var user = req.user;

        var j = user.followers;
        var MyObjectStringify = "[";
        var last = j.length;
        var count = 0;
        if (last > 0) {
            for (var x = 0; x < j.length; x++) {
                MyObjectStringify += '{"_id":' + JSON.stringify(j[x].userId) + '}';
                count++;
                if (count < last)
                    MyObjectStringify += ",";
            }
        }
        MyObjectStringify += "]";
        var list = JSON.parse(MyObjectStringify);
        if (list.length > 0){
        User.find({$or: list}, function (err, friend) {
            var newfeed =  NewFeed.getNewFeed(j,function (err, data) {
                res.render('index.ejs', {
                    user: user,
                    friend: friend,
                    newfeed:data
                });
           });

        });
    }else {
            res.render('index.ejs', {
                user: user,
                friend: '',
                newfeed:''
            });
    }

	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/profile/:id_member',isLoggedIn, function (req, res) {
        var user_member =  req.params.id_member;
        var user = User.findOne({"_id":user_member},function (err,users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member,function (err, data) {
                    res.render('profile.ejs', {
                        user_other: users,
                        user: req.user,
                        timeline: data
                    });
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.post('/update-profile/:id_member',function (req, res) {
        var user_member =  req.params.id_member;
        User.findOne({"_id":user_member},function (err,users) {
            if (!err) {
                users.local.name = req.body.name;
                users.local.email = req.body.email;
                users.local.image = req.body.image;
                users.save(function (err) {
                    backURL=req.header('Referer') || '/';
                    res.redirect(backURL);
                });
            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });


    app.get("/search_friend", isLoggedIn, function (req, res) {
        var regex = new RegExp(req.query["keyword"], 'i');
        var query = User.find({$or: [{"local.name": regex}, {"local.email": regex}]}).limit(100);
        query.exec(function (err, users) {
            if (!err) {
                console.log(users);
                res.render('search.ejs', {
                    key: req.query.keyword,
                    result: users,
                    user: req.user
                });
            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.post("/send-add-friend/:me/:friend",isLoggedIn, function (req, res) {
        var me =  req.params.me;
        var friend =  req.params.friend;
        User.findOne({ '_id' : me}, function(err, user) {
            if(err) return done(err);
            if(user){
                user.followers.push({userId: friend});
                user.save();
            }
        });
        User.findOne({ '_id' : friend}, function(err, user) {
            if(err) return done(err);
            if(user){
                user.followers.push({userId: me});
                user.save();
            }
        });
        res.redirect('/profile/'+friend);
    });

    app.post("/add-status",isLoggedIn, function (req, res) {
        var content =  req.body.content_status;
        var status = new Status();
        status.content = content;
        status.like = 0;
        status.share = 0;
        status.comment = [];
        status.user.name = req.body.user_name;
        status.user.email = req.body.user_email;
        status.user.image = req.body.user_image;
        status.userId = req.body.user_id;
        status.save();
        res.redirect('/home');
    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    var io = require('socket.io')(server);
    var nicknames = [];

    var users={};

    io.on('connection', function(socket){
        socket.on('new user', function (data, callback) {
            if(data in users){
                callback(false);
            } else{
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                UpdateNickName();
            }
        });
        socket.on('chat message', function(msg){
            if(msg.chat_with !='') {
                users[msg.chat_with].emit('gui-lai', {nick: msg.name_chat, msg: msg.msg});
            }else {}
        });

        function UpdateNickName() {
            io.sockets.emit('usernames',Object.keys(users));
        }

        socket.on('disconnect', function (data) {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            UpdateNickName();
        });
    });

};



// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
