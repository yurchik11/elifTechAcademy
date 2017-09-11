const url = require('url');
var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var Agenda = require('agenda');
var originAddress=new String('Героїв УПА 73 Львів');
var randomString = require('randomstring');
var MyApp = {};

module.exports = (app, db, func) => {
	app.get('/data', (req, res) => {
		db.collection('cars').find().toArray(function (err, docs) {
				if(err)
				{
						console.log(err);
						return res.sendStatus(500);
				}
				res.send(docs);
				});
	});

	app.get('/hello', function(req, res)// request - response
  {
    res.send("Hello API");
  });

	app.get('/cars', function(req, res)// request - response
  {
    if(req.query.from)
    {
        const myUrl= url.parse("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+encodeURIComponent(req.query.from.toString())
            +"&destinations="+encodeURIComponent(req.query.to.toString())+"&language=uk");
        res.header("Content-Type", "application/json; charset=utf-8");
        var options = {
            url:myUrl,
            method: 'GET'
        };
        //use asios
        request(options, function (error, response, body) {
            if (error) {
                res.send('error:', error);
                return console.log('error:', error);
            }
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            var jsonParsed = JSON.parse(body);
            if(jsonParsed.status!=="OVER_QUERY_LIMIT") {
                var beDeliveredAt = calcDateDelivery(jsonParsed.rows[0].elements[0].duration.value);
                var result = {
                    distance: jsonParsed.rows[0].elements[0].distance.text,
                    duration: jsonParsed.rows[0].elements[0].duration.text,
                    beDelivered: beDeliveredAt
                };
                createNewDelivery(req.query.to, req.query.from, req.query.email, result, function (trueOrFalse, message) {
                    if (trueOrFalse)
                        return res.end(JSON.stringify(message));
                    else {
                        return res.end(JSON.stringify(message));
                    }
                });
            }
            else
            {
                return res.end("OVER_QUERY_LIMIT");
            }
        });
    }
    else
    {
        db.collection('cars').find().toArray(function (err, docs) {
            if(err)
            {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs);
            });
    }
  });

	app.get('/calc_time', function(req, res)// request - response
  {
        const myUrl= url.parse("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+encodeURIComponent(req.query.from.toString())
            +"&destinations="+encodeURIComponent(req.query.to.toString())+"&language=uk");
        res.header("Content-Type", "application/json; charset=utf-8");
        var options = {
            url:myUrl,
            method: 'GET'
        };
        //use asios
        request(options, function (error, response, body) {
            if (error) {
                res.send('error:', error);
                return console.log('error:', error);
            }
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            var jsonParsed = JSON.parse(body);
            if(jsonParsed.status!=="OVER_QUERY_LIMIT") {
                var beDeliveredAt = calcDateDelivery(jsonParsed.rows[0].elements[0].duration.value);
                var result = {
									  success: true,
										error: null,
										data:{
											from: req.query.from,
											to: req.query.to,
                      distance: jsonParsed.rows[0].elements[0].distance.text,
                      duration: jsonParsed.rows[0].elements[0].duration.text,
                      beDelivered: beDeliveredAt.BeDeliveredDateFormat
									  }
                };
								res.end(JSON.stringify(result))
            }
            else
            {
                return res.end("OVER_QUERY_LIMIT");
            }
        });
  });

app.get('/deliveries', function(req, res)// request - response
{
    db.collection('deliveries').find().toArray(function (err, docs) {
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    });
});

app.get('/queue', function(req, res)// request - response
{
    db.collection('queue').find().toArray(function (err, docs) {
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    });
});


app.get('/cars/:id', function(req, res)// request - response
{
    db.collection('cars').findOne({_id:ObjectID(req.params.id)},function (err,doc) {
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })
});

app.get('/deliveries/:id', function(req, res)// request - response
{
    db.collection('deliveries').findOne({track:req.params.id},function (err,doc) {
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }
				else if(doc)
				{
					 res.send(doc);
				}
				else {
					 db.collection('queue').findOne({track:req.params.id},function (err,doc)
					 {
						 if(err)
		         {
		             console.log(err);
		             return res.sendStatus(500);
		         }
		 				 else
		 				 {
		 					 res.send(doc);
		 				 }
					 });
				}

    })
});

app.post('/cars', function(req, res)// request - response
{
    var car = {
        name:req.body.name,
        sign:req.body.sign,
        isBusy:req.body.isBusy
    };
    db.collection('cars').insert(car,function (err,result) {
        if(err)
        {
             console.log(err);
             return res.sendStatus(500);
        }
        else
        {
            //res.send(artist);
            res.sendStatus(200);
        }
    })
    //res.send(artist);
});

