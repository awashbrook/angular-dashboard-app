'use strict';

angular.module('app.service', ['app.websocket']);

angular.module('app.service')
  .factory('PieChartDataModel', function (WebSocketDataModel) {
    function PieChartDataModel() {
    }

    PieChartDataModel.prototype = Object.create(WebSocketDataModel.prototype);

    PieChartDataModel.prototype.init = function () {
      WebSocketDataModel.prototype.init.call(this);
      this.data = [];
    };

    PieChartDataModel.prototype.update = function (newTopic) {
      WebSocketDataModel.prototype.update.call(this, newTopic);
    };

    PieChartDataModel.prototype.updateScope = function (value) {
      var sum = _.reduce(value, function (memo, item) {
        return memo + parseFloat(item.value);
      }, 0);

      var sectors = _.map(value, function (item) {
        return {
          key: item.label,
          y: item.value / sum
        };
      });

      sectors = _.sortBy(sectors, function (item) {
        return item.key;
      });

      WebSocketDataModel.prototype.updateScope.call(this, sectors);
    };

    return PieChartDataModel;
  })
  .factory('TimeSeriesDataModel', function (WebSocketDataModel) {
    function TimeSeriesDataModel() {
    }

    TimeSeriesDataModel.prototype = Object.create(WebSocketDataModel.prototype);

    TimeSeriesDataModel.prototype.init = function () {
      WebSocketDataModel.prototype.init.call(this);
    };

    TimeSeriesDataModel.prototype.update = function (newTopic) {
      WebSocketDataModel.prototype.update.call(this, newTopic);
      this.items = [];
    };

    TimeSeriesDataModel.prototype.updateScope = function (value) {
      value = _.isArray(value) ? value[0] : value;

      this.items.push({
        timestamp: parseInt(value.timestamp, 10), //TODO
        value: parseInt(value.value, 10) //TODO
      });

      if (this.items.length > 100) { //TODO
        this.items.shift();
      }

      var chart = {
        data: this.items,
        max: 30
      };

      WebSocketDataModel.prototype.updateScope.call(this, chart);
      this.data = [];
    };

    return TimeSeriesDataModel;
  })
  .factory('RestTimeSeriesDataModel', function (settings, WidgetDataModel, $http) {
    function RestTimeSeriesDataModel() {
    }

    RestTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RestTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);

      var params = this.dataModelOptions ? this.dataModelOptions.params : {};

      $http.get('/data', {
        params: params
      }).success(function (data) {
          var chart = {
            data: data,
            chartOptions: { vAxis: {} }
          };

          WidgetDataModel.prototype.updateScope.call(this, chart);
        }.bind(this));
    };

    return RestTimeSeriesDataModel;
  })
  .factory('GraphiteTimeSeriesDataModel', function (settings, WidgetDataModel, $http, $interval) {
    function GraphiteTimeSeriesDataModel() {
    }

    GraphiteTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    GraphiteTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this); // super is a no-op today!

      var params = this.dataModelOptions ? this.dataModelOptions.params : {};
    
      // Default Random walk if no target provided
      params.target || (params.target = 'randomWalk(%27random%20walk2%27)');

      // Default polling interval is 30 seconds
      var interval = params.interval;
      interval || (interval = 30);
      
      this.callGraphite = function () {
        
         var params = this.dataModelOptions.params;
      
        $http.get(params.url, { params: {
          // TODO support target being specified multiple times, which we can't pass in this hash method!
          target: params.target,
          from: params.from,
          until: params.until,
          format: 'json' // AW
        }})
        .success(function (graphiteData) {
          console.log('Graphite Responded');
          // console.log(JSON.stringify(graphiteData));
          
          // Strip out null data points: this is how we did it dashing with Ruby
          
          // graphite = [
          //     {
          //       target: "stats_counts.http.ok",
          //       datapoints: [[10, 1378449600], [40, 1378452000], [53, 1378454400], [63, 1378456800], [27, 1378459200]]
          //     },
          //     {
          //       target: "stats_counts.http.err",
          //       datapoints: [[0, 1378449600], [4, 1378452000], [nil, 1378454400], [3, 1378456800], [0, 1378459200]]
          //     }
          //   ]

          // result.each do |stats|
          //   non_nil_points = (stats[:datapoints].select { |point| not point[0].nil? })    
          //   if non_nil_points.size == 0
          //     puts ">> WARNING >> All data was Null for for #{url_path_and_query}" 
          //   end
          //   stats[:datapoints] = non_nil_points 
          // end
        
          var filteredGraphiteData = _.map(graphiteData, function(stats) {
            return {
              target: stats.target,
              datapoints: _.filter(stats.datapoints, function(tuple) { return tuple[0] != null; } )
            };
          });

          // console.log(JSON.stringify(filteredGraphiteData));

          var emptySeries = 0;
          for (var i = 0; i < filteredGraphiteData.length; i++) {
            if (filteredGraphiteData[i].datapoints == 0) {
              emptySeries++;
              console.log('WARNING> Series ' + filteredGraphiteData[i].target + ' was empty from Graphite!');
            }
          }
          if (emptySeries === filteredGraphiteData.length) {
            console.log('WARNING>> ALL SERIES from Graphite were empty, skipping model updates!!');
          } else {
            console.log(JSON.stringify(filteredGraphiteData));
            WidgetDataModel.prototype.updateScope.call(this, filteredGraphiteData);
          }

          //AW Below partially iterative doesn't work because looping over function is BAD!
          // for (var i = 0; i < graphiteData.length; i++) {
          //   var non_nil_points = _.filter(graphiteData[i].datapoints, function(tuple) { return tuple[0] != null; } );
          //   if (non_nil_points.length == 0) { 
          //     console.log('>> WARNING >> All data was Null from Graphite!');
          //   } 
          //   graphiteData[i].datapoints = non_nil_points;
          // }          

        }.bind(this))
        .error(function (data, status) {
            console.log('AW TODO better handling:' + status);
        });
       
      }.bind(this);
      
      this.callGraphite();
      
      this.intervalPromise = $interval(function () {
        this.callGraphite();
      }.bind(this), interval * 1000);
      
      // Target updated by options dialog. Copied from Meteor below
      GraphiteTimeSeriesDataModel.prototype.update = function (target) {
        // target || (target = this.dataModelOptions.params.target);
        
        this.dataModelOptions.params.target = target;
        
        this.callGraphite();
        
        // var that = this;
        // 
        // this.ddp.watch(collection, function(value) {
        //   //console.log(value);
        //   that.updateScope(value);
        //   that.widgetScope.$apply();
        // });
      }.bind(this);
      
    };

    GraphiteTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return GraphiteTimeSeriesDataModel;
  })
  .factory('MeteorTimeSeriesDataModel', function (settings, MeteorDdp, WidgetDataModel) {
    function MeteorTimeSeriesDataModel() {
      var ddp = new MeteorDdp(settings.meteorURL); //TODO
      this.ddp = ddp;

      var that = this;

      ddp.connect().done(function() {
        console.log('Meteor connected');
        that.update();
      });
    }

    MeteorTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MeteorTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);
    };

    //TODO
    MeteorTimeSeriesDataModel.prototype.update = function (collection) {
      this.items = [];
      collection = collection ? collection : this.dataModelOptions.collection;

      this.ddp.subscribe(collection); //TODO

      var that = this;

      this.ddp.watch(collection, function(doc, msg) {
        if (msg === 'added') {
          that.updateScope(doc);
          that.widgetScope.$apply();
        }
      });
    };

    MeteorTimeSeriesDataModel.prototype.updateScope = function (value) {
      if (value.hasOwnProperty('history')) {
        //console.log(_.pluck(value.history, 'timestamp'));
        this.items.push.apply(this.items, value.history);
      } else {
        this.items.push(value);
      }

      if (this.items.length > 100) { //TODO
        this.items.splice(0, this.items.length - 100);
      }

      var chart = {
        data: this.items,
        max: 30
      };

      WidgetDataModel.prototype.updateScope.call(this, chart);
      this.data = [];
    };

    return MeteorTimeSeriesDataModel;
  })
  .factory('MeteorDataModel', function (settings, MeteorDdp, WidgetDataModel) {
    function MeteorTimeSeriesDataModel() {
      var ddp = new MeteorDdp(settings.meteorURL); //TODO
      this.ddp = ddp;

      var that = this;

      ddp.connect().done(function() {
        console.log('Meteor connected');
        that.update();
      });
    }

    MeteorTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MeteorTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this);
    };

    //TODO
    MeteorTimeSeriesDataModel.prototype.update = function (collection) {
      this.items = [];
      collection = collection ? collection : this.dataModelOptions.collection;

      this.ddp.subscribe(collection); //TODO get whole collection instead of 'added' events

      var that = this;

      this.ddp.watch(collection, function(value) {
        //console.log(value);
        that.updateScope(value);
        that.widgetScope.$apply();
      });
    };

    return MeteorTimeSeriesDataModel;
  })
  .factory('WebSocketDataModel', function (WidgetDataModel, webSocket) {
    function WebSocketDataModel() {
    }

    WebSocketDataModel.prototype = Object.create(WidgetDataModel.prototype);

    WebSocketDataModel.prototype.init = function () {
      this.topic = null;
      this.callback = null;
      if (this.dataModelOptions && this.dataModelOptions.defaultTopic) {
        this.update(this.dataModelOptions.defaultTopic);
      }
    };

    WebSocketDataModel.prototype.update = function (newTopic) {
      var that = this;

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }

      this.callback = function (message) {
        that.updateScope(message);
        that.widgetScope.$apply();
      };

      this.topic = newTopic;
      webSocket.subscribe(this.topic, this.callback, this.widgetScope);
    };

    WebSocketDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);

      if (this.topic && this.callback) {
        webSocket.unsubscribe(this.topic, this.callback);
      }
    };

    return WebSocketDataModel;
  })
  .factory('RandomValueDataModel', function (WidgetDataModel, $interval) {
    function RandomValueDataModel() {
    }

    RandomValueDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomValueDataModel.prototype.init = function () {
      var base = Math.floor(Math.random() * 10) * 10;

      this.updateScope(base);

      var that = this;

      this.intervalPromise = $interval(function () {
        var random = base + Math.random();
        that.updateScope(random);
      }, 500);
    };

    RandomValueDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomValueDataModel;
  })
  .factory('RandomTopNDataModel', function (WidgetDataModel, $interval) {
    function RandomTopNDataModel() {
    }

    RandomTopNDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomTopNDataModel.prototype.init = function () {
      this.intervalPromise = $interval(function () {
        var topTen = _.map(_.range(0, 10), function (index) {
          return {
            name: 'item' + index,
            value: Math.floor(Math.random() * 100)
          };
        });
        this.updateScope(topTen);
      }.bind(this), 500);
    };

    RandomTopNDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomTopNDataModel;
  })
  .factory('RandomTimeSeriesDataModel', function (WidgetDataModel, $interval) {
    function RandomTimeSeriesDataModel() {
    }

    RandomTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    RandomTimeSeriesDataModel.prototype.init = function () {
      var max = 30;
      var data = [];
      var chartValue = 50;

      function nextValue() {
        chartValue += Math.random() * 40 - 20;
        chartValue = chartValue < 0 ? 0 : chartValue > 100 ? 100 : chartValue;
        return chartValue;
      }

      var now = Date.now();
      for (var i = max - 1; i >= 0; i--) {
        data.push({
          timestamp: now - i * 1000,
          value: nextValue()
        });
      }
      var chart = {
        data: data,
        max: max,
        chartOptions: {
          vAxis: {}
        }
      };
      this.updateScope(chart);

      this.intervalPromise = $interval(function () {
        data.shift();
        data.push({
          timestamp: Date.now(),
          value: nextValue()
        });

        var chart = {
          data: data,
          max: max
        };

        this.updateScope(chart);
      }.bind(this), 1000);
    };

    RandomTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };

    return RandomTimeSeriesDataModel;
  });