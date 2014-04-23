'use strict';

angular.module('app')
  .controller('GraphiteCtrl', function ($scope, $interval, stackedAreaChartSampleData, GraphiteTimeSeriesDataModel, RandomTopNDataModel) {
    var widgetDefinitions = [
    // {
    //   name: 'wt-top-n',
    //   dataAttrName: 'data',
    //   dataModelType: RandomTopNDataModel,
    //   style: {
    //     width: '30%'
    //   }
    // },
      // {
      //   name: 'nvd3-stacked-area-chart',
      //   attrs: {
      //     data: 'stackedAreaChartData',
      //     height: '400',
      //     showXAxis: 'true',
      //     showYAxis: 'true',
      //     xAxisTickFormat: 'xAxisTickFormat()'
      //   },
      //   style: {
      //     width: '50%'
      //   }
      // },
      
//AW
//                 <graphite url="http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/"
//                 annotations="[]"
//                 from="-6h"
//                 until="now"
//                 target="stats.amers.alpha-us1-cell.eed-erp-cprp.us1i-erpcprp01.os.cpu.usage"
//                 ></graphite>
//  
      // Graphite Alpha real data is down!
      // {
      //   name: 'RealDataAlpha',
      //   attrs: {
      //     url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
      //     from:'-6h',
      //     until: 'now',
      //     target:'stats.amers.alpha-us1-cell.eed-erp-cprp.us1i-erpcprp02.os.cpu.usage'
      //   },
      //   style: {
      //     width: '50%'
      //   }
      // },
      // CORS enabled for BETA
      // 
      {
        name: 'RealCMSDataBeta',
        directive: 'graphite',
        dataAttrName: 'graphite',
        dataModelType: GraphiteTimeSeriesDataModel,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-6h',
            until: 'now',
            target:'stats.amers.beta-ntc-cell.eui-cms-webs.ntcs-cmswebs01.os.cpu.usage'
          }
        },
        style: {
          width: '400px'
        }
      },
      // CORS not enabled for PROD
      // http://metrics.eikon-mon.int.thomsonreuters.com/render/?from=-6h&until=now&target=stats.emea.prod-dtc-pod.dcl-dcs-vect.*.os.cpu.usage
      // {
      //   name: 'RealADCDataProd',
      //   directive: 'graphite',
      //   dataAttrName: 'graphite',
      //   dataModelType: GraphiteTimeSeriesDataModel,
      //   dataModelOptions: {
      //     params: {
      //       url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
      //       from:'-6h',
      //       until: 'now',
      //       target:'stats.emea.prod-dtc-pod.dcl-dcs-vect.*.os.cpu.usage'
      //     }
      //   },
      //   style: {
      //     width: '50%'
      //   }
      // },
      // {
      //   name: 'RandomWalkAlpha',
      //   directive: 'graphite',
      //   dataAttrName: 'graphite',
      //   dataModelType: GraphiteTimeSeriesDataModel,
      //   dataModelOptions: {
      //     params: {
      //       url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
      //       from:'-1h',
      //       until: 'now',
      //       target:'randomWalk(%27random%20walk2%27)',
      //       interval: '5' // secs
      //     }
      //   },
      //   style: {
      //     width: '50%'
      //   }
      // }
    ];

    var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
      return {
        name: widgetDef.name
      };
    });

    $scope.dashboardOptions = {
      //AW TODO: Breaks my app...needs troubleshooting
      // useLocalStorage: true, 
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      //AW Set custom widget template for graphite directive at dasboard level
      // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
    };

    // nvd3-stacked-area-chart
    $scope.stackedAreaChartData = stackedAreaChartSampleData;

    $scope.xAxisTickFormat = function () {
      return function (d) {
        return d3.time.format('%x')(new Date(d));
      };
    };

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