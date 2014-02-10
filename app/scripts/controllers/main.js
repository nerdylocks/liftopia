'use strict';

liftopiaTestApp.controller('MainCtrl', function ($scope, $window, $http, $firebase, $rootScope, $q) {
	
	var _location = {
		zip: 95735,
		latlng: [38.761711000000000,-120.115540000000000]
	}
	
	var _data = {
		timestamp: new Date()
	};

	$rootScope.END_POINTS = {
		weather: 'http://api.worldweatheronline.com/free/v1/ski.ashx?q='+_location.zip+'&format=json&key=84h5ebdy44vcpqkxck8sgquc&callback=JSON_CALLBACK',
		yelp: 'http://api.yelp.com/business_review_search?term=ski+stores&location='+_location.zip+'&limit=3&ywsid=HfHf5kE34o71u3IMpcG7PA&callback=JSON_CALLBACK',
		elevation: 'http://ws.geonames.org/astergdemJSON?lat='+ _location.latlng[0] + '&lng=' + _location.latlng[1] +'&username=nerdylocks&callback=JSON_CALLBACK',
		firebase: 'https://nerdylocks.firebaseio.com/liftopia/tahoestat'
	};


	var fireRef = new Firebase($rootScope.END_POINTS.firebase);

	$scope.tahoestat = $firebase(fireRef);
	$scope.collected = {};
	var Utils = {
		cmToFt: function (cm){
			return cm * 0.0328084;
		}
	};
	$scope.makeCalls = function(){
		
		var weather = $http.jsonp($rootScope.END_POINTS.weather),
			yelp = $http.jsonp($rootScope.END_POINTS.yelp),
			elevation = $http.jsonp($rootScope.END_POINTS.elevation);

		$q.all([weather, yelp, elevation]).then(success).then($scope.addRec);

		function success(resp){
			$scope.collected = [];
			angular.forEach(resp, function(i){
				$scope.collected = $scope.collected.concat(i.data);
			});
			_data.snow_fall = Utils.cmToFt($scope.collected[0].data.weather[0].totalSnowfall_cm);
			_data.temp = $scope.collected[0].data.weather[0].top[0].maxtempF;
			var _biz = [];
			angular.forEach($scope.collected[1].businesses, function(value, key){
				console.log(value.is_closed)
				if(!value.is_closed) {
					_biz.push(value.name);
				}
			});

			_data.elevation = $scope.collected[2].astergdem;
			_data.stores = _biz;

			console.log(_data);
		}
	}

	$scope.addRec = function(){
		$scope.tahoestat.$add(_data);
	}

});