'use strict';

angular.module('app')
  .controller('GraphiteSamplesCtrl', function ($scope, $window, $interval, nvd3ChartDefAttrs, WidgetDefaults, GraphiteTimeSeriesDataModel) {
    var widgetDefinitions = [
    
      //AW This is how Rickshaw graphite widget was invoked in previous project
      //                 <graphite url="http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/"
      //                 annotations="[]"
      //                 from="-6h"
      //                 until="now"
      //                 target="stats.amers.alpha-us1-cell.eed-erp-cprp.us1i-erpcprp01.os.cpu.usage"
      //                 ></graphite>
      //  
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
      //     }
      //   },
      //   style: {
      //     width: '50%'
      //   }
      // },
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
      // {
      //   name: 'RandomWalkBeta',
      //   directive: 'rickshaw',
      //   dataAttrName: 'rickshaw',
      //   dataModelType: GraphiteTimeSeriesDataModel,
      //   dataModelOptions: {
      //     params: {
      //       url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
      //       from:'-1h',
      //       until: 'now',
      //       target:'randomWalk(%27random%20walk2%27)',
      //     }
      //   },
      //   style: {
      //     width: '400px'
      //   }
      // }
      // CORS enabled for BETA      
      // {
      //   name: 'RealCMSDataBeta',
      //   directive: 'rickshaw',
      //   dataAttrName: 'rickshaw',
      //   dataModelType: GraphiteTimeSeriesDataModel,
      //   dataModelOptions: {
      //     params: {
      //       url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
      //       from:'-6h',
      //       until: 'now',
      //       target:'stats.amers.beta-ntc-cell.eui-cms-webs.ntcs-cmswebs01.os.cpu.usage'
      //     }
      //   },
      //   style: {
      //     width: '400px'
      //   }
      // },

      {
        name: 'nvSingleTargetAlpha',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.amers.alpha-us1-cell.eed-erp-cprp.*.os.cpu.usage']
          }
        },
        style: {
          width: '400px'
        }
      },     
      {
        name: 'nvTwoTargetsAlpha',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
            from:'-6h',
            until: 'now',
            target: ['stats.amers.alpha-us1-cell.eed-erp-cprp.us1i-erpcprp01.os.cpu.usage','stats.amers.alpha-us1-cell.eed-erp-cprp.us1i-erpcprp02.os.cpu.usage']
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        name: 'nvSingleTargetBeta',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-48h',
            until: 'now',
            target: ['stats.amers.beta-ntc-cell.eui-cms-*.*.os.cpu.usage']
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        name: 'nvDataCloudBeta',
        directive: 'nvd3-line-chart',
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
            target: ['stats.amers.beta-ntc-cell.eui-cms-*.*.os.cpu.usage']
          }
        },
        style: {
          width: '800px'
        }
      },
      {
        name: 'nvDataCloudProd',
        directive: 'nvd3-line-chart',
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
        name: 'nvTwoTargetsBeta',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-6h',
            until: 'now',
            target: ['stats.amers.beta-ntc-cell.eui-cms-webs.ntcs-cmswebs01.os.cpu.usage','stats.amers.beta-ntc-cell.eui-cms-webs.ntcs-cmswebs02.os.cpu.usage']
          }
        },
        style: {
          width: '400px'
        }
      },     
      {
        name: 'nvRandomWalkAlpha',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
            from:'-1h',
            until: 'now',
            // target:'randomWalk("random walk 2")', // No target: default random walk is three
            $interval: 10
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        name: 'nvRandomWalkBeta',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: nvd3ChartDefAttrs,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-1h',
            until: 'now'
            // target:'randomWalk("random walk 2")', // No target: default random walk is three
          }
        },
        style: {
          width: '400px'
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

    // Make all widgets default
    var defaultWidgets = [
      {
        name: 'nvRandomWalkBeta'
      }
    ];
     
    // Make all widgets default
    // var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
  //     return {
  //       name: widgetDef.name
  //     };
  //   });

    $scope.dashboardOptions = {
      storage: $window.localStorage,
      storageId: 'andy-dashboard-graphite',
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
      //AW Set custom widget template for graphite directive at dasboard level
      // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
    };

    // Chart Options
    $scope.xAxisTickFormat = WidgetDefaults.xAxisTickFormat;
    $scope.colorFunction = WidgetDefaults.colorFunction;
    // external controls

      
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
