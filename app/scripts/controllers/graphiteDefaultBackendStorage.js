'use strict';

// Storage enabled for this...this will be what a fresh dashboard will look like for new team
angular.module('app')
  .controller('GraphiteDefaultBackendStorageCtrl', function ($scope, $interval, es, nvd3ChartDefAttrs, WidgetDefaults) {

    es.ping({
      // ping usually has a 100ms timeout
      requestTimeout: 2000

      // undocumented params are appended to the query string
//      hello: "elasticsearch!"
    }).then(function (body) {
      console.log('All is well with Elastic Search');
    }, function (error) {
      console.error('Elastic Search cluster is down!');
      console.error(error.message);
    });

//    https://github.com/elasticsearch/elasticsearch-js#examples

//    http://events.alpha.eikon-mon.int.thomsonreuters.com/api//_search?q=pants
    es.search({
      q: 'pants',
      requestTimeout: 2000
    }).then(function (body) {
      console.log("Hits for pants");
      console.log(body.hits.hits);
    }, function (error) {
      console.error(error.message);
    });

    // How does Grafana creat and read documents

//    http://events.alpha.eikon-mon.int.thomsonreuters.com/api//grafana-dash/dashboard/Alpha%20WFWS
    es.get({
      index: 'grafana-dash',
      type: 'dashboard',
      id: 'Alpha WFWS',
      requestTimeout: 2000
    }).then(function (body) {
      console.log(body);
    }, function (error) {
      console.error(error.message);
    });

    var sampleGrafanaDashboard = {"title":"Alpha WFWS Copy 2","services":{"filter":{"list":[],"time":{"from":"now-6h","to":"now"}}},"rows":[{"title":"Row1","height":"250px","editable":true,"collapse":false,"collapsable":true,"panels":[{"span":8,"editable":true,"type":"graphite","loadingEditor":false,"datasource":null,"renderer":"flot","x-axis":true,"y-axis":true,"scale":1,"y_formats":["short","short"],"grid":{"max":null,"min":0,"threshold1":null,"threshold2":null,"threshold1Color":"rgba(216, 200, 27, 0.27)","threshold2Color":"rgba(234, 112, 112, 0.22)"},"annotate":{"enable":false},"resolution":100,"lines":true,"fill":1,"linewidth":2,"points":false,"pointradius":5,"bars":false,"stack":false,"legend":{"show":true,"values":false,"min":false,"max":false,"current":false,"total":false,"avg":false},"percentage":false,"zerofill":true,"nullPointMode":"connected","steppedLine":false,"tooltip":{"value_type":"cumulative","query_as_alias":true},"targets":[{"target":"stats.amers.alpha-us1-cell.iap-cpm-wfws.*.os.cpu.cpuusage"}],"aliasColors":{},"aliasYAxis":{},"title":"WFWS CPU"}],"notice":false},{"title":"","height":"150px","editable":true,"collapse":false,"collapsable":true,"panels":[],"notice":false}],"editable":true,"failover":false,"panel_hints":true,"style":"dark","pulldowns":[{"type":"filtering","collapse":false,"notice":false,"enable":false},{"type":"annotations","enable":false}],"nav":[{"type":"timepicker","collapse":false,"notice":false,"enable":true,"status":"Stable","time_options":["5m","15m","1h","6h","12h","24h","2d","7d","30d"],"refresh_intervals":["5s","10s","30s","1m","5m","15m","30m","1h","2h","1d"],"now":true}],"loader":{"save_gist":false,"save_elasticsearch":true,"save_local":true,"save_default":true,"save_temp":true,"save_temp_ttl_enable":true,"save_temp_ttl":"30d","load_gist":false,"load_elasticsearch":true,"load_elasticsearch_size":20,"load_local":false,"hide":false},"refresh":false,"tags":[],"timezone":"browser"};

    //    http://events.alpha.eikon-mon.int.thomsonreuters.com/api//grafana-dash/dashboard/Alpha%20WFWS
    es.create({
      index: 'grafana-dash',
      type: 'dashboard',
      id: 'Alpha WFWS Copy 2',
      body: sampleGrafanaDashboard,
      requestTimeout: 2000
    }).then(function (body) {
      console.log(body);
    }, function (error) {
      console.error(error.message);
    });

    var esStorage = null; // TODO

    $scope.dashboardOptions = {
//      storage: esStorage,
//      storageId: 'andy-dashboard-graphite-default-backend-storage',
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
