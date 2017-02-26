// app/routes.js

var User = require('../app/models/user.js');
var Status = require('../app/models/status.js');
var NewFeed = require('../app/controller/statusController.js');
var Chat = require('../app/models/chat.js');
var mongoose = require('mongoose');

module.exports = function (app, passport, server, multer,redisClient) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function (req, res) {

        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }

    });

    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('signupMessage')});
        }
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function (req, res) {
        var user = req.user;
        var j = user.followers;
            var newfeed = NewFeed.getNewFeed(user._id, j, function (err, data) {
                    res.render('index.ejs', {
                        user: user,
                        friend: user.followers,
                        newfeed: data
                    });

            });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/profile/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;

        var user = req.user;
        var friend = user.followers;

        User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member, function (err, data) {
                    console.log(data);
                        res.render('profile.ejs', {
                            user_other: users,
                            user: req.user,
                            timeline: data,
                            friend: friend,
                        });
                });

            } else {
                res.end();
            }
        });
    });

    app.get('/about/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;
        var user = User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member, function (err, data) {
                    res.render('about.ejs', {
                        user_other: users,
                        user: req.user,
                        timeline: data,
                        friend: '',
                    });
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.get('/friends/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;
        var user = User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member, function (err, data) {
                    res.render('friends.ejs', {
                        user_other: users,
                        user: req.user,
                        timeline: data,
                        friend: '',
                    });
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.get('/photos/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;
        var user = User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member, function (err, data) {
                    res.render('photos.ejs', {
                        user_other: users,
                        user: req.user,
                        timeline: data,
                        friend: '',
                    });
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.get('/edit/profile/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;
        var user = User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                NewFeed.getNewFeedMe(user_member, function (err, data) {
                    res.render('edit_profile.ejs', {
                        user_other: users,
                        user: req.user,
                        timeline: data,
                        friend: '',
                    });
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + '.jpg');
        }
    });
    var upload = multer({storage: storage}).array('myAvatar', 2);


    app.post('/update-profile/:id_member', isLoggedIn, function (req, res) {
        var user_member = req.params.id_member;

        console.log(JSON.stringify(req.body, null, 2));
        User.findOne({"_id": user_member}, function (err, users) {
            if (!err) {
                upload(req, res, function (err) {
                    if (err) {
                        res.end('upload fail');
                    } else {
                        console.log(req.files);
                    }
                });
                users.local.birthday = req.body.birthday;
                users.local.job = req.body.job;
                users.local.gender = req.body.gender;
                users.local.hometown = req.body.hometown;
                users.local.education = req.body.education;
                users.local.name = req.body.fullname;
                users.save(function (err) {
                    backURL = req.header('Referer') || '/';
                    res.redirect(backURL);
                });
            } else {
                res.end('error');
            }
        });
    });


    app.get("/search_friend", isLoggedIn, function (req, res) {
        var regex = new RegExp(req.query["keyword"], 'i');
        var query = User.find({$or: [{"local.name": regex}, {"local.email": regex}]}).limit(20);
        query.exec(function (err, users) {
            if (!err) {
                res.render('search.ejs', {
                    key: req.query.keyword,
                    result: users,
                    user: req.user
                });
            } else {
                res.end();
            }
        });
    });

    app.post("/send-add-friend/:me/:friend", isLoggedIn, function (req, res) {
        var me = req.params.me;
        var user_me = req.user;
        var friend = req.params.friend;
        // User.findOne({'_id': me}, function (err, user) {
        //     if (err) return done(err);
        //     if (user) {
        //         user.followers.push({userId: friend});
        //         user.save();
        //     }
        // });
        User.findOne({'_id': friend}, function (err, user) {
            if (err) return done(err);
            if (user) {
                var obj = {userId: friend,image:friend.local.image,name:friend.local.name};
                user_me.followers.push(obj);
                user_me.save();
                // user.message_friend.push({userId:user_me._id, image:user_me.local.image, name:user_me.local.name});
                // user.save();
            }
        });
        res.redirect('/profile/' + friend);
    });

    app.post("/add-status", isLoggedIn, function (req, res) {
        var content = req.body.content_status;
        var status = new Status();
        status.content = content;
        status.like = [];
        status.share = [];
        status.comment = [];
        status.user.name = req.body.user_name;
        status.user.email = req.body.user_email;
        status.user.image = req.body.user_image;
        status.userId = req.body.user_id;
        status.save();
        backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    });

    app.get('/chat', isLoggedIn, function (req, res) {
        var id = req.query.conversation;

        var user = req.user;

        Chat.findOne({$or: [{$and: [{'user.user1': user._id},{'user.user2':id}]},{$and: [{'user.user1': id},{'user.user2': user._id}]}]}, function (err, chat_data) {
            if (err) return done(err);
            if(chat_data){
                User.findOne({'_id': id}, function (err, users) {
                    if (err) return done(err);

                    // if(chat_data.first === id) {
                    //    redisClient.get("chat_" + id + "_" + user._id, function (err, reply) {
                    //     });
                    // }else {
                    //      redisClient.get("chat_" + user._id + "_" + id, function (err, reply) {
                    //     });
                    // }
                res.render('chat.ejs', {
                    user: user,
                    chat_with:users,
                    data_chat: chat_data.content
                });
                });
            }else {
                User.findOne({'_id': id}, function (err, users) {
                    if (err) return done(err);
                    res.render('chat.ejs', {
                        user: user,
                        chat_with:users,
                        data_chat: ''
                    });
                });
            }
        });
    });

    app.post('/post-chat', isLoggedIn, function (req, res) {
        var id = req.body.id_chat_with;
        var user = req.user;
        var content = req.body.message;
        var data_content = {};
        data_content.id = user._id;
        data_content.image = user.local.image;
        data_content.name = user.local.name;
        data_content.content = content;
        data_content.date = new Date();
        data_content.seen = '';

        Chat.findOne({$or: [{$and: [{'user.user1': user._id},{'user.user2':id}]},{$and: [{'user.user1': id},{'user.user2': user._id}]}]}, function (err, chat_data) {
            if (err) return done(err);
            if (chat_data) {
                // if(chat_data.first === id) {
                //     redisClient.set("chat_" + id + "_" + user._id, data_content, function (err, reply) {
                //     });
                // }else {
                //     redisClient.set("chat_" + user._id + "_" + id, data_content, function (err, reply) {
                //     });
                // }
                chat_data.content.push(data_content);
                chat_data.save(function (err) {
                    res.end();
                });
            }else {
                var chat = new Chat;
                chat.user.user1 =  user._id;
                chat.user.user2 =  id;
                chat.content.push(data_content);
                chat.first = user._id;
                chat.save(function (err) {
                    res.end();
                });
            }
        });
    });

    app.post("/post-comment/:id_status", isLoggedIn, function (req, res) {
        var id_status = req.params.id_status;
        var content = req.body.content_comment;
        var user = req.user;
        NewFeed.getStatusPost(id_status, function (err, data1) {
            if (err) throw  err;
            var data = {};
            data.id = user._id;
            data.name = user.local.name;
            data.image = user.local.image;
            data.email = user.local.email;
            data.content = content;
            data.date = Date.now();
            data1.comment.push(data);
            data1.save(function (err) {
                if (err) throw  err;
                backURL = req.header('Referer') || '/';
                res.redirect(backURL);
            });
        });
    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    var io = require('socket.io')(server);
    var nicknames = [];

    var users = {};

    io.on('connection', function (socket) {
        socket.on('new user', function (data, callback) {
            if (data in users) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                nicknames.push(socket.nickname);
                updateNickName();
            }
        });

        socket.on('chat message', function (msg) {
            if (msg.id_chat_with != '' && (typeof users[msg.id_chat_with] !== 'undefined')) {
                users[msg.id_chat_with].emit('gui-lai', {id: msg.id_send, msg: msg.message,name: msg.name_send, image: msg.image_send});
            } else {
            }
        });
        socket.on('disconnect', function (data) {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            nicknames.slice(nicknames.indexOf(socket.nickname),1);
            updateNickName();
        });

    });

    function updateNickName(){
        io.sockets.emit('usernames',nicknames);
    }


};


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
