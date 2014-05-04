'use strict';
//
// Real Graphite Data Service
//
angular.module('app.service')
  .factory('GraphiteTimeSeriesDataModel', function (_, settings, WidgetDataModel, Graphite2NVD3, $http, $interval) {
    function GraphiteTimeSeriesDataModel() {}

    // TODO factor out into “interpreter” service translating between the formats
    // so the controller registers$scope.$watch(‘graphite’, $scope.nvd3Data = interpreter.translate()) (pseudo code ;) )

    GraphiteTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    GraphiteTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this); // super is a no-op today!

      // Setup editing options for data model using widget scope using editModalOptions
      
      // widget = WidgetModel = dataModel.widgetScope.widget  
      // Ref parent framework dashboard directive
      // https://github.com/nickholub/angular-ui-dashboard/blob/master/src/directives/dashboard.js            
      this.widgetScope.widget.editModalOptions = {
        templateUrl: 'template/widget-template.html', // from parent dashbaord framework  
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
            console.warn('Graphite responded with NO DATA, invalid targets may have been specified: ' + this.getTarget() );
          }  else {
            // If Data received, then poll for updates...enable pseudo-real-time graphite updates 

            // TODO Suppress below until we need to tear down the poll when $destroy called
            // this.intervalPromise = $interval(this.callGraphite, interval * 1000);
            
          }
          
          // Empty updates should still propagate to graph and clear of give "No Data Available"
          // This works really well with NVD3 giving "No Data Available" and leaving old data set up!
          // TODO: Does NOT work with Rickshaw which chokes on empty series today!
          
          // console.log(JSON.stringify(filteredGraphiteData));
          
          //
          // For multiple series, we should abbreviate the targets so they show succinctly in chart legend
          // 
          if (filteredGraphiteData.length > 1) {
            filteredGraphiteData = _.map(filteredGraphiteData, function(stats) {
              return {
                  datapoints: stats.datapoints,
                  target: this.shortenMetricName(stats.target)
              };
            }.bind(this));
          }
                    
          // Update new graphite target
          // this.widgetScope.$apply(function() {
          // this.widgetScope.graphite = filteredGraphiteData;
          WidgetDataModel.prototype.updateScope.call(this, Graphite2NVD3.convert(filteredGraphiteData));            
          // }.bind(this)); 
          
        }.bind(this))
        .error(function (data, status) {
            console.error('Graphite Rejected' + data);
        });
       
      }.bind(this); // end callGraphite()
      
      // Accessors used here and in graphite target editor 
      
      GraphiteTimeSeriesDataModel.prototype.setTarget = function (newTarget) {
        if (newTarget && (!angular.equals(this.dataModelOptions.params.target, newTarget))) {
        
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
      
      // For wildcard series, shorten the name of each series down by just displaying what wildcards resolve to!
      this.shortenMetricName = function(metric) {
        // var metric = 'stats.emea.prod-dtc-cell.eui-cms-webs.dtcp-cmswebs01.vertx.java.JVMMemory.HeapMemoryUsage_used';
        // var target         = 'stats.emea.prod-dtc-cell.eui-cms-*.dtcp-cmswebs*.vertx.java.JVMMemory.HeapMemoryUsage_used';
        
        // How to escape user input in a regex
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        // function escapeRegExp(string){
        //   return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        // }

        var targets = this.getTarget();
        for (var i = 0; i < targets.length; i++) { 
          if (targets[i].indexOf('*') < 0) continue; // Skip if no wildcards in this target
          
          // TODO Cache these when setTarget()
          var reString = targets[i]
            .replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1") // Escape everything apart from wildcard
            .replace(/[*]/g, "(\\S+)"); // Converts wildcard asterix to parenthetic substring match 
          // e.g. stats\.emea\.prod-dtc-cell\.eui-cms-(\S+)\.dtcp-cmswebs(\S+)\.vertx\.java\.JVMMemory\.HeapMemoryUsage_usedMemoryUsage_used
          var re = new RegExp(reString);
          
          // Test whether returned metric matches this particular target
          if (re.test(metric)) {
            var wildcardMatches = re.exec(metric); // First array element is entire string
            var shortTarget = "";
            for (i = 1; i < wildcardMatches.length; i++) { shortTarget += wildcardMatches[i] + ' '; }
            console.log('Abbreviated subject ' + metric + ' to ' + shortTarget);
            return shortTarget;                     
          }
        }
        // Attempt to shorten metric...if no wildcards then return original target
        return metric;
      };

      //
      // Do stuff with data model parameters
      //
      
      var params = this.dataModelOptions ? this.dataModelOptions.params : {};
    
      //AW TODO do I really like this: Rafe does!
      
      // Default Random walk if no target provided
      // params.target || (params.target = 
      this.getTarget() || this.setTarget(
        [
        // 'randomWalk(%27random%20walk2%27)',
        'randomWalk("random walk 1")',
        'randomWalk("random walk 2")',
        'randomWalk("random walk 3")',
        ]
      );

      // Default polling interval is 30 seconds
      // TODO how to suppress interval? Setting to zero is not the same semantics as `window.setInterval`
      // https://github.com/angular/angular.js/blob/ffe5115355baa6ee2136b6fb5e4828e4e2fa58f8/src/ng/interval.js#L133
      var interval = params.interval || (interval = 30);
      
      this.callGraphite();
      
    };

    GraphiteTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };
    
    return GraphiteTimeSeriesDataModel;
  })
  //
  // Canned Graphite Data Source - Rotating Sample Data with illusion of real time updates
  //
  .factory('SampleGraphiteTimeSeriesDataModel', function (WidgetDataModel,  $interval, graphiteSampleData, Graphite2NVD3) {
    function SampleGraphiteTimeSeriesDataModel() {}
    
    SampleGraphiteTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    SampleGraphiteTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this); // super is a no-op today!

      var i = 0;
      // Main function to call graphite and update $scope.graphite in data model 
      this.callGraphite = function () {        
        // console.log(JSON.stringify(graphiteSampleData));
        this.widgetScope.graphite = [ graphiteSampleData[i % graphiteSampleData.length] ];
        i++;
      }.bind(this);
            
      this.callGraphite();
      
      // Enable poll for pseudo-real-time graphite updates 
      this.intervalPromise = $interval(this.callGraphite, 5 * 1000);
      
      this.widgetScope.$watch('graphite', function(graphite) {
        // console.log(graphite);                
        WidgetDataModel.prototype.updateScope.call(this, Graphite2NVD3.convert(graphite));        
      }.bind(this));
    };
  
    SampleGraphiteTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };
    return SampleGraphiteTimeSeriesDataModel;
  })
  //
  // Canned Graphite Data Source - Multi Series
  //
  .factory('MultiSampleGraphiteTimeSeriesDataModel', function (WidgetDataModel,  $interval, graphiteSampleData, Graphite2NVD3) {
    function MultiSampleGraphiteTimeSeriesDataModel() {}
    
    MultiSampleGraphiteTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);

    MultiSampleGraphiteTimeSeriesDataModel.prototype.init = function () {
      WidgetDataModel.prototype.init.call(this); // super is a no-op today!
  
      this.widgetScope.graphite = graphiteSampleData;
      
      this.widgetScope.$watch('graphite', function(graphite) {
        // console.log(graphite);                
        WidgetDataModel.prototype.updateScope.call(this, Graphite2NVD3.convert(graphite));        
      }.bind(this));
    };    

    MultiSampleGraphiteTimeSeriesDataModel.prototype.destroy = function () {
      WidgetDataModel.prototype.destroy.call(this);
      $interval.cancel(this.intervalPromise);
    };
    return MultiSampleGraphiteTimeSeriesDataModel;
  })
  
  //
  // Helper service to shortenMetricName
  //
  // .service('shortenMetricName', function (metric, targets) {
  //   function Graphite2NVD3() {}
  // 
  //   // console.log(graphite);
  //   // this.widgetScope.$watch('graphite', function(graphite) {
  //   
  //   Graphite2NVD3.convert = function (graphite) {
  //     var nvd3Series;
  //     if (graphite) {
  //       nvd3Series = _.map(graphite, function(result) {
  //         // All chart libraries use Unix epoch 
  //         // Graphite uses second since epoch
  //         // 1393940460
  //         // NVD3 uses milliseconds since epoch
  //         // 1062302400000
  //         // Sample NVD3 Series
  //         /*AW Convert to NVD3 Series
  //          [
  //           {
  //             key: 'Series 1',
  //             values: [
  //               [ 1051675200000 , 0] ,
  //               [ 1054353600000 , 7.2481659343222] ,
  //               [ 1056945600000 , 9.2512381306992] ,
  //               [ 1059624000000 , 11.341210982529] ,
  //         }*/
  //         return {
  //             values:   _.map(result.datapoints, function(datapoint) {
  //                 return [
  //                     datapoint[1] * 1000,
  //                     datapoint[0]
  //                     ];
  //               }),
  //             key: result.target
  //           };
  //       });
  //       
  //       //         
  //       // console.log("Generated NVD3 Series" + JSON.stringify(nvd3Series));
  //       // WidgetDataModel.prototype.updateScope.call(this, nvd3Series);
  //     }
  //     return nvd3Series;
  //        
  //     // }.bind(this));
  //   };
  //       
  //   return Graphite2NVD3;
  // })

  //
  // Helper service to convert graphite series to NVD3
  //
  .service('Graphite2NVD3', function () {
    function Graphite2NVD3() {}

    // console.log(graphite);
    // this.widgetScope.$watch('graphite', function(graphite) {
    
    Graphite2NVD3.convert = function (graphite) {
      var nvd3Series;
      if (graphite) {
        nvd3Series = _.map(graphite, function(result) {
          // All chart libraries use Unix epoch 
          // Graphite uses second since epoch
          // 1393940460
          // NVD3 uses milliseconds since epoch
          // 1062302400000
          // Sample NVD3 Series
          /*AW Convert to NVD3 Series
           [
            {
              key: 'Series 1',
              values: [
                [ 1051675200000 , 0] ,
                [ 1054353600000 , 7.2481659343222] ,
                [ 1056945600000 , 9.2512381306992] ,
                [ 1059624000000 , 11.341210982529] ,
          }*/
          return {
              values:   _.map(result.datapoints, function(datapoint) {
                  return [
                      datapoint[1] * 1000,
                      datapoint[0]
                      ];
                }),
              key: result.target
            };
        });
        
        //         
        // console.log("Generated NVD3 Series" + JSON.stringify(nvd3Series));
        // WidgetDataModel.prototype.updateScope.call(this, nvd3Series);
      }
      return nvd3Series;
         
      // }.bind(this));
    };
        
    return Graphite2NVD3;
  })
  // i = 0
  // 
  // SCHEDULER.every '1s' do
  //  
  //   # graphite = [
  //   #     {
  //   #       target: "stats_counts.http.ok",
  //   #       datapoints: [[10, 1378449600], [40, 1378452000], [53, 1378454400], [63, 1378456800], [27, 1378459200]]
  //   #     },
  //   #     {
  //   #       target: "stats_counts.http.err",
  //   #       datapoints: [[0, 1378449600], [4, 1378452000], [nil, 1378454400], [3, 1378456800], [0, 1378459200]]
  //   #     }
  //   #   ]
  //   #   send_event('graphite', series: graphite)
  // 
  // 
  //   send_event('graphite1', series: [ graphite[0] ])
  //   send_event('graphite2', series: [ graphite[1] ])
  //   send_event('graphite3', series: [ graphite[2] ])
  //   send_event('graphite4', series: [ graphite[3] ])
  // 
  //   # send_event('graphite-overlay', series: [ graphite[0], graphite[1], graphite[2], graphite[3] ] )
  // 
  //   send_event('graphite-cyclic', series: [ graphite[i % graphite.size] ] )
  //   i += 1;
  // 
  // end
