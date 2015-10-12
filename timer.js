/**
 * This file is used to advance the timestep automatically via a timer
 * The timestep will advance roughly once every n minutes, where n is specified in the database
 */

 var Promise = Promise || require ("bluebird");


var bookshelf = require("./database.js").bookshelf;

var gameStateAPI = require("./my_node_modules/advance_timestep.js")(knex);

var GameState = bookshelf.Model.extend({
    tableName: "game_state"
});

/**
 * Convert minutes to milliseconds
 */
function minutesToMS (minutes) {
    return minutes * 60 * 1000;
};

var myTimer = function myTimer () {
    "use strict";

    var gameState = null;
    var count = 0;

    // fetch game state info, then start the timer
    GameState.where("id", 1).fetch()
    .then(function (gs) {
        gameState = gs;
        //console.log("Starting the timer");
        wrapper();
    });

    /**
     * This function is called every time the timer fires, excluding the first time
     * Returns a promise
     */
    function timerFn () {
        //var now = new Date();
        //console.log("executed timerFn at " + now);
        if (count > 0) {
            return gameStateAPI.internalAdvanceTimestep(gameState.attributes);
        } else {
            // this is to make sure timerFn always returns a promise
            return new Promise(function (resolve, reject) {
                count++;
                resolve(count);
            });
        }
    }

    /**
     * Wraps timerFn in a timer
     */
    function wrapper () {
        timerFn()
        .then(function () {
            var interval = 2000;
            // this is production code
            console.log("Scheduled next iteration in " + gameState.attributes.timestep_interval + " mins");
            setTimeout(wrapper, minutesToMS(gameState.attributes.timestep_interval));

            // this is testing code
            //console.log("Scheduled next iteration in " + interval + " ms");
            //setTimeout(wrapper, interval);
        });
    }
};

module.exports.Timer = myTimer;
