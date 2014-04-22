'use strict';

angular.module('app')
  .controller('GraphiteOptionsCtrl', function ($scope) {

    var widget = $scope.widget;

    if (widget && widget.dataModel) {
    
      // TODO introduce accessors on model
      var oldTarget = widget.dataModelOptions.params.target;
      
      $scope.target = oldTarget;
      
      $scope.$watch('target', function (newTarget) {
        if (newTarget && (newTarget !== oldTarget)) {
          // This callback is detecting and somehow logging the previous change, NOT the last one!
          console.log(widget.title + ' graphite model options changed ' + newTarget);
          console.log(widget.dataModel.dataModelOptions.params);
          console.log(widget);
          console.log(widget.dataModel);
          widget.dataModel.update(newTarget);
        }
      });

      // What's this
      $scope.selecttarget = function (target) {
        $scope.target = target;
      };
    }
  });
