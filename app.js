var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth_demo_app', function (err) {
  if (err) {
    console.log('Unable to connect to the database.');
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/secret', function (req, res) {
  res.render('secret');
});

app.listen(3000, function () {
  console.log('App has been started at port 3000.');
});
