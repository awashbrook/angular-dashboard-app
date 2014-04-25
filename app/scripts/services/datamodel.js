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

      // Setup editing options for data model using widget scope using editModalOptions
      
      // widget = WidgetModel = dataModel.widgetScope.widget  
      // Ref parent framework dashboard directive
      // https://github.com/nickholub/angular-ui-dashboard/blob/master/src/directives/dashboard.js            
      this.widgetScope.widget.editModalOptions = {
        templateUrl: 'template/widget-template.html', // from parent dashbaord framewor
        resolve: {
          widget: function () {
            return this.widgetScope.widget;
          }.bind(this),
          optionsTemplateUrl: function () {
            return 'template/graphiteOptions.html';
          }
        },
        controller: 'WidgetDialogCtrl'
      };
      
      // Do stuff with data model parameters
      
      var params = this.dataModelOptions ? this.dataModelOptions.params : {};
    
      //AW TODO do I really like this :)
      // Default Random walk if no target provided
      params.target || (params.target = [
        'randomWalk(%27random%20walk1%27)',
        'randomWalk(%27random%20walk2%27)',
        'randomWalk(%27random%20walk3%27)'
      ]);

      // Default polling interval is 30 seconds
      // TODO how to suppress interval? Setting to zero is not the same semantics as `window.setInterval`
      // https://github.com/angular/angular.js/blob/ffe5115355baa6ee2136b6fb5e4828e4e2fa58f8/src/ng/interval.js#L133
      var interval = params.interval || (interval = 30);
      
      // Main function to call graphite and update $scope.graphite in data model 
      this.callGraphite = function () {
        
        var params = this.dataModelOptions.params;
        
        $http.get(params.url, { params: {
          //AW As per https://github.com/angular/angular.js/pull/1364
          // target may be being specified multiple times as an array which graphite requires
          target: params.target,
          from: params.from,
          until: params.until,
          format: 'json' // AW
        }})
        .success(function (graphiteData) {
          // console.log('Graphite Responded');
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
        
          //AW Below partially iterative doesn't work because looping over function is BAD!
          // for (var i = 0; i < graphiteData.length; i++) {
          //   var non_nil_points = _.filter(graphiteData[i].datapoints, function(tuple) { return tuple[0] != null; } );
          //   if (non_nil_points.length == 0) { 
          //     console.log('>> WARNING >> All data was Null from Graphite!');
          //   } 
          //   graphiteData[i].datapoints = non_nil_points;
          // }          
        
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
              console.warn('Series ' + filteredGraphiteData[i].target + ' was empty from Graphite!');
            }
          }
          if (emptySeries === filteredGraphiteData.length) {
            //AW This is not the right behaviour if a new non-existant target has been given
            // TODO Will leave old data on the graph if we suppress
            // console.warn('ALL SERIES from Graphite were empty, skipping model updates!');
            console.warn('Graphite responded with NO DATA, invalid targets may have been specified: ' + this.getTarget() );
          }  else {
            // If Data received, then poll for updates...
            
            // Enable poll for pseudo-real-time graphite updates 
            this.intervalPromise = $interval(this.callGraphite, interval * 1000);
          }
          
          // TODO Empty update should propagate to graph
          console.log(JSON.stringify(filteredGraphiteData));
          // Update new graphite target
          // this.widgetScope.$apply(function() {
            // this.widgetScope.graphite = filteredGraphiteData; // TODO AW NOW Trying to get original callback working
            WidgetDataModel.prototype.updateScope.call(this, filteredGraphiteData);
          // }.bind(this)); 
          

        }.bind(this))
        .error(function (data, status) {
            console.error('AW TODO better handling:' + data);
        });
       
      }.bind(this);
      
      this.callGraphite();
      
      // Accessors used by graphite options dialog
      
      GraphiteTimeSeriesDataModel.prototype.setTarget = function (newTarget) {
        if (newTarget && (newTarget !== this.dataModelOptions.params.target )) {
        
          this.dataModelOptions.params.target = newTarget;

          // Log after updates 
          console.log(this.dataModelOptions.params);
          console.log(this);
        
          this.callGraphite();
        }
      };//.bind(this);
      
      GraphiteTimeSeriesDataModel.prototype.getTarget = function () {
        // var oldTarget = widget.dataModelOptions.params.target;
        return this.dataModelOptions.params.target;
      };///.bind(this);

      // New Helper to transform data from graphite to rickshaw / nvd3
   
      // Meteor apply below not best practice and will lose errors from updateScope() 
      // this.ddp.watch(collection, function(doc, msg) {
      //   if (msg === 'added') {
      //     that.updateScope(doc);
      //     that.widgetScope.$apply();
      //   }
      // });

      // $scope.$watch('target', function (newTarget) {
      this.widgetScope.$watch('graphite', function(graphite) {
        console.log(graphite);
        
        // TODO factor out into “interpreter” service translating between the formats
        // so the controller registers$scope.$watch(‘graphite’, $scope.nvd3Data = interpreter.translate()) (pseudo code ;) )

          if (graphite) {
            var rickshawSeries = _.map(graphite, function(result) {
              /*AW Convert to Rickshaw Series
              Sample Rickshaw Series
              {
                  name: "Convergence",
                  data: [{x:1, y: 4}, {x:2, y:27}, {x:3, y:6}]
              },
              {
                  name: "Divergence",
                  data: [{x:1, y: 5}, {x:2, y:2}, {x:3, y:9}]
              }*/

              return {
                  color: '#6060c0',
                  data:   _.map(result.datapoints, function(datapoint) {
                      return {
                          x: datapoint[1],
                          y: datapoint[0]
                        };
                    }),
                  name: result.target
                };
            });
            console.log("Received Rickshaw Series" + JSON.stringify(rickshawSeries));
            
//             this.widgetScope.$apply(function() {
              // this.widgetScope.rickshaw = rickshawSeries; 
              WidgetDataModel.prototype.updateScope.call(this, rickshawSeries);              
              // this.updateScope(rickshawSeries);
//             }.bind(this)); 
          }     
      }.bind(this)); 
      
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