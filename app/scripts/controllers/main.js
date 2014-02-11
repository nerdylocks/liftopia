'use strict';

liftopiaTestApp.controller('MainCtrl', function ($scope, $http, $rootScope, $q, $firebase) {
	//Indicate data status
	$rootScope.$emit('LOAD');

	//Checks data status for UI feedback
	$rootScope.$on('LOAD', function(){
        $rootScope.loading = true;
    });

	//Checks data status for UI feedback
    $rootScope.$on('UNLOAD', function(){
        $rootScope.loading = false;
    });

    //Location param data
	$rootScope.skiLocation = {
		zip: 95735,
		latlng: [38.761711000000000,-120.115540000000000]
	}
	
	//Initial data object to be populated by more properites once ajax call is made
	$scope.tahoeData = {};

	//Initial entry count
	$scope.snapshotCount = 0;
	//API Endpoints: Yelp, World weather, and elevation geo api
	$rootScope.END_POINTS = {
		weather: 'http://api.worldweatheronline.com/free/v1/ski.ashx?q='+$rootScope.skiLocation.zip+'&format=json&key=84h5ebdy44vcpqkxck8sgquc&callback=JSON_CALLBACK',
		yelp: 'http://api.yelp.com/business_review_search?term=ski+stores&location='+$rootScope.skiLocation.zip+'&limit=3&ywsid=HfHf5kE34o71u3IMpcG7PA&callback=JSON_CALLBACK',
		elevation: 'http://ws.geonames.org/astergdemJSON?lat='+ $rootScope.skiLocation.latlng[0] + '&lng=' + $rootScope.skiLocation.latlng[1] +'&username=nerdylocks&callback=JSON_CALLBACK',
		firebase: 'https://nerdylocks.firebaseio.com/liftopia/tahoestat',
		getFirebaseData: this.firebase + '.json'
	};

	//Firebase instatiation
	var fireRef = new Firebase($rootScope.END_POINTS.firebase);

	//storing firebase object to the tahoestat model
	$scope.tahoestat = $firebase(fireRef);
	
	//Utilitly method
	var Utils = {
		cmToFt: function (cm){
			return cm * 0.0328084;
		}
	};

	//This method makes all the async calls, 
	$scope.makeCalls = function(){
		var weather = $http.jsonp($rootScope.END_POINTS.weather),
			yelp = $http.jsonp($rootScope.END_POINTS.yelp),
			elevation = $http.jsonp($rootScope.END_POINTS.elevation);

		$q.all([weather, yelp, elevation])
		.then(success)
		.then($scope.addRec);

		function success(resp){
			var _data = [],
				_biz = [];

			angular.forEach(resp, function(i){
				_data = _data.concat(i.data);
			});
			
			angular.forEach(_data[1].businesses, function(value, key){
				if(!value.is_closed) {
					_biz.push(value.name);
				}
			});
			$scope.tahoeData = {
				location: _data[0].data.request[0].query,
				snow_fall : Utils.cmToFt(_data[0].data.weather[0].totalSnowfall_cm),
				temp : _data[0].data.weather[0].bottom[0].maxtempF,
				elevation : _data[2].astergdem,
				stores : _biz,
				timestamp: new Date()
			}	
		}
		
		$scope.tahoestat.$on("child_added", function() {
			$scope.snapshotCount++;
		});
	}
	

	$scope.addRec = function(){
		$scope.tahoestat.$add($scope.tahoeData);
		$rootScope.$emit('UNLOAD');
	}

});