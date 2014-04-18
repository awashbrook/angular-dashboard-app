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
