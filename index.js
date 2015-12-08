var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var db = require('./models');
var app = express();
var Hashids = require("hashids");
var db = require('./models');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

app.post('/links', function(req, res) {
	res.send(req.body.url);
	db.link.create({
		url: req.body.url
	}).then(function(link) {
		link.hash = hashids.encode(link.id);
        link.save().then(function() {
    		res.redirect('/links/' + link.id);
   	 	});
	});
});

app.get('/links/:id', function(req, res) {
	db.link.findById(req.params.id).then(function(link) {
		res.render('links/show', {link: link, hashids: hashids});
	});
});

app.get('/links', function(req, res) {
	db.link.findAll({
		order: 'clicks DESC'
	}).then(function(links) {
		console.log(links);
		res.render('links/index', {links: links, hashids: hashids});
	});
});


app.get('/:hash', function(req, res) {
  db.link.find({
    where: {
      id: hashids.decode(req.params.hash)
    }
  }).then(function(link) {
    link.clicks++;
    link.save().then(function(link) {
      res.redirect(link.url);
    });
  });
});

app.listen(3000);












































