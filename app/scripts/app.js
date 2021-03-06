'use strict';

angular.module('ui.dashboard.widgets', ['ngGrid']);

angular.module('app', [
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
  .constant('settings', window.settings)
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
      .when('/graphite', {
        templateUrl: 'views/main.html',
        controller: 'GraphiteCtrl'
      })
      .when('/auto', {
        templateUrl: 'views/main.html',
        controller: 'AutoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Use Bootstrap 3 theme in PNotify jQuery plugin
    jQuery.pnotify.defaults.styling = 'bootstrap3';
  });