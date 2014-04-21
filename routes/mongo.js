var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;

var etlDb;

function query(callback, bucket) {
  var collection = etlDb.collection('apacheAggregates');

  var dimBucket = bucket ? bucket : 'MINUTES';

  collection.find({
    //'dimensions.bucket': 'MINUTES',
    //'dimensions.bucket': 'HOURS',
    'dimensions.bucket': dimBucket,
    'dimensions.timestamp': {$exists: true}
  })
    .sort({'dimensions.timestamp': -1 })
    .limit(2000)
    .toArray(callback);
}

//AW Code working from earlier project with mongodb
// var server = new mongodb.Server('192.168.0.6', 27017);
// new mongodb.Db('my-website', server).open(function (err,client) {
//   if (err) throw err;
//   console.log('\033[96m + \033[39m connected to mongodb');
  
MongoClient.connect('mongodb://192.168.0.6:27017/ada-sample', function (err, db) {
  etlDb = db;
  if (err) {
    return console.dir(err);
  }

  console.log('\033[96m + \033[39m Connected to mongodb');

  var collection = db.collection('apacheAggregates');

  collection.stats(function (err, stats) {
    console.log(stats);
  });

  query(function (err, items) {
    console.log(items.length);
  });

  /*
   collection.find(
   {
   'dimensions.agentinfo_device': 'Other',
   'dimensions.logType': 'apache',
   'dimensions.bucket': 'MINUTES',
   'dimensions.timestamp': {$exists: true}
   //"geoip_city_name": "San Francisco" }
   })
   .sort({'dimensions.timestamp': -1 })
   .limit(10)
   .toArray(function (err, items) {
   console.log(items);
   });
   */
});

function data(req, res) {
  query(function (err, items) {
    console.log('\033[96m + \033[39m in app.mongo.data(): ' + items);
    
    var response = _.map(items, function (item) {
      return {
        timestamp: item.dimensions.timestamp.getTime(),
        value: item.metrics.bytesCount
      };
    });

    res.json(response);
  }, req.query.bucket);
}

exports.data = data;
