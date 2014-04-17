'use strict';

angular.module('ui.dashboard.widgets')
  .directive('graphite', function () {
      return {
          restrict: 'EA',
          replace:  true,
          templateUrl: 'scripts/widgets/graphite/graphite.tpl.html',
          scope: {
              url:    '@',
              target: '@', // AW changed from '='
              from:   '@',
              until:  '@',
              annotations: '=',
              graphite: '=' //AW Manged by AD as per dataAttrName=’graphite’
          },
          // AW Factor out
          controller: ['$scope', '$rootScope', '$timeout', 'Gateway', function ($scope, $rootScope, $timeout, Gateway) {

              //JM todo: implement a Rickshaw.Graph.Promise similar to Rickshaw.Graph.AJAX
              $scope.fetchSeriesData = Gateway.fetchRickshawSeries;
              
              var renderingScheduled;
              $rootScope.$watch('windowWidth', function () {
                  if (! renderingScheduled) {
                      renderingScheduled = $timeout(function() {
                          $scope.render();

                          $timeout.cancel(renderingScheduled);
                          renderingScheduled = undefined;
                      }, 500);
                  }
              });
          }],
          link: function (scope, element) {
              var container = element[0],
                  chart     = container.getElementsByClassName('chart')[0],
                  preview   = container.getElementsByClassName('preview')[0],
                  timeline  = container.getElementsByClassName('timeline')[0];

              // initialise the series; can't be empty otherwise the graph will not render
              scope.series = [{ color: 'steelblue', name:  scope.target, data:  [ {x:0, y:0} ] }];

              var graph = new Rickshaw.Graph({
                  element:  chart,
                  renderer: 'line',
                  series:   scope.series
              });

              var xAxis = new Rickshaw.Graph.Axis.Time( {
                  graph: graph,
                  timeFixture: new Rickshaw.Fixtures.Time.Local()
              } );

              xAxis.render();

              var yAxis = new Rickshaw.Graph.Axis.Y({ graph: graph });

              yAxis.render();

              graph.render();

              // hover

              new Rickshaw.Graph.HoverDetail( {
                  graph: graph,
                  formatter: function(series, x, y) {
                      var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
                      var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                      var content = swatch + series.name + ': ' + parseInt(y) + '<br /> >' + date;
                      return content;
                  }
              } );

              // preview

              var previewGraph = new Rickshaw.Graph.RangeSlider.Preview( {
                  graph:   graph,
                  element: preview,
                  height:  75          // todo: if it's not hard-coded it's not correctly picked up. why?
              });

              previewGraph.render();

              var previewXAxis = new Rickshaw.Graph.Axis.Time({
                  graph: previewGraph.previews[0],
                  timeFixture: new Rickshaw.Fixtures.Time.Local()
              });

              previewXAxis.render();

              // annotations

              var annotator = new Rickshaw.Graph.Annotate( {
                  graph:   graph,
                  element: timeline
              } );
            
              //AW TODO Update for DataModel
              scope.$watch('graphite', function (graphite) {
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
                  scope.updateWith(rickshawSeries);
                  scope.render();
                }
              });

              // //JM update methods
              // scope.fetchRickshawSeriesData(scope.url, scope.target, scope.from, scope.until).then(function(series) {
              //     scope.updateWith(series);
              //     scope.render();
              // });
  
              scope.updateWith = function(series) {
                  // need to hold a reference to scope.series, that's why a simple assignment won't work.
                  scope.series.length = 0;

                  _.map(series, function(aSerie) { scope.series.push(aSerie); });

                  angular.forEach(scope.annotations, function(annotation) {
                      annotator.add(annotation.time, annotation.content, annotation.end);
                  });

                  annotator.update();
              };

              scope.render = function () {
                  graph.configure({        width: angular.element(container).width() });
                  previewGraph.configure({ width: angular.element(chart).width() });

                  graph.render();
                  previewGraph.render();
                  previewXAxis.render();
              };
          }
      };
  });

  // .run(['$rootScope', '$window', function ($rootScope, $window) {
  //     $rootScope.windowWidth = $window.outerWidth;
  // 
  //     angular.element($window).bind('resize', function () {
  //         $rootScope.windowWidth = $window.outerWidth;
  //         $rootScope.$apply('windowWidth');
  //     });
  // }]);