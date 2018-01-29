var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose');

var User = require('./models/user');

mongoose.connect('mongodb://localhost/auth_demo_app', function (err) {
  if (err) {
    console.log('Unable to connect to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.use(require('express-session')({
  secret: 'KwMsQAwznFwReFt4sq2cwtU8WJkz58s65L90LyYeuljqZduFGS129i0luMG3V84d',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// ===================
// ROUTES
// ===================

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
});

// Auth Routes

// Show signup form
app.get('/register', function (req, res) {
  res.render('register');
});

// Handling user signup
app.post('/register', function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/secret');
    });
  });
});

// Login Routes

// Render login form
app.get('/login', function (req, res) {
  res.render('login');
});

// Login logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}),function (req, res) {
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, function () {
  console.log('App has been started at port 3000.');
});
