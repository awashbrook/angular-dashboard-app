'use strict';

angular.module('app')
  .controller('DataCloudCtrl', function ($scope, WidgetDefaultsCtrl, GraphiteTimeSeriesDataModel) {
         
  var attributes = {
      isArea: true,   
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
    };
            
    var widgetDefinitions = [
    {
      name: 'nvLineBetaIgst',
      directive: 'nvd3-line-chart',
      dataAttrName: 'data',
      dataModelType: GraphiteTimeSeriesDataModel,
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.amers.beta-hdc-pod.dcl-dcs-(igst).*.os.cpu.usage']
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
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.amers.beta-hdc-pod.dcl-dcs-(vect).*.os.cpu.usage']
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
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.emea.prod-dtc-pod.dcl-dcs-(igst).*.os.cpu.usage']
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
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.emea.prod-dtc-pod.dcl-dcs-(vect).*.os.cpu.usage']
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
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.amers.prod-hdc-pod.dcl-dcs-(igst).*.os.cpu.usage']
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
      attrs: attributes,
      dataModelOptions: {
        params: {
          url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
          from:'-48h',
          until: 'now',
          target: ['stats.amers.prod-hdc-pod.dcl-dcs-(vect).*.os.cpu.usage']
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
        attrs: attributes,
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
        attrs: attributes,
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
        attrs: attributes,
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
        attrs: attributes,
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
      //AW TODO: Breaks my app...needs troubleshooting
      // useLocalStorage: true, 
      widgetButtons: true,
      widgetDefinitions: WidgetDefaultsCtrl.widgetDefinitions.concat(widgetDefinitions),
      defaultWidgets: WidgetDefaultsCtrl.defaultWidgets,
      //AW Set custom widget template for graphite directive at dasboard level
      // optionsTemplateUrl: 'scripts/widgets/graphite/graphite-options.tpl.html'
    };

    $scope.xAxisTickFormat = function () {
      return function (d) {
        return d3.time.format('%x')(new Date(d));
      };
    };

    
    // D3.color() schemes nvd3/test/stackedAreaChartTest.html
    // var d3scheme = d3.scale.category10(); // Primary Colors
    var d3scheme = d3.scale.category20(); // Very Reuters like, also the default
    //var d3scheme = d3.scale.category20b(); // Subtle shades of purple
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