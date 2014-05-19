'use strict';

// Storage enabled for this...this will be what a fresh dashboard will look like for new team
angular.module('app')
  .controller('GraphiteDefaultElasticStorageCtrl', function ($scope, $interval, elasticStorage, nvd3ChartDefAttrs, WidgetDefaults) {

    var index = 'malhar-dash';
    var type = 'dashboard';
    var storageId = 'andy-dashboard-graphite-default-backend-storage6';
//    var sampleMalharDashboard = {"widgets":[{"title":"Mat","name":"nvLineChartAlpha","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"random walk 1\")","randomWalk(\"random walk 2\")","randomWalk(\"random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}},{"title":"Jan","name":"nvLineChartBeta","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"andy random walk 1\")","randomWalk(\"olivier random walk 2\")","randomWalk(\"fabrice random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}},{"title":"Widget 3","name":"nvLineChartProd","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"random walk 1\")","randomWalk(\"random walk 2\")","randomWalk(\"random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}}]};

    $scope.dashboardOptions = {
      storage: elasticStorage,
      storageId: storageId,
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
