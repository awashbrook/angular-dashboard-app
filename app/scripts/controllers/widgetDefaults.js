'use strict';

angular.module('app')
  .controller('WidgetDefaultsCtrl', function ($scope, $interval, GraphiteTimeSeriesDataModel) {
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
        name: 'nvLineChartAlpha',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: attributes,
        dataModelOptions: {
          params: {
            url: 'http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/',
            from:'-2h',
            until: 'now',
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        name: 'nvLineChartBeta',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: attributes,
        dataModelOptions: {
          params: {
            url: 'http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/',
            from:'-2h',
            until: 'now',
          }
        },
        style: {
          width: '400px'
        }
      },
      {
        name: 'nvLineChartProd',
        directive: 'nvd3-line-chart',
        dataAttrName: 'data',
        dataModelType: GraphiteTimeSeriesDataModel,
        attrs: attributes,
        dataModelOptions: {
          params: {
            url: 'http://metrics.eikon-mon.int.thomsonreuters.com/render/',
            from:'-2h',
            until: 'now',
          }
        },
        style: {
          width: '400px'
        }
      }
    ];
     
    // Make all widgets default
    var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
      return {
        name: widgetDef.name
      };
    });

    // You can surf the default dashboard directly...it is a prototype after all
    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
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
    // var d3scheme = d3.scale.category20(); // Very Reuters like, also the default
    // var d3scheme = d3.scale.category20b(); // Subtle shades of purple
    var d3scheme = d3.scale.category20c(); // Subtle shades of blue
    var keyColor = function(d, i) {
      return d3scheme(d.key);
    };    
    // From angularjs-nvd3-directives/examples/cumulativeLineChart.html
    // var indexedColors = ['#ffa500', '#c80032', '#0000ff', '#6464ff'];
    // From dashing preferred rickshaw chart
    // var indexedColors = [rgba(96,170,255,0.8),rgba(96,170,255,0.6),rgba(96,170,255,0.4),rgba(96,170,255,0.2)];
    // var indexedColors = ["rgba(96,170,255,0.8)", "rgba(96,170,255,0.6)", "rgba(96,170,255,0.4)", "rgba(96,170,255,0.2)"];
    var indexedColors = ["rgb(255, 102, 0)","rgb(169, 0, 91)","rgb(96,170,255)","rgb(192,132,255)"]; // Andy Solid Individual Colors
   
    var indexColor = function(d, i) {
        return indexedColors[i];
    };
    // Switch color scheme here
    $scope.colorFunction = function() { 
      return keyColor;
    };      
      
    // $scope.$on('tooltipShow.directive', function(event){
    //     console.log('scope.tooltipShow', event);
    // });
    // 
    // $scope.$on('tooltipHide.directive', function(event){
    //     console.log('scope.tooltipHide', event);
   
    // Not used with useInteractiveGuideline
    // $scope.toolTipContentFunction = function() {
    //   return function(key, x, y, e, graph) {
    //   return  'Super New Tooltip' +
    //     '<b>' + key + '<b>' +
    //     '<p>' +  y + ' at ' + x + '</p>';
    //   };
    // };


  
  });