'use strict';

angular.module('ui.dashboard.widgets', ['ngGrid']);

angular.module('app', [
    'elasticsearch',
    'app.service',
    'app.websocket',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.dashboard',
    'nvd3ChartDirectives',
    'ui.dashboard.widgets'
  ])
  // Bower deps setup by index.js
  .constant('settings', window.settings)
  .constant('$', window.$)
  .constant('_', window._)
  .constant('moment', window.moment )
  .config(function ($routeProvider, webSocketProvider, settings) {
    if (settings) {
      webSocketProvider.setWebSocketURL(settings.webSocketURL);
    }

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/rest', {
        templateUrl: 'views/main.html',
        controller: 'RestDataCtrl'
      })  
      .when('/meteor', {
        templateUrl: 'views/main.html',
        controller: 'MeteorCtrl'
      })
      .when('/discovery', {
        templateUrl: 'views/main.html',
        controller: 'DiscoveryCtrl'
      })
      .when('/apps', {
        templateUrl: 'views/apps.html',
        controller: 'AppsCtrl'
      })
      .when('/apps/:appId', {
        templateUrl: 'views/main.html',
        controller: 'DiscoveryCtrl'
      })
      .when('/clientdata', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/serverdata', {
        templateUrl: 'views/main.html',
        controller: 'ServerDataCtrl'
      })
      .when('/datacloud', {
        templateUrl: 'views/main.html',
        controller: 'DataCloudCtrl'
      })
      .when('/graphiteDefault', {
        templateUrl: 'views/main.html',
        controller: 'GraphiteDefaultCtrl'
      })
      .when('/graphiteDefaultLocalStorage', {
        templateUrl: 'views/main.html',
        controller: 'GraphiteDefaultLocalStorageCtrl'
      })
      .when('/graphiteDefaultBackendStorage', {
        templateUrl: 'views/main.html',
        controller: 'GraphiteDefaultBackendStorageCtrl'
      })
      .when('/graphiteSamples', {
        templateUrl: 'views/main.html',
        controller: 'GraphiteSamplesCtrl'
      })
      .when('/default', {
        templateUrl: 'views/main.html',
        controller: 'WidgetDefaultsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Use Bootstrap 3 theme in PNotify jQuery plugin
    jQuery.pnotify.defaults.styling = 'bootstrap3';
  });