app.put('/cars', function(req, res)// request - response
{
    var car = req.body;
    console.log(car);
    console.log(car.name);
    db.collection('cars').updateOne(
        {_id:ObjectID(car._id)},
        {
            $set:{
              "name": car.name,
              "sign": car.sign,
              "isBusy": car.isBusy,
              "willBeFree": car.willBeFree,
              "deliveryID": car.deliveryID
            }
        },
        function (err,result) {
            if(err)
            {
                console.log(err);
                return res.sendStatus(500);
            }
        res.sendStatus(200);
    });
});



app.delete('/cars/:id', function(req, res)// request - response
{
    db.collection('cars').deleteOne(
        {_id:ObjectID(req.params.id)},
        function (err,result) {
            if(err)
            {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
});

app.delete('/deliveries/:id', function(req, res)// request - response
{
    db.collection('deliveries').deleteOne(
        {_id:ObjectID(req.params.id)},
        function (err,result) {
            if(err)
            {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
});
















	// *****   FUNCTIONS ******

	var calcDateDelivery = function (timeDelivery) {
	    var date = new Date();
	    var beDelivered = new Date(date.getTime() + timeDelivery*1000);
	    var res = {
	        "BeDeliveredDateFormat":beDelivered,
	        "TimeDelivery":timeDelivery
	    };
	    return res;
	}

	var createNewDelivery=function(from,to,email,result,callback) {
	    db.collection('cars').findOne({isBusy:false},function (err,doc) {
	        if(err)
	        {
	            console.log(err);
	            return callback(false, err);
	        }
	        else {
	            if (!doc) {
	                console.log("not available free car");
	                getNearestCar(function (nearestCar) {
	                    if(nearestCar!=0)
	                            insertDeliveryIntoQueue(nearestCar,from,to,email,result, function (resQueue) {
	                                console.log("Successfully added new delivery into queue");
	                                return callback(true, resQueue);
	                            });
	                        });
	            }
	            else {
	                console.log("available free car");
	                var delivery = {
	                    from: from.toString(),
	                    to: to.toString(),
											email: email.toString(),
											track: randomString.generate(),
	                    beDeliveredDateFormat: result.beDelivered.BeDeliveredDateFormat,
	                    timeDelivery: result.duration,
	                    distanceDelivery: result.distance,
	                    status:"in progress"
	                };
	                MyApp.willBeFree = result.beDelivered.BeDeliveredDateFormat;
	                MyApp.delivery = delivery;
	                db.collection('deliveries').insert(delivery, function (err, result,delivery) {
	                    if (err) {
	                        console.log(err);
	                        return callback(false, err);
	                    }
	                    else {
	                        console.log("New delivery created");
	                        db.collection('cars').updateOne(
	                            {_id: ObjectID(doc._id.toString())},
	                            {
	                                $set: {
	                                    "isBusy": true,
	                                    "deliveryID":result["ops"][0]["_id"].toString(),
	                                    "willBeFree": MyApp.willBeFree
	                                }
	                            },
	                            function (err, result) {
	                                if (err) {
	                                    console.log(err);
	                                    return callback(false, err);
	                                }
	                                else
	                                {
	                                    return callback(true,
																				{
																					success:true,
																					error:null,
																					data:	MyApp.delivery
																				});
	                                }
	                            });
	                    }
	                });
	            }
	        }
	    });
	}

	var getNearestCar = function (callback) {
	    db.collection('cars').aggregate(
	        [
	            {
	                $sort:{willBeFree:1}
	            }
	        ], function (err,docs) {
	            if(err)
	            {
	                console.log(err);
	                return callback(0);
	            }
	            else
	            {
	                //console.log(docs);
	                callback(docs[0]);
	            }

	        }
	    );
	}

	var insertDeliveryIntoQueue = function (nearCar, from,to,email, result, callback) {
		console.log(nearCar.willBeFree);
	    var newDate = new Date(nearCar.willBeFree.getTime() + result.beDelivered.TimeDelivery*1000);
	    var myQueue = {
	        from:from.toString(),
	        to:to.toString(),
					email:email.toString(),
					track: randomString.generate(),
	        timeDelivery:result.duration,
	        distanceDelivery:result.distance,
	        beDeliveredDateFormat: newDate,
					status : "in queue"
	    };
	    db.collection('queue').insert(myQueue,function (err,result) {
	        if(err)
	        {
	            return console.log(err);
	        }
	        else
	        {
	            //console.log("New delivery created");
	            db.collection('cars').updateOne(
	                {_id: nearCar._id},
	                {
	                    $set: {
	                        "willBeFree": newDate
	                    }
	                },
	                function (err, result) {
	                    if (err) {
	                        console.log(err);
	                        return callback({});
	                    }
	                    else
	                    {
	                        console.log("Updated willBeFree date for car!")
													var temp = {
														success: true,
														error: null,
														data: myQueue
													}
	                        return callback(temp);
	                    }
	                });
	        }
	    });
	}

	var runMyCrone=function () {
		  //var mongoConnectionString = 'mongodb://127.0.0.1/agenda';
	    var mongoConnectionString = 'mongodb://admin:qwerty@ds127894.mlab.com:27894/deliveryapp';
	    var agenda = new Agenda({db: {address: mongoConnectionString}});
	    agenda.define('checkQueue', function(job,done) {
	        //console.log("new agenda job scheduler created");
	        db.collection('cars').findOne({ willBeFree: { $lte: new Date() }},function (err, doc) {
	            if (err) {
	                return console.log(err);
	            }
	            else if(doc)
	            {
	                MyApp.CarID = doc._id;
	                updateStatusDelivery(doc.deliveryID, function (status) {
	                    if(status)
	                    {
	                        getFirsInQueue(function (myQueue) {
	                            if(myQueue)
	                            {
	                                insertQueueIntoDeliveries(myQueue,function (delivery) {
	                                    if(delivery)
	                                    {
	                                        setCarForDelivery(delivery,MyApp.CarID, function (status) {
	                                            if(status)
	                                                return done();
	                                        });
	                                    }
	                                    else
	                                    {
	                                        return done();
	                                    }
	                                })
	                            }
	                            else
	                            {
	                               return done();
	                            }
	                        })
	                    }
	                });
	            }
	            else
	            {
	                console.log("no free cars");
	                return done();
	            }
	        });
	    });
	    agenda.on('ready', function() {
	        agenda.every('10 seconds', 'checkQueue');
	        // Alternatively, you could also do:
	        //agenda.every('*/3 * * * *', 'checkQueue');
	        agenda.start();
	        console.log("crone was started")
	    });
	}

	var updateStatusDelivery = function(deliveryID,callback) {
	    db.collection('deliveries').updateOne(
	        {_id: ObjectID(deliveryID)},
	        {
	            $set: {
	                "status": "completed"
	            }
	        },
	        function (err, result) {
	            if (err) {
	                console.log(err);
	                return callback(false);
	            }
	            else
	            {
	                console.log("delivery status was updated!")
	                return callback(true);
	            }
	        });
	};
	var getFirsInQueue = function (callback) {
	    db.collection('queue').findOne(function (err, doc){
	        if (err) {
	            console.log(err);
	            return callback(null);
	        }
	        else
	        {
	            if(doc) {
	                console.log("move first delivery from queue into deliveries");
	                deleteFirstInQueue(doc._id);

	            }
	            else
	            {
	                console.log("queue is empty");
	            }
	            return callback(doc);
	        }
	    });
	};

	var deleteFirstInQueue = function (id) {
	    db.collection('queue').deleteOne(
	        {_id:id},
	        function (err,result) {
	            if(err)
	            {
	                console.log("deleted first delivery in queue");
	                return console.log(err);
	            }
	        });
	}

	var insertQueueIntoDeliveries = function (myQueue, callback) {
	    var temp = myQueue.approxWillBeDelivered;
	    delete myQueue.approxWillBeDelivered;
	    delete myQueue._id;
	    myQueue.beDeliveredDateFormat = temp;
	    db.collection('deliveries').insert(myQueue, function (err, result) {
	        if (err) {
	            console.log(err);
	            return callback(null);
	        }
	        else
	        {
	            return callback(result["ops"][0]);
	        }
	    });
	}

	var setCarForDelivery = function (delivery,carID, callback) {
	    db.collection('cars').updateOne(
	        {_id: ObjectID(carID)},
	        {
	            $set: {
	                "deliveryID": delivery._id,
	                "willBeFree": delivery.beDeliveredDateFormat
	            }
	        },
	        function (err, result) {
	            if (err) {
	                console.log(err);
	                return callback(false);
	            }
	            else
	            {
	                console.log("car detail was updated for new delivery!");
	                return callback(true);
	            }
	        });
	}

	// ****  START CRONE ****
	runMyCrone();
}
