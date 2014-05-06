'use strict';

angular.module('app')
  .controller('GraphiteCtrl', function ($scope, $interval, stackedAreaChartSampleData, GraphiteTimeSeriesDataModel) {
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'         
        },
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'
        },
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          noData: 'No data for you Doc! Please edit graphite target...',        
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'
        },
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'
        },
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
        attrs: {
          height: 400,
          showXAxis: true,
          showYAxis: true,
          xAxisTickFormat: 'xAxisTickFormat()',
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          // showControls: true,        
          color: "colorFunction()",
          forcey: '[0,2]'
        },
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'
        },
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
        attrs: {
          height: '350',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()',
          color: "colorFunction()",
          noData: 'No data for you Doc! Please edit graphite target...',        
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          isArea: true,   
          forcey: '[0,2]'
        },
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
        attrs: {
          height: 350,
          showXAxis: true,
          showYAxis: true,
          xAxisTickFormat: 'xAxisTickFormat()',
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          color: "colorFunction()"
        },
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
        attrs: {
          height: 350,
          showXAxis: true,
          showYAxis: true,
          xAxisTickFormat: 'xAxisTickFormat()',
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          showLegend: true,        
          color: "colorFunction()"
        },
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-1h',
            until: 'now',
            // target:'randomWalk("random walk 2")', // No target: default random walk is three
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

    
    // D3.color() schemes nvd3/test/stackedAreaChartTest.html
    // var d3scheme = d3.scale.category10(); // Primary Colors
    // var d3scheme = d3.scale.category20(); // Very Reuters like, also the default
    var d3scheme = d3.scale.category20b(); // Subtle shades of purple
    // var d3scheme = d3.scale.category20c(); // Subtle shades of blue
    var keyColor = function(d, i) {
      return d3scheme(d.key);
    };    
    // Switch color scheme here
    $scope.colorFunction = function() { 
      return keyColor;
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