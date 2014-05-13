'use strict';

angular.module('app')
  .controller('DataCloudCtrl', function ($scope, $window, nvd3ChartDefAttrs, WidgetDefaults, GraphiteTimeSeriesDataModel) {

    var widgetDefinitions = [
    {
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
          target: ['stats.amers.beta-hdc-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '400px'
      }
    },
    {
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
          target: ['stats.amers.beta-hdc-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    },
    {
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
          target: ['stats.emea.prod-dtc-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '400px'
      }
    },
    {
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
          target: ['stats.emea.prod-dtc-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    },
    {
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
          target: ['stats.amers.prod-hdc-pod.dcl-dcs-igst.*.os.cpu.usage']
        }
      },
      style: {
        width: '400px'
      }
    },
    {
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
          target: ['stats.amers.prod-hdc-pod.dcl-dcs-vect.*.os.cpu.usage']
        }
      },
      style: {
        width: '800px'
      }
    },
      {
        name: 'nvStackedBetaCMS',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.amers.beta-ntc-cell.eui-cms-*.*.os.cpu.usage']
            // target: ['stats.amers.beta-hdc-pod.dcl-dcs-igst.*.os.cpu.usage']
          }
        },
        style: {
          width: '800px'
        }
      },
      {
        name: 'nvStackedBeta',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.amers.beta-hdc-pod.dcl-dcs-*.*.os.cpu.usage']
          }
        },
        style: {
          width: '800px'
        }
      },
      {
        name: 'nvStackedAmers',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.amers.prod-hdc-pod.dcl-dcs-*.*.os.cpu.usage']
          }
        },
        style: {
          width: '800px'
        }
      },
      {
        name: 'nvStackedEmea',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.emea.prod-dtc-pod.dcl-dcs-*.*.os.cpu.usage']
          }
        },
        style: {
          width: '800px'
        }
      }
    ];

    // // Make all widgets default
    // var defaultWidgets = [
    //   { name: 'nvLineBetaIgst' },
    //   { name: 'nvLineBetaVect' },
    //   { name: 'nvLineAmersIgst' },
    //   { name: 'nvLineAmersVect' },
    //   { name: 'nvLineEmeaIgst' },
    //   { name: 'nvLineEmeaVect' }
    // ];

    // // Make all widgets default
    // var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
    //   return {
    //     name: widgetDef.name
    //   };
    // });

    $scope.dashboardOptions = {
      storage: $window.localStorage,
      storageId: 'andy-dashboard-datacloud',
      widgetButtons: true,
      widgetDefinitions: WidgetDefaults.widgetDefaultDefinitions.concat(widgetDefinitions),
      defaultWidgets: WidgetDefaults.defaultWidgets
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
