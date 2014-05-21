  'use strict';

angular.module('app')
  .controller('GraphiteOptionsCtrl', function (_, $scope, GraphiteDatasource) {

    // Graphite Editor Integration
    var dsConfig = {type: "graphite", url: "http://metrics.alpha.eikon-mon.int.thomsonreuters.com", default: true, name: "graphite"};

    // Set in scope for Grafana code
    $scope.datasource = new GraphiteDatasource(dsConfig);

    //
    // Deal with Angular Dashboard widgets
    //

    var widget = $scope.widget;

    if (widget && widget.dataModel /* && widget.dataModel instanceof GraphiteTimeSeriesDataModel */) {

        // Handle updating targets in data model when changes made in options

        // Map native string array to array of objects with string property so $watch works!
        var targets = _.map(widget.dataModel.getTarget(), function (target) {
            return {
                'target': target
            };
        });

        // console.log("Setting target in options model scope: " + JSON.stringify(targets));
        $scope.targets = targets;

        // Need watch of array values for target changes, deepest kind of watch, need for editing values
        $scope.$watch('targets', function (newTarget) {
            if (newTarget) {
                // Reverse map native string array to array of objects with string property so $watch works!
                var newTargets = _.map(newTarget, function (target) {
                    return target.target;
                });
                widget.dataModel.setTarget(newTargets);
                // Log after updates ... the widget dataModelOptions are a snapshot from initial state of dashboard
                // They are not updated like the data source...so this can be misleading?!!!
                console.log(widget);
            }
        }, true); // deepWatch == true to monitor the entire array

//      // Map native object hash to array of objects with string property so $watch works!
//      var mapModelProperties = function (object) {
//        // This is the structure of collection we can $watch changes in for
//        //  { keyName: { keyValue: value } }
//        return _.map(object, function (value, key) {
//          var keyValue = {};
//          keyValue[key] = value;
//          var hash = {};
//          hash[key] = keyValue;
//          return hash;
//        });
//      }
//
//      // Handle updating interval from and until in data model when changes made in options
//      // Data model will return interval { from,  until }
//      var interval = mapModelProperties({ from: '-1h',  until: 'now'});
//
//
//      // Need watch of array values for target changes, deepest kind of watch, need for editing values
//      $scope.$watch('interval', function (newInterval) {
//        if (newInterval) {
//          // TODO Reverse map native string array to array of objects with string property so $watch works!
////          var newTargets = _.map(newTarget, function (target) {
////            return target.target;
////          });
////          widget.dataModel.setTarget(newTargets);
//          // Log after updates ... the widget dataModelOptions are a snapshot from initial state of dashboard
//          // They are not updated like the data source...so this can be misleading?!!!
//          console.log(widget);
//        }
//      }, true); // deepWatch == true to monitor the entire array
//
//
//    // This is collection we want to watch changes in attrs.attrName for
////        { attrName: { attrValue: value } }
////        var attrs = _.forEach(widget.attrs, function(value, key){
////           return {
////             key: { 'attrValue': value }
////           };
////        });
////
//        $scope.attrs = attrs;
//        $scope.attrs = widget.attrs;
//
////      if (newTarget && (!angular.equals(this.dataModelOptions.params.target, newTarget)))
////
////        console.log(this.widgetScope.widget.title + ' graphite model options changed: ' + JSON.stringify(newTarget));
//         widget.editModalOptions.resolve

    }

    });










