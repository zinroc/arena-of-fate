/**
  * Titlecase function, courtesy of StackOverflow
  */
String.prototype.toTitleCase = function () {
	"use strict";
	return this.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/**
  * startsWith function, courtesy of StackOverflow
  */
String.prototype.startsWith = function (str) {
	"use strict";
	return this.indexOf(str) === 0;
};

/**
  * Fetch some resources from provided URL.
  * Call provided callback function on success.
  * Log the errors otherwise
  *
  * @param url - The URL to fetch from
  * @param callback - The callback function to use
  * @param expectedKey - the expected reply key (in the JSON response), or null if none
  * @param data - The data to send to the server, as a Javascript object
  *
  * Note that the callback is called with `response`, not with `response [expectedKey]`
  */
function genericFetch (url, callback, expectedKey, data) {
	"use strict";

	if (expectedKey === undefined) {
		expectedKey = null;
	}

	if (data === null || data === undefined || data.length === 0) {
		$.get (url, {}, function (response) {
			if ('status' in response && response.status === 'error') {
				console.log ("Error:");
				console.log (response);
			} else if (expectedKey === null || expectedKey in response) {
				callback (response);
			} else {
				console.log ("Invalid format for response:");
				console.log (response);
			}
		}, "json");
	} else {
		console.log ("sending data:");
		console.log(data);
		$.post (url, data, function (response) {
			if ('status' in response && response.status === 'error') {
				console.log ("Error:");
				console.log (response);
			} else if (expectedKey === null  || expectedKey in response) {
				callback (response);
			} else {
				console.log ("Invalid format for response:");
				console.log (response);
			}
		}, "json");
	}
}
