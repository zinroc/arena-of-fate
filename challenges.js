"use strict";

var Promise = Promise || require ("bluebird");


var credentials = require("./credentials.js"),
    challenges = {};

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var challengeUtils = require("./challengeUtils.js")(knex),
    challengeStore = require("./my_node_modules/challengeStore.js")(knex),
    fighterStore = require("./my_node_modules/fighterStore.js")(knex),
    gameStateStore = require("./my_node_modules/gameStateStore.js")(knex),
    arenaStore = require("./my_node_modules/arenaStore.js")(knex);


module.exports = challenges = {
    /**
     * Get a specific challenge
     */
    getChallenge: function (email, challengeID, response) {
        // TODO use email somehow
        challengeStore.read(challengeID)
        .then(function (challenge) {
            response.json(challenge).end();
        });
    },
    /**
     * Get entry from arena table with arena_id
     */
    getArena: function (email, arena_id, response){
        arenaStore.read(arena_id)
        .then(function (arena){
            response.json(arena).end();
        });
    },
    /**
     * Send a list of pending challenges back to the user
     * If there are too few pending challenges, make some new ones
     */
    getPending: function (email, response) {
        challengeStore.getPending(email)
        .then(function (challenges) {
            if (challenges.length === 0) {
                console.log("Player " + email + " has no pending challenges, create new ones!");
                // generate new challenges
                return challengeUtils.create(email)
                .then(function () {
                    return challengeStore.getPending(email);
                });
            } else {
                return challenges;
            }
        })
        .then(function (rows) {
            response.json(rows).end();
        });
    },
    getAccepted: function (email, response) {
        challengeStore.getAccepted(email)
        .then(function (matchList) {
            response.json(matchList).end();
        });
    },
    /**
    *   reward_id INT REFERENCES record_holders(id)
    *   Change a player_characters record_holder entry status from pending to accepted
    */
    acceptReward: function(email, reward_id, response){
        arenaStore.acceptReward(reward_id)
        .then(function (){
            response.send("yes").end();
        });
    },
    /**
    *   Get the records of fighters owned by the player with the given email
    */
    getRecordRewards: function (email, response){
        var fighters = [];
        var fighterRecords = [];
        var result = [];
        fighterStore.getLiving(email)
        .then(function (fightersArr){
            fighters = fightersArr;

            if (!fighters.length){
                response.send(false).end();
            } else {
                var promises = [];
                for (var i=0; i<fighters.length; i++){
                    promises[i] = arenaStore.getFighterRecords(fighters[i].id);
                }
                return Promise.all(promises);
            }

        }).then(function (fighterRecordsArr){
            if (fighterRecordsArr){
                fighterRecords = fighterRecordsArr;
                for (var i=0; i<fighters.length; i++){
                    result[fighters[i].id] = fighterRecords[i];
                }
                response.json(result).end();
            } else {
                response.send(false).end();
            }
        });
    },
    /**
    *   Get last timesteps's attendance records for each arena
    */
    getRecords: function (email, response){
        var gs = [];
        var records = [];
        var timestep = 0;
        var fighters = [];
        var result = [];
        gameStateStore.read()
        .then(function (gameStateArr){
            gs = gameStateArr;
            timestep = gs.timestep-1;
            //get records for previous timestep
            return arenaStore.getRecords(timestep);
        }).then (function (recordsArr){
            records = recordsArr;

            if (!records){
                response.send(false).end();
            } else {
                var promises = [];
                //get the info for the first fighter involved in the record
                for (var i=0; i<records.length; i++){
                    if (records[i].hasOwnProperty("fighter_1")){
                        promises[i] = fighterStore.read(records[i].fighter_1);
                    } else {
                        promises[i] = null;
                    }
                }
                var j=i;
                //get the info for the second fighter in the record
                for (var i=0; i<records.length; i++){

                    if (records[i].hasOwnProperty("fighter_2")){
                        promises[j] = fighterStore.read(records[i].fighter_2);
                    } else {
                        promises[j]= null;
                    }
                    j++;
                }
                return Promise.all(promises);
            }
        }).then(function (fightersArr){
            fighters = fightersArr;
            //place info about arena and player fighters as record holders.
            //NOTE - cannot have bots who hold records turn into player fighters in the future. 
            if (records){
                for (var i=0; i<records.length; i++){
                    for (var j=0; j<fighters.length; j++){
                        if (fighters[j]){
                            if (fighters[j].id===records[i].fighter_1 ){
                                if (fighters[j].bot){
                                    records[i].arena_fighter = fighters[j];
                                } else {
                                    records[i].player_fighter = fighters[j];
                                }
                            } else if (fighters[j].id === records[i].fighter_2){
                                if (fighters[j].bot){
                                    records[i].arena_fighter = fighters[j];
                                } else {
                                    records[i].player_fighter = fighters[j];
                                }
                            }
                        }
                    }
                    result[records[i].arena] = records[i];
                }

                response.json(result).end();

            }
        });
    },
    /**
     * Create new challenges for the given player, in the current timestep
     * Only create challenges if they have not been created before
     * If new challenges created write "yes" to response
     * If no new challenges were created, write "no" to response
     */
    create: function (email, res) {
        challengeUtils.create(email)
        .then(function (obj) {
            res.status(obj.code).send(obj.msg);
        });
    },
    /**
     * Accept the given challenge.
     * Parameters:
     *      matchID: ID of challenge in arena_challenges table
     *      email: email of player accepting the challenge
     *      fighter: ID of fighter in the fighters table
     *      res: response object
     */
    accept: function (matchID, email, fighterID, res) {
        challengeUtils.accept (matchID, fighterID, email)
        .then(function (obj) {
            res.status(obj.code).send(obj.msg);
        });
    },
    decline: function (matchID, email, res) {
        challengeStore.decline(matchID)
        .then(function () {
            res.send("ok");
        });
    }, 
    record: function(matchID, email, winner, loser, res) {
        challengeUtils.record(matchID, winner, loser).then(function () {
            res.send("ok");
        });
    }, 
    recordTie: function(matchID, email, red, blue, res) {
        challengeUtils.recordTie(matchID, red, blue).then(function () {
            res.send("ok");
        });
    }, 
    fight_record: function(matchID, email, attendance, gate, res) {
        challengeUtils.fight_record(matchID, attendance, gate).then(function (){
            res.send("ok");
        });
    },
    recordStrat: function(matchID, email, fight_round, strat_id, res) {
        challengeUtils.recordStrat(matchID, fight_round, strat_id).then(function (){
            res.send("ok");
        });
    }
};