//   .service('SampleGraphiteTimeSeriesDataModel', function (WidgetDataModel,  $interval, graphiteSampleData) {
//     function SampleGraphiteTimeSeriesDataModel() {}
//     
//     SampleGraphiteTimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);
// 
//     SampleGraphiteTimeSeriesDataModel.prototype.init = function () {
//       WidgetDataModel.prototype.init.call(this); // super is a no-op today!
//     
//       var i = 0;
//       
//       // Main function to call graphite and update $scope.graphite in data model 
//       this.callGraphite = function () {
//         
//         console.log(JSON.stringify(graphiteSampleData));
//         // WidgetDataModel.prototype.updateScope.call(this, graphiteSampleData);
//         this.widgetScope.graphite = [ graphiteSampleData[i % graphiteSampleData.length] ];
//         i++;
//       }.bind(this);
//             
//       this.callGraphite();
//       
//       // Enable poll for pseudo-real-time graphite updates 
//       this.intervalPromise = $interval(this.callGraphite, 5 * 1000);
//       
//       // $scope.$watch('target', function (newTarget) {
//       this.widgetScope.$watch('graphite', function(graphite) {
//         console.log(graphite);
//         
//         // TODO factor out into “interpreter” service translating between the formats
//         // so the controller registers$scope.$watch(‘graphite’, $scope.nvd3Data = interpreter.translate()) (pseudo code ;) )
// 
//           if (graphite) {
//             var rickshawSeries = _.map(graphite, function(result) {
//               /*AW Convert to Rickshaw Series
//               Sample Rickshaw Series
//               {
//                   name: "Convergence",
//                   data: [{x:1, y: 4}, {x:2, y:27}, {x:3, y:6}]
//               },
//               {
//                   name: "Divergence",
//                   data: [{x:1, y: 5}, {x:2, y:2}, {x:3, y:9}]
//               }*/
//               return {
//                   color: '#6060c0',
//                   data:   _.map(result.datapoints, function(datapoint) {
//                       return {
//                           x: datapoint[1],
//                           y: datapoint[0]
//                         };
//                     }),
//                   name: result.target
//                 };
//             });
//             console.log("Generated Rickshaw Series" + JSON.stringify(rickshawSeries));
// //             this.widgetScope.$apply(function() {
//               // this.widgetScope.rickshaw = rickshawSeries; 
//               WidgetDataModel.prototype.updateScope.call(this, rickshawSeries);
//               // this.updateScope(rickshawSeries);
// //             }.bind(this)); 
//           }     
//       }.bind(this));
//     };
//   
//     SampleGraphiteTimeSeriesDataModel.prototype.destroy = function () {
//       WidgetDataModel.prototype.destroy.call(this);
//       $interval.cancel(this.intervalPromise);
//     };
//     return SampleGraphiteTimeSeriesDataModel;
//   })
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

  // ##AW Canned graphite data borrowed from PageExpress team web servers - java heap size
  .constant('graphiteSampleData', [
    {target: 'stats.emea.prod-dtc-cell.eui-cms-webs.dtcp-cmswebs01.vertx.java.JVMMemory.HeapMemoryUsage_used', datapoints:[[145561968.0, 1393940460], [161468000.0, 1393940520], [183372360.0, 1393940580], [195551280.0, 1393940640], [211625112.0, 1393940700], [226806072.0, 1393940760], [240809528.0, 1393940820], [265477784.0, 1393940880], [281125480.0, 1393940940], [294207696.0, 1393941000], [40151384.0, 1393941060], [60778888.0, 1393941120], [80040552.0, 1393941180], [97355304.0, 1393941240], [115744152.0, 1393941300], [136844672.0, 1393941360], [154855408.0, 1393941420], [172395016.0, 1393941480], [190152920.0, 1393941540], [222155968.0, 1393941600], [239150280.0, 1393941660], [254723208.0, 1393941720], [276428640.0, 1393941780], [298084376.0, 1393941840], [51283616.0, 1393941900], [71519568.0, 1393941960], [88634368.0, 1393942020], [105755040.0, 1393942080], [118324872.0, 1393942140], [132072840.0, 1393942200], [152523808.0, 1393942260], [164986584.0, 1393942320], [188770120.0, 1393942380], [204255168.0, 1393942440], [223768744.0, 1393942500], [236046456.0, 1393942560], [248284304.0, 1393942620], [267007696.0, 1393942680], [287735664.0, 1393942740], [35080600.0, 1393942800], [47666024.0, 1393942860], [63181136.0, 1393942920], [79476168.0, 1393942980], [100293632.0, 1393943040], [116395512.0, 1393943100], [133125736.0, 1393943160], [145369400.0, 1393943220], [161035232.0, 1393943280], [173284048.0, 1393943340], [191897776.0, 1393943400], [207686504.0, 1393943460], [221450288.0, 1393943520], [242167536.0, 1393943580], [259846536.0, 1393943640], [272448176.0, 1393943700], [284961400.0, 1393943760], [38135656.0, 1393943820], [54188792.0, 1393943880], [76655664.0, 1393943940], [95209408.0, 1393944000], [116205280.0, 1393944060], [128611392.0, 1393944120], [148218336.0, 1393944180], [164901376.0, 1393944240], [187916608.0, 1393944300], [210523488.0, 1393944360], [226125216.0, 1393944420], [243894960.0, 1393944480], [261177144.0, 1393944540], [295347736.0, 1393944600], [47526384.0, 1393944660], [59858384.0, 1393944720], [72049864.0, 1393944780], [85687768.0, 1393944840], [99997704.0, 1393944900], [112265208.0, 1393944960], [129231368.0, 1393945020], [150177472.0, 1393945080], [164717592.0, 1393945140], [177157112.0, 1393945200], [193164616.0, 1393945260], [210704480.0, 1393945320], [226468456.0, 1393945380], [239247528.0, 1393945440], [251720496.0, 1393945500], [269999824.0, 1393945560], [289644432.0, 1393945620], [35417632.0, 1393945680], [49391792.0, 1393945740], [78161528.0, 1393945800], [93774920.0, 1393945860], [108774480.0, 1393945920], [121218968.0, 1393945980], [133936440.0, 1393946040], [150956048.0, 1393946100], [163273800.0, 1393946160], [182454608.0, 1393946220], [198257216.0, 1393946280], [226108800.0, 1393946340], [246445480.0, 1393946400], [265876712.0, 1393946460], [286664528.0, 1393946520], [33217192.0, 1393946580], [46821728.0, 1393946640], [59125992.0, 1393946700], [74798968.0, 1393946760], [90478856.0, 1393946820], [105818488.0, 1393946880], [126949944.0, 1393946940], [142522960.0, 1393947000], [155503600.0, 1393947060], [171020704.0, 1393947120], [189828144.0, 1393947180], [204861656.0, 1393947240], [217704984.0, 1393947300], [233062632.0, 1393947360], [258050696.0, 1393947420], [276850424.0, 1393947480], [289512320.0, 1393947540]]},
    {target: 'stats.emea.prod-dtc-cell.eui-cms-webs.dtcp-cmswebs02.vertx.java.JVMMemory.HeapMemoryUsage_used', datapoints:[[235129904.0, 1393940460], [253482760.0, 1393940520], [265760224.0, 1393940580], [278077160.0, 1393940640], [35252704.0, 1393940700], [53309960.0, 1393940760], [65793152.0, 1393940820], [83793456.0, 1393940880], [96761088.0, 1393940940], [109071168.0, 1393941000], [125142360.0, 1393941060], [139711872.0, 1393941120], [157453272.0, 1393941180], [170196464.0, 1393941240], [193538432.0, 1393941300], [209227704.0, 1393941360], [227129640.0, 1393941420], [242766176.0, 1393941480], [258474776.0, 1393941540], [277309344.0, 1393941600], [29806424.0, 1393941660], [50511984.0, 1393941720], [73182840.0, 1393941780], [92652488.0, 1393941840], [114741072.0, 1393941900], [136063832.0, 1393941960], [157623376.0, 1393942020], [173069328.0, 1393942080], [189468520.0, 1393942140], [214819216.0, 1393942200], [236813872.0, 1393942260], [251129336.0, 1393942320], [263540944.0, 1393942380], [275945152.0, 1393942440], [37936840.0, 1393942500], [56280584.0, 1393942560], [79657536.0, 1393942620], [95597328.0, 1393942680], [111305112.0, 1393942740], [125626088.0, 1393942800], [137891480.0, 1393942860], [162238808.0, 1393942920], [179263088.0, 1393942980], [199237936.0, 1393943040], [211455040.0, 1393943100], [223769288.0, 1393943160], [240045304.0, 1393943220], [256623176.0, 1393943280], [269225280.0, 1393943340], [285336336.0, 1393943400], [31481920.0, 1393943460], [51993536.0, 1393943520], [73194392.0, 1393943580], [89547752.0, 1393943640], [104797888.0, 1393943700], [131391416.0, 1393943760], [144452520.0, 1393943820], [156739984.0, 1393943880], [175734536.0, 1393943940], [188254520.0, 1393944000], [209236496.0, 1393944060], [231159320.0, 1393944120], [252105424.0, 1393944180], [266252728.0, 1393944240], [279397800.0, 1393944300], [35878168.0, 1393944360], [56186248.0, 1393944420], [84610760.0, 1393944480], [100696176.0, 1393944540], [115557944.0, 1393944600], [134815272.0, 1393944660], [149440776.0, 1393944720], [161908752.0, 1393944780], [174459632.0, 1393944840], [186723208.0, 1393944900], [199579136.0, 1393944960], [214145424.0, 1393945020], [229029832.0, 1393945080], [241278976.0, 1393945140], [256842136.0, 1393945200], [269449400.0, 1393945260], [283917480.0, 1393945320], [37159008.0, 1393945380], [49506712.0, 1393945440], [69043992.0, 1393945500], [81812184.0, 1393945560], [100039784.0, 1393945620], [118834936.0, 1393945680], [131995976.0, 1393945740], [149830344.0, 1393945800], [162225160.0, 1393945860], [184905808.0, 1393945920], [197138160.0, 1393945980], [209432824.0, 1393946040], [225474776.0, 1393946100], [248553416.0, 1393946160], [260793464.0, 1393946220], [279947344.0, 1393946280], [293882368.0, 1393946340], [56003520.0, 1393946400], [75681888.0, 1393946460], [91908512.0, 1393946520], [104365584.0, 1393946580], [122873496.0, 1393946640], [139321456.0, 1393946700], [151677288.0, 1393946760], [164177600.0, 1393946820], [184386424.0, 1393946880], [196657984.0, 1393946940], [219912864.0, 1393947000], [241139784.0, 1393947060], [253529472.0, 1393947120], [265698376.0, 1393947180], [282234504.0, 1393947240], [33363720.0, 1393947300], [46149264.0, 1393947360], [63635120.0, 1393947420], [81545912.0, 1393947480], [93978008.0, 1393947540]]},
    {target: 'stats.emea.prod-dtc-cell.eui-cms-webs.dtcp-cmswebs03.vertx.java.JVMMemory.HeapMemoryUsage_used', datapoints:[[106241400.0, 1393940460], [124356920.0, 1393940520], [136911032.0, 1393940580], [149807408.0, 1393940640], [162221640.0, 1393940700], [177884960.0, 1393940760], [195594944.0, 1393940820], [210527504.0, 1393940880], [223318392.0, 1393940940], [237396416.0, 1393941000], [253169504.0, 1393941060], [275016352.0, 1393941120], [296617112.0, 1393941180], [47358592.0, 1393941240], [67454704.0, 1393941300], [85406224.0, 1393941360], [102110968.0, 1393941420], [119904216.0, 1393941480], [141186752.0, 1393941540], [163469896.0, 1393941600], [183576664.0, 1393941660], [209404248.0, 1393941720], [225033264.0, 1393941780], [244241720.0, 1393941840], [263168512.0, 1393941900], [281459472.0, 1393941960], [297377928.0, 1393942020], [42347744.0, 1393942080], [54675472.0, 1393942140], [70553944.0, 1393942200], [83212240.0, 1393942260], [95616976.0, 1393942320], [108799896.0, 1393942380], [124201408.0, 1393942440], [152388112.0, 1393942500], [164743552.0, 1393942560], [186743152.0, 1393942620], [199353832.0, 1393942680], [218172160.0, 1393942740], [239158280.0, 1393942800], [251746912.0, 1393942860], [277406168.0, 1393942920], [299041168.0, 1393942980], [52141064.0, 1393943040], [73975320.0, 1393943100], [86416408.0, 1393943160], [100683480.0, 1393943220], [117015008.0, 1393943280], [129322656.0, 1393943340], [145335944.0, 1393943400], [157683904.0, 1393943460], [176171176.0, 1393943520], [200489264.0, 1393943580], [221400176.0, 1393943640], [233635768.0, 1393943700], [252307112.0, 1393943760], [265273368.0, 1393943820], [278043160.0, 1393943880], [290927448.0, 1393943940], [39280320.0, 1393944000], [64352912.0, 1393944060], [79316096.0, 1393944120], [100313816.0, 1393944180], [118835040.0, 1393944240], [149221384.0, 1393944300], [168960264.0, 1393944360], [181840160.0, 1393944420], [204510016.0, 1393944480], [222646488.0, 1393944540], [242971272.0, 1393944600], [267835768.0, 1393944660], [285965896.0, 1393944720], [39347592.0, 1393944780], [55337504.0, 1393944840], [73758904.0, 1393944900], [91520936.0, 1393944960], [107345608.0, 1393945020], [120263016.0, 1393945080], [134068624.0, 1393945140], [146396616.0, 1393945200], [161828400.0, 1393945260], [176437064.0, 1393945320], [194388312.0, 1393945380], [207156088.0, 1393945440], [226034208.0, 1393945500], [240829944.0, 1393945560], [263839312.0, 1393945620], [276071680.0, 1393945680], [292312248.0, 1393945740], [42283728.0, 1393945800], [58023632.0, 1393945860], [78461472.0, 1393945920], [92940592.0, 1393945980], [105628760.0, 1393946040], [124866616.0, 1393946100], [145429984.0, 1393946160], [163459216.0, 1393946220], [181203632.0, 1393946280], [196612848.0, 1393946340], [208790240.0, 1393946400], [230575520.0, 1393946460], [246406536.0, 1393946520], [266605440.0, 1393946580], [281131400.0, 1393946640], [299485696.0, 1393946700], [46972104.0, 1393946760], [61389680.0, 1393946820], [79384728.0, 1393946880], [93885672.0, 1393946940], [107426800.0, 1393947000], [127476360.0, 1393947060], [140258528.0, 1393947120], [155776224.0, 1393947180], [168120368.0, 1393947240], [183988448.0, 1393947300], [204426496.0, 1393947360], [218851496.0, 1393947420], [233561944.0, 1393947480], [250398616.0, 1393947540]]},
    {target: 'stats.emea.prod-dtc-cell.eui-cms-webs.dtcp-cmswebs04.vertx.java.JVMMemory.HeapMemoryUsage_used', datapoints:[[268451392.0, 1393940460], [282683144.0, 1393940520], [298979608.0, 1393940580], [43716728.0, 1393940640], [59950488.0, 1393940700], [77875448.0, 1393940760], [98389584.0, 1393940820], [120574664.0, 1393940880], [140587016.0, 1393940940], [156903104.0, 1393941000], [175736464.0, 1393941060], [193364184.0, 1393941120], [209308968.0, 1393941180], [226120016.0, 1393941240], [238417904.0, 1393941300], [261597616.0, 1393941360], [281210232.0, 1393941420], [299471552.0, 1393941480], [50503344.0, 1393941540], [67930376.0, 1393941600], [92268112.0, 1393941660], [115203976.0, 1393941720], [137238256.0, 1393941780], [156170392.0, 1393941840], [174833240.0, 1393941900], [194241576.0, 1393941960], [208762952.0, 1393942020], [226667576.0, 1393942080], [251726560.0, 1393942140], [269638248.0, 1393942200], [294864264.0, 1393942260], [46533336.0, 1393942320], [59013952.0, 1393942380], [74795744.0, 1393942440], [92528496.0, 1393942500], [105133632.0, 1393942560], [117716976.0, 1393942620], [142452432.0, 1393942680], [162156560.0, 1393942740], [181354192.0, 1393942800], [193776280.0, 1393942860], [211773936.0, 1393942920], [229664240.0, 1393942980], [253734496.0, 1393943040], [272285496.0, 1393943100], [284721080.0, 1393943160], [33879256.0, 1393943220], [50061632.0, 1393943280], [66155432.0, 1393943340], [80395560.0, 1393943400], [94775880.0, 1393943460], [108575560.0, 1393943520], [124844104.0, 1393943580], [145002200.0, 1393943640], [157207712.0, 1393943700], [178242776.0, 1393943760], [196749664.0, 1393943820], [208984776.0, 1393943880], [228439960.0, 1393943940], [241987728.0, 1393944000], [260641232.0, 1393944060], [279827416.0, 1393944120], [294495216.0, 1393944180], [46750504.0, 1393944240], [67888000.0, 1393944300], [91756216.0, 1393944360], [115643616.0, 1393944420], [135569784.0, 1393944480], [153921416.0, 1393944540], [176446584.0, 1393944600], [189659648.0, 1393944660], [210884912.0, 1393944720], [224735608.0, 1393944780], [237000840.0, 1393944840], [249680552.0, 1393944900], [265649168.0, 1393944960], [279247608.0, 1393945020], [296137040.0, 1393945080], [42137840.0, 1393945140], [54459088.0, 1393945200], [73146080.0, 1393945260], [85680600.0, 1393945320], [108270504.0, 1393945380], [125174528.0, 1393945440], [144832424.0, 1393945500], [159450616.0, 1393945560], [178283432.0, 1393945620], [190890200.0, 1393945680], [205053680.0, 1393945740], [219737856.0, 1393945800], [239942720.0, 1393945860], [265438136.0, 1393945920], [286053376.0, 1393945980], [298234952.0, 1393946040], [46581016.0, 1393946100], [65216864.0, 1393946160], [83747720.0, 1393946220], [99563168.0, 1393946280], [123922272.0, 1393946340], [136580288.0, 1393946400], [150681184.0, 1393946460], [173560064.0, 1393946520], [189358568.0, 1393946580], [201608552.0, 1393946640], [213879984.0, 1393946700], [235837648.0, 1393946760], [248025656.0, 1393946820], [264158344.0, 1393946880], [278478744.0, 1393946940], [293660752.0, 1393947000], [38437840.0, 1393947060], [56784600.0, 1393947120], [72983680.0, 1393947180], [88166248.0, 1393947240], [104338952.0, 1393947300], [121935840.0, 1393947360], [144223192.0, 1393947420], [163532080.0, 1393947480], [179362576.0, 1393947540]]}
  ]);
      
    // AW Jan's Rickshaw series Graphite controller from Capman
    // Not ideal with params from directive scope passed...
    // How can we better share data between directive scope and utility functions in services?!  
    // 
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
