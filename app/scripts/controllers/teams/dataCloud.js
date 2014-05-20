  'use strict';

angular.module('app')
  .controller('DataCloudCtrl', function ($scope, $window, elasticStorage, nvd3ChartDefAttrs, WidgetDefaults, GraphiteTimeSeriesDataModel) {

    var widgetDefinitions = [
    {
      title: 'ADC BETA Ingestion CPU',
      name: 'nvLineBetaIgst',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.amers.beta-hdc-pod.dcl-dcs-(igst).*.os.cpu.usage']
          target: ['stats.amers.*-*-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '480px'
      }
    },
    {
      title: 'ADC BETA Vectorwize CPU',
      name: 'nvLineBetaVect',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.amers.beta-hdc-pod.dcl-dcs-(vect).*.os.cpu.usage']
          target: ['stats.amers.*-*-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    },
    {
      title: 'ADC EMEA Ingestion CPU',
      name: 'nvLineEmeaIgst',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.emea.prod-dtc-pod.dcl-dcs-(igst).*.os.cpu.usage']
          target: ['stats.emea.*-*-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '480px'
      }
    },
    {
      title: 'ADC EMEA Vectorwize CPU',
      name: 'nvLineEmeaVect',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.emea.prod-dtc-pod.dcl-dcs-(vect).*.os.cpu.usage']
          target: ['stats.emea.*-*-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    },
    {
      title: 'ADC EMEA Ingestion CPU',
      name: 'nvLineAmersIgst',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.amers.prod-hdc-pod.dcl-dcs-(igst).*.os.cpu.usage']
          target: ['stats.amers.*-*-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '480px'
      }
    },
    {
      title: 'ADC AMERS Vectorwize CPU',
      name: 'nvLineAmersVect',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: nvd3ChartDefAttrs,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
//          target: ['stats.amers.prod-hdc-pod.dcl-dcs-(vect).*.os.cpu.usage']
          target: ['stats.amers.*-*-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    }
    ];

    // Make all widgets default
    var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
      return {
        name: widgetDef.name
      };
    });

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
      var dynamicDashboardId = routeParams.id || 'dashboard-datacloud-sample';
      console.log("Your dashboard id: " + dynamicDashboardId);

      $scope.dashboardOptions = {
        storage: elasticStorage,
        storageId: dynamicDashboardId,
        explicitSave: true,
        widgetButtons: true,
        widgetDefinitions: WidgetDefaults.widgetDefaultDefinitions.concat(widgetDefinitions), // Superset of default and data cloud widgets
        defaultWidgets: defaultWidgets  // Default to data cloud demo spec
        //AW Set custom widget template for graphite directive at dashboard level
        // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
      };
    });
  });
