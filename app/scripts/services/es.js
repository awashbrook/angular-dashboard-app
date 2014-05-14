'use strict';
//
// Elastic Search Data Service as per
// https://github.com/elasticsearch/bower-elasticsearch-js
//

angular.module('app.service')
  .service('es', function (esFactory) {
    return esFactory({
      host: 'http://events.alpha.eikon-mon.int.thomsonreuters.com/api/'  // EMS proxies via apache

      // http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/configuration.html#config-options
    })
  })
  .service('elasticStorage', function (es) {
      function elasticStorage() {}

      elasticStorage.index = 'malhar-dash';
      elasticStorage.type = 'dashboard';
//      elasticStorage.storageId = 'andy-dashboard-graphite-default-backend-storage';
//      var sampleMalharDashboard = {"widgets":[{"title":"Mat","name":"nvLineChartAlpha","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.alpha.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"random walk 1\")","randomWalk(\"random walk 2\")","randomWalk(\"random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}},{"title":"Jan","name":"nvLineChartBeta","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.beta.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"andy random walk 1\")","randomWalk(\"olivier random walk 2\")","randomWalk(\"fabrice random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}},{"title":"Widget 3","name":"nvLineChartProd","style":{"width":"400px"},"dataModelOptions":{"params":{"url":"http://metrics.eikon-mon.int.thomsonreuters.com/render/","from":"-2h","until":"now","target":["randomWalk(\"random walk 1\")","randomWalk(\"random walk 2\")","randomWalk(\"random walk 3\")"]}},"attrs":{"isArea":true,"height":400,"showXAxis":true,"showYAxis":true,"xAxisTickFormat":"xAxisTickFormat()","interactive":true,"useInteractiveGuideline":true,"tooltips":true,"showLegend":true,"color":"colorFunction()","forcey":"[0,2]"}}]};

      elasticStorage.getItem = function (key) {
        es.get({
          index: elasticStorage.index,
          type: elasticStorage.type,
          id: key,
          requestTimeout: 2000
        }).then(function (body) {
          console.log(body);
        }, function (error) {
          console.error(error.message);
        });
      };
      elasticStorage.setItem = function (key, value) {
        es.create({
          index: elasticStorage.index,
          type: elasticStorage.type,
          id: key,
          body: value,
          requestTimeout: 2000
        }).then(function (body) {
          console.log(body);
        }, function (error) {
          console.error(error.message);
        });
      };
      elasticStorage.removeItem = function (key) {};


      return elasticStorage;

    })

