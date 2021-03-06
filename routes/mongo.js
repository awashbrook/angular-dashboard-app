var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;

var etlDb;

function query(callback, bucket) {
  var collection = etlDb.collection('aggregations');

  var dimBucket = bucket ? bucket : 'MINUTES';

  collection.find({
    dimension_size: 3,
    'dimensions.bucket': dimBucket,
    'dimensions.timestamp': {$exists: true},
    'dimensions.logType': 'apache'
  })
    .sort({'dimensions.timestamp': -1 })
    //.limit(2000)
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

  var collection = db.collection('aggregations');

  collection.stats(function (err, stats) {
    console.log(stats);
  });

  query(function (err, items) {
    console.log(items.length);
  });
});

function data(req, res) {
  var metric = req.query.metric;
  query(function (err, items) {
    console.log('\033[96m + \033[39m in app.mongo.data(): ' + items);
    
    var response = _.map(items, function (item) {
      return {
        timestamp: item.dimensions.timestamp.getTime(),
        value: item.metrics[metric]
      };
    });

    //TODO filter in query with $exists instead
    response = _.reject(response, function (item) {
      return _.isUndefined(item.value);
    });

    res.json(response);
  }, req.query.bucket);
}

function topn(req, res) {
  var collection = etlDb.collection('aggregations');

  var limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;

  var dimension = req.query.dimension;
  var dimensionQuery = {};
  dimensionQuery['dimension_size'] = 2;
  dimensionQuery['dimensions.' + dimension] = {$exists: true};
  dimensionQuery['dimensions.logType'] = 'apache';

  collection.find(dimensionQuery)
    .sort({'metrics.count': -1 })
    .limit(limit)
    .toArray(function (err, items) {
      var response = _.map(items, function (item) {
        var dimensionName = item.dimensions[dimension];
        dimensionName = dimensionName ? dimensionName : 'Other';

        return {
          name: dimensionName,
          value: item.metrics.count
        };
      });

      res.json(response);
      //res.json(items);
    });
}

function all(req, res) {
  var collection = etlDb.collection('aggregations');
  collection.find({})
    //.limit(2000)
    .toArray(function (err, data) {
      res.json(data);
    });
}

exports.data = data;
exports.topn = topn;
exports.all = all;
