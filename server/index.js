var express = require('express');
var http = require('http');
var https = require("https");
var bodyParser = require('body-parser');
var app = express();
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient
var request = require('request');
const url = require('url');
var config = require('./config');
var controllers = require('./controllers');
const path = require('path');
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('client'));
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Origin', '*');
});

app.get('/track', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/map', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/track', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.get('/estimate', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports.start = () =>
{
	//mongodb://admin:qwerty@ds127894.mlab.com:27894/deliveryapp
	//mongodb://localhost:27017/mydb
	MongoClient.connect('mongodb://admin:qwerty@ds127894.mlab.com:27894/deliveryapp',function (err,database) {
	    if(err)
	    {
	        return console.log(err);
	    }
			controllers.set(app,database);
			app.listen(process.env.PORT || config.port, () =>
			console.log('App listening on port '+ config.port));

	});
}
