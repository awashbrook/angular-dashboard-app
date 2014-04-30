'use strict';

angular.module('app')
  .controller('GraphiteOptionsCtrl', function ($scope, GraphiteDatasource) {

    var dsConfig = {type: "graphite", url: "http://metrics.alpha.eikon-mon.int.thomsonreuters.com", default: true, name: "graphite"};
          
    var ds = new GraphiteDatasource(dsConfig);
    
    //
    var widget = $scope.widget;

    if (widget && widget.dataModel /* && widget.dataModel instanceof GraphiteTimeSeriesDataModel */) {
    
      // Target is the entire model of graphite controller
      $scope.target  = widget.dataModel.getTarget();
      // var oldTarget = widget.dataModelOptions.params.target;
    
      $scope.$watch('target', function (newTarget) {
        console.log(widget.title + ' graphite model options changed ' + newTarget);
        widget.dataModel.setTarget(newTarget);
        // Log after updates ... the widget dataModelOptions are a snapshot from initial state of dashboard
        // They are not updated like the data source...so this can be misleading?!!!
        console.log(widget);
      }, true); // deepWatch == true to monitor the entire array
      
      ///////
      
      // var target = widget.dataModel.getTarget();

      // My widget and grafana conflict on $scope.target - enumarable for grafana, not for me
      
      // do something on scope with target, e.g. [ target ].
      // $scope.targets = [ target ];
      // $scope.target = [
      //   'randomWalk(%27random%20walk1%27)',
      //   'randomWalk(%27random%20walk2%27)',
      //   'randomWalk(%27random%20walk3%27)'
      //   ];
    }

  });
