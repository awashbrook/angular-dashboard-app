'use strict';

angular.module('app')
  .controller('MainCtrl', function ($scope, $interval, stackedAreaChartSampleData, pieChartSampleData, RandomTimeSeriesDataModel, RandomTopNDataModel, SampleGraphiteTimeSeriesDataModel, MultiSampleGraphiteTimeSeriesDataModel) {
    var widgetDefinitions = [
      {
        name: 'nvd3Graphite',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: SampleGraphiteTimeSeriesDataModel,
        attrs: {
          // data: 'stackedAreaChartData',
          height: 400,
          showXAxis: true,
          showYAxis: true,
          xAxisTickFormat: 'xAxisTickFormat()'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'nvd3GraphiteMulti',
        directive: 'nvd3-stacked-area-chart',
        dataAttrName: 'data',
        dataModelType: MultiSampleGraphiteTimeSeriesDataModel,
        attrs: {
          height: 400,
          showXAxis: true,
          showYAxis: true,
          xAxisTickFormat: 'xAxisTickFormat()',
          interactive: true,
          useInteractiveGuideline: true,
          tooltips: true,
          color: "colorFunction()",
//          isArea="true"        
//          tooltipcontent: "toolTipContentFunction()",
          id: 'nvd3GraphiteMulti'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'wt-time',
        style: {
          width: '33%'
        }
      },
      {
        name: 'wt-random',
        style: {
          width: '33%'
        }
      },
      {
        name: 'wt-scope-watch',
        attrs: {
          value: 'randomValue'
        },
        style: {
          width: '34%'
        }
      },
      {
        name: 'wt-line-chart',
        dataAttrName: 'chart',
        dataModelType: RandomTimeSeriesDataModel,
        style: {
          width: '50%'
        }
      },
      {
        name: 'wt-gauge',
        attrs: {
          value: 'percentage'
        },
        style: {
          width: '250px'
        }
      },
      {
        name: 'wt-top-n',
        dataAttrName: 'data',
        dataModelType: RandomTopNDataModel,
        style: {
          width: '30%'
        }
      },
      {
        name: 'progressbar',
        attrs: {
          class: 'progress-striped',
          type: 'success',
          value: 'percentage'
        },
        style: {
          width: '30%'
        }
      },
      {
        name: 'progressbar2',
        template: '<div progressbar class="progress-striped" type="info" value="percentage">{{percentage}}%</div>',
        style: {
          width: '30%'
        }
      },
      {
        name: 'nvd3-stacked-area-chart',
        attrs: {
          data: 'stackedAreaChartData',
          height: '400',
          showXAxis: 'true',
          showYAxis: 'true',
          xAxisTickFormat: 'xAxisTickFormat()'
        },
        style: {
          width: '50%'
        }
      },
      {
        name: 'URLtemplate',
        templateUrl: 'template/percentage.html'
      },
      {
        name: 'wt-pie-chart',
        style: {
          width: '350px',
          height: '350px'
        },
        attrs: {
          data: 'pieChartData'
        }
      }
      // {
      //   name: 'rickshawGraphite',
      //   directive: 'rickshaw',
      //   dataAttrName: 'rickshaw',
      //   dataModelType: SampleGraphiteTimeSeriesDataModel,
      //   style: {
      //     width: '50%'
      //   }
      // },

    ];


    var defaultWidgets = _.map(widgetDefinitions, function (widgetDef) {
      return {
        name: widgetDef.name
      };
    });

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
    };

// random scope value (scope-watch widget)
    $interval(function () {
      $scope.randomValue = Math.random();
    }, 500);

// percentage (gauge widget, progressbar widget)
    $scope.percentage = 5;
    $interval(function () {
      $scope.percentage = ($scope.percentage + 10) % 100;
    }, 1000);

    // nvd3-stacked-area-chart
    $scope.stackedAreaChartData = stackedAreaChartSampleData;

    $scope.xAxisTickFormat = function () {
      return function (d) {
        return d3.time.format('%x')(new Date(d));
      };
    };
    
    // D3.color() schemes nvd3/test/stackedAreaChartTest.html
    var d3scheme = d3.scale.category20();
    var keyColor = function(d, i) {
      return d3scheme(d.key);
    };    
    // From angularjs-nvd3-directives/examples/cumulativeLineChart.html
    var indexedColors = ['#ffa500', '#c80032', '#0000ff', '#6464ff'];
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

    // pie chart
    $scope.pieChartData = pieChartSampleData;

    /*
     var pieChart = angular.copy(pieChartSampleData);

     $interval(function () { //TODO
     var a = pieChart[0];
     var b = pieChart[1];
     var sum = a.y + b.y;
     a.y = (a.y + 1) % sum;
     b.y = sum - a.y;
     $scope.pieChartData = angular.copy(pieChart);
     }, 500);
     */

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