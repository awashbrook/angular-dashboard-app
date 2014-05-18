'use strict';

// Storage enabled for this...this will be what a fresh dashboard will look like for new team
angular.module('app')
  .controller('GraphiteDefaultLocalStorageCtrl', function ($scope, $window, $interval, nvd3ChartDefAttrs, WidgetDefaults) {

    $scope.dashboardOptions = {
      storage: $window.localStorage,
      storageId: 'andy-dashboard-graphite-default-local-storage',
      explicitSave: true,
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
