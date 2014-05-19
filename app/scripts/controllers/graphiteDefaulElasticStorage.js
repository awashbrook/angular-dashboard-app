'use strict';

// Storage enabled for this...this will be what a fresh dashboard will look like for new team
angular.module('app')
  .controller('GraphiteDefaultElasticStorageCtrl', function ($scope, $interval, $route, $routeParams, elasticStorage, nvd3ChartDefAttrs, WidgetDefaults) {

    // Chart Options
    $scope.colorFunction = WidgetDefaults.colorFunction;
    $scope.xAxisTickFormat = WidgetDefaults.xAxisTickFormat;
    $scope.yAxisTickFormat = WidgetDefaults.yAxisTickFormat;
    $scope.xFunction = WidgetDefaults.xFunction;
    $scope.yFunction = WidgetDefaults.yFunction;

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

    //  http://compass/#/dashboard/graphiteDefaultBackendStorage?id=<dashboard-storage-id>
    //
    //  $routeParams ==> {dashboard: graphiteDefaultBackendStorage,id:<dashboard-storage-id>}
    //
    //      http://deansofer.com/posts/view/14/AngularJs-Tips-and-Tricks-UPDATED#routing
    $scope.$on('$routeChangeSuccess', function(event, routeData){
      var routeParams = routeData.params;
      // console.log(routeParams);
      var dynamicDashboardId = routeParams.id || 'graphite-default-elastic-storage';
      console.log("Your dashboard id: " + dynamicDashboardId);

      $scope.dashboardOptions = {
        storage: elasticStorage,
        storageId: dynamicDashboardId,
        explicitSave: true,
        widgetButtons: true,
        widgetDefinitions: WidgetDefaults.widgetDefaultDefinitions,
        defaultWidgets: WidgetDefaults.defaultWidgets
        //AW Set custom widget template for graphite directive at dashboard level
        // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
      };
    });

  });
