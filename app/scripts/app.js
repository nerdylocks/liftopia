'use strict';

var liftopiaTestApp = angular.module('liftopiaTestApp', [
'ngCookies',
'ngResource',
'ngSanitize',
'ngRoute',
'firebase'
]);

liftopiaTestApp.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
});
