'use strict';

// Storage enabled for this...this will be what a fresh dashboard will look like for new team
angular.module('app')
  .controller('GraphiteDefaultBackendStorageCtrl', function ($scope, $interval, es, nvd3ChartDefAttrs, WidgetDefaults) {

    es.ping({
      // ping usually has a 100ms timeout
      requestTimeout: 1000,

      // undocumented params are appended to the query string
      hello: "elasticsearch!"
    }).then(function (body) {
      console.log('All is well with Elastic Search');
    }, function (error) {
      console.trace('Elastic Search cluster is down!');
      console.trace(error.message);
    });

    var esStorage = null; // TODO

    $scope.dashboardOptions = {
//      storage: esStorage,
//      storageId: 'andy-dashboard-graphite-default-backend-storage',
      widgetButtons: true,
      widgetDefinitions: WidgetDefaults.widgetDefaultDefinitions,
      defaultWidgets: WidgetDefaults.defaultWidgets
      //AW Set custom widget template for graphite directive at dasboard level
      // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
    };

    // Chart Options
    $scope.xAxisTickFormat = WidgetDefaults.xAxisTickFormat;
    $scope.colorFunction = WidgetDefaults.colorFunction;
      
    // external controls
    $scope.addWidget = function (directive) {
      $scope.dashboardOptions.addWidget({
        name: directive
      });
    };

    $scope.addWidgetScopeWatch = function () {
      $scope.dashboardOptions.addWidget({
        name: 'scope-watch',
        attrs: {
          value: 'randomValue'
        }
      });
    };
  });
