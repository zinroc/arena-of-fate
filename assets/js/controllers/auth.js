angular.module('App.controllers').controller('authController', function ($scope, gameAPIservice) {
	"use strict";

	$scope.errors = {
		email: null,
		password: null,
		username: null,
		passwordRepeat: null
	};

	$scope.authenticated = false;

	$scope.getEmail = function () {
		return $(".form-signin").find("#email").val();
	};

	$scope.register = function (e) {
		// make sure the passwords match
		var p1 = $(e.target).parent().find("#password").val();
		var p2 = $(e.target).parent().find("#password-repeat").val();

		if (p1 !== p2) {
			// don't authenticate
			$scope.errors.passwordRepeat = "Your passwords do not match";
			console.log(p1);
			console.log(p2);
			return;
		} else {
			$scope.errors.passwordRepeat = null;
		}

		var email = $(e.target).parent().find("#email").val();
		var username = $(e.target).parent().find("#username").val();
		var teamname = $(e.target).parent().find('#teamname').val();

		gameAPIservice.registerUser(email, username, teamname, p1).success(function (response) {
			if (response.status !== "success") {
				console.log("fail");
				console.log(response);

				$scope.errors.email = response.email;
				$scope.errors.username = response.username;
				$scope.errors.teamname = response.teamname;
				$scope.errors.password = response.password;
			} else {
				// reset error msgs
				$scope.errors = {};
				$scope.authenticated = true;
			}
		});
	};

	$scope.login = function (e) {
		// e.preventDefault();

		//pre Gladiator patch
		//var dest = gameAPIservice.prefix() + "/gameplayer/select_character";
		var dest = gameAPIservice.prefix() + "/gameplayer/fight_planner";

		var email = $(e.target).parent().find("#email").val();
		var password = $(e.target).parent().find("#password").val();

		gameAPIservice.authenticateUser(email, password).success(function (response) {
			if (response.status === "success") {
				window.location.href = dest;
			} else {
				console.log("error authenticating");
				console.log(response);

				if (response.email || response.password) {
					$scope.errors.email = response.email;
					$scope.errors.password = response.password;
				} else {
					$scope.errors.email = response.msg;
				}
			}
		});

		return false;
	};
});