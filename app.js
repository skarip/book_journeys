// setup
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//config
mongoose.connect('mongodb://localhost/bookJourneys');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Reading from bookJourneys db");
});

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());

//create schema and models
var bookSchema = mongoose.Schema({
  title: String,
  author: String,
  ISBN10: String,
  ISBN13: String,
  coverImageUrl: String,
  locations: [{ user: String, date: String, zip: Number }],
  googleURI: String
});

var Book = mongoose.model('Book', bookSchema);

//routing
app.get('/v1/books', function(req, res) {
  Book.find(function(err, books) {
    err ? res.send(err) : res.json(books);
  });
});

app.post('/v1/books', function(req, res) {
  Book.create(req.body.book, function(err, book) {
    err ? res.send(err) : res.json(book);
  });
});

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

//listen
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
