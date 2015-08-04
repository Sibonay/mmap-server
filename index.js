// Initialization
var express = require('express');
var bodyParser = require('body-parser'); 
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://127.0.0.1/test';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.post('/sendLocation', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

	var login = request.body.login; 
	var lat = request.body.lat;
	var lng = request.body.lng;
	var timestamp = new Date();

	if (request.body.login && request.body.lat && request.body.lng) {

		var toInsert = {
			"login": login,
			"lat": lat,
			"lng": lng,
			"created_at": timestamp
		};

		db.collection('locations', function(error1, collection) {
			if (!error1) {
				collection.find({"login": login}).toArray(function(err, items) {
					if (items.length == 0) {
						collection.insert(toInsert, function(error, result) {
							if (!error) { 
								collection.find().toArray(function(err, cursor) {
									if (!err) {
										response.send(cursor); 
									} else {
										response.send(500);
									}			
								});
							} else {
								response.send(500);
							}
						});
					} else {
						collection.update( 
					   {"login": login},
					   toInsert,				     
					   {upsert: true}, 
					   function(error2, saved) { 
					   		if (!error2) {
								collection.find().toArray(function(err, cursor) {
									if (!err) {
										response.send(cursor); 
									} else {
										response.send(500);
									}				
								});
					   		} else {
					   			response.send(500);
					   		}
						});
					}
				});

			} else {
				response.send(500);
			}
		});
	}
	else {
		response.send({"error":"Whoops, something is wrong with your data!"}); 
	}
});

app.get('/location.json', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

	response.set('Content-Type', 'text/html');
	var login = request.query.login;

	db.collection('locations', function(err, collection) {
		collection.find({"login": login}).toArray(function(err, cursor) {
			if (!err) {
				if (cursor.length != 0) 
					response.send(JSON.stringify(cursor[0])); // sending a list
				else 
					response.send({});
			}
		});
	});
});


app.get('/', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

	response.set('Content-Type', 'text/html');


	var indexPage = '';
	db.collection('locations', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>Locations</title></head><body><h1>Check Ins</h1>";
				for (var count = cursor.length - 1; count >= 0; count--) {
					indexPage += "<p>" + cursor[count].login + " checked in at " + cursor[count].lat + ", " + 
					cursor[count].lng + " at " + cursor[count].created_at + "</p>";
				}
				indexPage += "</body></html>";
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>Locations</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000); 

// to test server:
// curl --data "login=danielle&lat=10&lng=10" http://127.0.0.1:3000/sendLocation
// http://127.0.0.1:3000/location.json?login=sibonay --> query string

