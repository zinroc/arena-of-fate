angular.module('App.services', []).factory('gameAPIservice', function($http) {
	"use strict";

	var gameAPI = {};

	/**
	 * Return the URL prefix that should go before the /controller/function part of the URL
	 */
	gameAPI.prefix = function () {
		// this won't always work, but should work for now
		var href = window.location.href;
		return href.substr(0, href.indexOf("index.php") + "index.php".length);
	};

	/**
	 * Return the URL prefix that should go before the asset URL.
	 * Does not include trailing slash
	 */
	gameAPI.assetPrefix = function () {
		var prefix = this.prefix();
		return prefix.substr(0, prefix.length - "/index.php".length) + "/assets";
	};

    gameAPI.getURL = function (controller, fn) {
        return this.prefix() + "/" + controller + "/" + fn;
    };

	/**
	 * Get JSON from the controller with no parameters, from the given controller and function
	 * @param  {string}   controller The controller
	 * @param  {string}   fn         The function in the controller
	 */
	gameAPI.getJSON = function (controller, fn) {
		return $http.post(
			this.getURL(controller, fn),
			{}
		);
	};

	gameAPI.serializeObject = function (data) {
		var str = [];
		for (var k in data) {
			str.push(encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
		}

		return str.join("&");
	};

	/**
	 * Return True iff the given server JSON response is an error
	 * @param  {Object}  response The server's JSON response
	 * @return {Boolean}          True iff the given server JSON response is an error
	 */
	gameAPI.isError = function (response) {
		return response.hasOwnProperty('status') && response.status === 'error';
	};

	/**
	 * Get JSON from the controller with given parameters
	 * @param  {string}   controller The controller
	 * @param  {string}   fn         The function in the controller
	 * @param  {Object}   data       The data to send
	 */
	gameAPI.getJSONWithParams = function (controller, fn, data) {
		return $http({
			method: 'POST',
			data: this.serializeObject(data),
			url: this.prefix() + '/' + controller + '/' + fn,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	};

	gameAPI.setCharacterSkills = function(){
		return this.getJSON('character', 'setSkills');
	}

    gameAPI.authenticateUser = function (email, password) {
        return this.getJSONWithParams("gameplayer", "authenticateUser", {"email": email, "password": password});
    };

    gameAPI.registerUser = function (email, username, teamname, password) {
        return this.getJSONWithParams("gameplayer", "registerUser", {"email": email, "username": username, "teamname": teamname, "password": password});
    };


    gameAPI.getFighters = function () {
        return this.getJSON('character', 'getFighters');
    };

    gameAPI.getStrategies = function () {
        return this.getJSON('static_controller', 'getStrategies');
    };

    gameAPI.getSkills = function () {
        return this.getJSON('static_controller', 'getSkills');
    };

    gameAPI.getTraits = function () {
        return this.getJSON('static_controller', 'getTraits');
    };


	return gameAPI;
});
