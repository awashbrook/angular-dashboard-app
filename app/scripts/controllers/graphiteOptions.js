'use strict';

angular.module('app')
  .controller('GraphiteOptionsCtrl', function (_, $scope, GraphiteDatasource) {

    // Graphite Editor Integration
    // var dsConfig = {type: "graphite", url: "http://metrics.alpha.eikon-mon.int.thomsonreuters.com", default: true, name: "graphite"};
    //       
    // var dsConfig = new GraphiteDatasource(dsConfig);    
    //
    var widget = $scope.widget;

    if (widget && widget.dataModel /* && widget.dataModel instanceof GraphiteTimeSeriesDataModel */) {

      // var oldTarget = widget.dataModelOptions.params.target;
      
      // Map native string array to array of objects with string property so $watch works!
      var targets = _.map(widget.dataModel.getTarget(), function(target) {
        return {
          'target': target
        };
      });
      // console.log("Setting target in options model scope: " + JSON.stringify(targets));

      // var filteredGraphiteData = _.map(graphiteData, function(stats) {
      //   return {
      //     target: stats.target,
      //     datapoints: _.filter(stats.datapoints, function(tuple) { return tuple[0] != null; } )
      //   };
      // });
      // 
      // Target is the entire model of graphite controller
      $scope.targets = targets;
    
      // Need watch of array values for target changes, deepest kind of watch
      $scope.$watch('targets', function (newTarget) {
        if (newTarget) {
          console.log(widget.title + ' graphite model options changed: ' + JSON.stringify(newTarget));
          // Reverse map native string array to array of objects with string property so $watch works!
          var newTargets = _.map(newTarget, function(target) {
            return target.target;
          });
        }
        widget.dataModel.setTarget(newTargets);
        // Log after updates ... the widget dataModelOptions are a snapshot from initial state of dashboard
        // They are not updated like the data source...so this can be misleading?!!!
        console.log(widget);
      }, true); // deepWatch == true to monitor the entire array
      
      ///////
      
      // var target = widget.dataModel.getTarget();

      // My widget and grafana conflict on $scope.target - enumarable for grafana, not for me
      
    }

  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  