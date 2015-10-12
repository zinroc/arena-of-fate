"use strict";

/**
 * Use these utilities throughout client-side code
 */
var utils = {
    randomItem: function (collection) {
        var idx = Math.floor(collection.length * Math.random());
        return collection[idx];
    },
    round2Decimals: function (n) {
        return Math.round(n * 100) / 100.0;
    },
    getCookie: function (key) {
        var pairs = document.cookie.split("; ");
        var o = {}, k, v;
        for (var i = 0; i < pairs.length; i++) {
            k = pairs[i].split("=")[0];
            v = pairs[i].split("=")[1];
            o[k] = v;
        }
        return o[key];
    },
    /**
     * Return URL params as object
     */
    getURLParams: function () {
        var params = window.location.search.split("?")[1].split("&");
        var o = {}
        for (var i = 0; i < params.length; i++) {
            o[params[i].split("=")[0]] = params[i].split("=")[1];
        }
        return o;
    }
};

/**
 * Define titlecase on strings
 * Taken from this SOF thread: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
String.prototype.toTitleCase = function (str)
{
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
