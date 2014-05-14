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
  });
});

