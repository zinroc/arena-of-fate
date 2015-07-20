angular.module('App.controllers').controller('masterController', function ($scope, gameAPIservice) {
	"use strict";

	$scope.getStaticView = function (viewName) {
		return $scope.baseURL() + "views/" + viewName;
	};

    $scope.baseURL = function () {
        var i = window.location.href.indexOf("index.php");
        return window.location.href.substr(0, i);
    };

    $scope.prefix = gameAPIservice.prefix;
});