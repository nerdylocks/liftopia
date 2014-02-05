'use strict';

liftopiaTestApp.controller('MainCtrl', function ($scope) {
	OAuth.initialize('dTTxe_-zb4BlxpJ3io7XRu--dqc');

	$scope.login = function(){
		OAuth.popup('facebook', function(error, result) {
		  //handle error with error
		  //use result.access_token in your API request
	  		console.log(result);
		});
	}	    
});