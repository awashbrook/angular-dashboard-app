'use strict';

angular.module('app')
  .controller('GraphiteOptionsCtrl', function ($scope) {

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
      });

      // What's this
      $scope.selecttarget = function (target) {
        $scope.target = target;
      };
    }
  });
