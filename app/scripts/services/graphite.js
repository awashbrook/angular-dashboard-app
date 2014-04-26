'use strict';

// TODO factor out into “interpreter” service translating between the formats
// so the controller registers$scope.$watch(‘graphite’, $scope.nvd3Data = interpreter.translate()) (pseudo code ;) )

angular.module('app.service')
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
  });

    

    
    // AW Jan's Rickshaw series Graphite controller from Capman
    // Not ideal with params from directive scope passed...
    // How can we better share data between directive scope and utility functions in services?!  
    
    // This is NOT USED, for the record only
    // 
    // fetchRickshawSeries: function(url, target, from, until) {
    //   var deferred = $q.defer();
    // 
    //   $http.get(url, { params: {
    //       target: target,
    //       from: from,
    //       until: until,
    //       format: 'json' // AW
    //   }}).success(function (data) {
    //       var seriesData = _.map(data, function(result) {
    //           return {
    //               color: '#6060c0',
    //               data:   _.map(result.datapoints, function(datapoint) {
    //                   return {
    //                       x: datapoint[1],
    //                       y: datapoint[0]
    //                   };
    //               }),
    //               name: result.target
    //           };
    //       });
    // 
    //       deferred.resolve(seriesData);
    //   }).
    //   error(function (data, status) {
    //       deferred.reject(status);
    //   });
    // 
    //   return deferred.promise;
    // }
