"use strict";

var Promise = Promise || require ("bluebird");

var fighterFactory = require("./my_node_modules/fighterFactory.js");

module.exports = function (knex) {
    var playerStore =  require("./my_node_modules/playerStore.js")(knex),
        fighterStore = require("./my_node_modules/fighterStore.js")(knex),
        challengeStore = require("./my_node_modules/challengeStore.js")(knex),
        arenaStore = require("./my_node_modules/arenaStore.js")(knex),
        crowdStore = require("./my_node_modules/crowdStore.js")(knex),
        gameStateStore = require("./my_node_modules/gameStateStore.js")(knex),
        skillStore = require("./my_node_modules/skillStore.js")(knex);

    var challengeUtils = {
        minChallengesAndMatches: 3,
        /**
        * Minimum fame to earn a title
        */
        titleFameThreshold: 1800,
        /**
        * Change reputation of both winner and loser
        */
        updateFame: function (winner, loser) {
            var winner_num_matches_fought = winner.num_wins + winner.num_losses;
            var loser_num_matches_fought = loser.num_wins + loser.num_losses;

            var K_winner = winner_num_matches_fought < 5 ? 400 : 150;
            var K_loser = loser_num_matches_fought < 5 ? 400 : 150;

            var qWinner = Math.pow(10, winner.fame / 400);
            var qLoser = Math.pow(10, loser.fame / 400);
            var eWinner = qWinner / (qWinner + qLoser);
            var eLoser = qLoser / (qWinner + qLoser);

            winner.fame = Math.round(winner.fame + K_winner * (1 - eWinner));
            loser.fame = Math.round(loser.fame + K_loser * (0 - eLoser));
        },
        updateTitle: function (player) {
            if (player.fame >= challengeUtils.titleFameThreshold && !player.title) {
                player.title = fighterFactory.randomTitle();
            }
        },
        /**
        * Give the amount by which to update pref for the winning fighter
        * All values returned are non-negative
        */
        getPrefWinnerUpdateAmt: function (pref) {
            return (-1 * pref + 100) / 4;
        },
        /**
        * Give the amount by which to update pref for the losing fighter
        * All values returned are non-positive
        */
        getPrefLoserUpdateAmt: function (pref) {
            return (pref + 100) / -4;
        },
        /**
        * Return entry fee as an integer
        */
        getEntryFee: function (arena) {
            return Math.round(arena.capacity * 0.25);
        },
        /**
        * Update spectator prefs
        * Return a promise
        */
        updateSpectatorPrefs: function (match, winner, loser) {
            return crowdStore.getSpectatorPrefs (winner.id, match.arena)
            .then(function (winnerPrefs) {
                for (var i = 0; i < winnerPrefs.length; i++) {
                    winnerPrefs[i].pref += challengeUtils.getPrefWinnerUpdateAmt(winnerPrefs[i].pref);
                }
                return winnerPrefs;
            }).then(function (winnerPrefs) {
                // blocking
                return crowdStore.updateManyPrefs(winnerPrefs);
            }).then(function () {
                return crowdStore.getSpectatorPrefs(loser.id, match.arena);
            }).then(function (loserPrefs) {
                for (var i = 0; i < loserPrefs.length; i++) {
                    loserPrefs[i].pref += challengeUtils.getPrefLoserUpdateAmt(loserPrefs[i].pref);
                }
                return loserPrefs;
            }).then(function (loserPrefs) {
                // blocking
                return crowdStore.updateManyPrefs(loserPrefs);
            });
        },
        /**
        * Return promise, which resolves to income from the given match
        */
        getMatchIncome: function (match, arena, arenaFighter, playerFighter) {
            return challengeUtils.getTicketsSold(match, arenaFighter, playerFighter)
            .then(function (ticketsSold) {
                return ticketsSold * arena.ticket_price;
            });
        },
        /**
        * Return the minimum fame needed to fight the given fighter
        */
        getMinFame: function (arenaFighter) {
            return Math.floor(arenaFighter.fame - 200);
        },
        /**
        * Return the probability the given spectator will attend the fight
        */
        getProbabilityAttendFight: function (arenaPref, playerPref) {
            var maxPref = Math.max(arenaPref.pref, playerPref.pref);
            return Math.pow((maxPref + 100) / 200, 2);
        },
        /**
        * Return the size of the crowd drawn by the fight
        */
        getCrowdSize: function (arenaFighterPrefs, playerFighterPrefs) {
            // because the fighter prefs refer to the same spectators and they are both sorted, the array elements are in order
            var pr,
                crowdSize = 0;
            for (var i = 0; i < arenaFighterPrefs.length; i++) {
                pr = challengeUtils.getProbabilityAttendFight (arenaFighterPrefs[i], playerFighterPrefs[i]);
                if (Math.random() >= pr) {
                    crowdSize++;
                }
            }
            return crowdSize;
        },
        /**
        * Return the # of tickets sold for the given match, as a promise
        */
        getTicketsSold: function (match, arenaFighter, playerFighter) {
            var arenaFighterPrefs, playerFighterPrefs;

            return crowdStore.getAndCreateSpectatorPrefs (arenaFighter.id, match.arena)
            .then(function (fighterPrefs) {
                arenaFighterPrefs = fighterPrefs;
                return crowdStore.getAndCreateSpectatorPrefs(playerFighter.id, match.arena)
                .then(function (prefs) {
                    return prefs;
                });
            })
            .then(function (fighterPrefs) {
                playerFighterPrefs = fighterPrefs;

                // calculate crowd size here
                var crowdSize = challengeUtils.getCrowdSize(arenaFighterPrefs, playerFighterPrefs);
                return crowdSize;
            });
        },
        _getRandom: function (arr) {
            var idx = Math.floor (arr.length * Math.random());
            return arr[idx];
        },
        _getArenaEmail: function (arena) {
            return arena.name + "@arenas.rome";
        },
        /**
         * Randomly return either existing fighter from list or a brand-new one
         */
        _newOrRandomFighter: function (fighterList) {
            var distribution = fighterList.length + 1;
            var r = Math.floor(Math.random() * distribution);
            var fighter;
            if (r < fighterList.length) {
                // choose fighter fighterList[r]
                fighter = fighterList[r];
            } else {
                // create a new fighter
                
                fighter = fighterFactory.create();

            }
            return fighter;
        },
        /**
        * Create a challenge to the given player, issued by a random arena
        * The new challenge will be scheduled for the given timestep
        * Return a promise to a challenge object, or null
        * Creates a bot if insufficient bots avaialble
        */
        getRandomArenaChallenge: function (email, timestep) {
            var timestep, arena, arenaEmail;

            return arenaStore.getArenas()
            .then(function (arenaList) {
                if (arenaList.length === 0) {
                    // now arenas
                    throw new Error("No arenas");
                }
                arena = challengeUtils._getRandom (arenaList);
                return arena;
            }).then(function (arena) {
                arenaEmail = challengeUtils._getArenaEmail (arena);
                return fighterStore.getLiving(arenaEmail);
            }).then(challengeUtils._newOrRandomFighter)
            .then(function (fighter) {
                var match = {
                    player: email,
                    arena: arena.id,
                    entry_fee: challengeUtils.getEntryFee(arena),
                    winner_prize: null,
                    min_fame: challengeUtils.getMinFame (fighter),
                    timestep_scheduled: timestep
                };
                if (fighter.id) {
                    // existing fighter, go straight to creating challenge
                    match.arena_fighter = fighter.id;
                    return match;
                } else {
                    // new fighter - have to save it first
                    return fighterStore.save(fighter, arenaEmail).then(function(fighterID) {
                        match.arena_fighter = fighterID;
                    }).then(function (){
                        return fighterStore.saveBot(match.arena_fighter, arenaEmail);
                    }).then(function (){
                        return match;
                    });
                }
            }).then(function(match) {
                return match;
            }).catch(function (e) {
                console.error(e);
                return null;
            });
        },
        /**
        * Return promise for object
        * Object: { "msg": <message>, "code": <code> }
        * Codes:
        *      200: success
        *      400: user error
        *      500: server error
        */
        accept: function (matchID, playerFighterID, email) {
            var match, playerFighter, errorMsg = null, player, arenaFighter;

            return challengeStore.read(matchID)
            .then(function (matchObj) {
                if (matchObj === null) {
                    errorMsg = "No such challenge: " + matchID;
                    throw new Error(errorMsg);
                }
                match = matchObj;
                return playerStore.get(match.player);
            })
            .then(function (playerObj) {
                player = playerObj;
                if (player === null) {
                    errorMsg = "No such player: " + match.player;
                    throw new Error(errorMsg);
                } else if (player.money < match.entry_fee) {
                    errorMsg = "You do not have sufficient funds to accept this challenge.";
                    throw new Error(errorMsg);
                }

                return fighterStore.read(playerFighterID);
            }).then(function(playerFighterObj) {
                playerFighter = playerFighterObj;
                if (playerFighter === null) {
                    errorMsg = "No such fighter: " + playerFighterID;
                    throw new Error(errorMsg);
                } else if (playerFighter.fame < match.min_fame) {
                    errorMsg = "This fighter does not meet the minimum fame requirements for this challenge";
                    throw new Error(errorMsg);
                }
                return challengeStore.fighterIsAvailable (playerFighterID, match.timestep_scheduled);
            }).then (function (available) {
                if (!available) {
                    errorMsg = "Selected fighter is involved in another fight";
                    throw new Error(errorMsg);
                }
                return available;
            }).then (function () {
                match.status = "accepted";
                match.player_fighter = playerFighterID;

                return fighterStore.read(match.arena_fighter);
            }).then(function (arenaFighterObj){
                arenaFighter = arenaFighterObj;

                return arenaStore.read(match.arena);

            }).then(function (arena){
                return challengeUtils.getMatchIncome (match, arena, arenaFighter, playerFighter);
            }).then(function (income) {
                //set winner_prize
                match.winner_prize = Math.round(income);
                return;
            }).then(function (){
                return challengeStore.update(match);
            }).then(function () {
                player.money -= match.entry_fee;
                return playerStore.update(player.email, player);
            }).then(function () {
                return { "msg": "ok", "code": 200 };
            }).catch(function (e) {
                return { "msg": errorMsg, "code": 400 };
            });
        },
        /**
         * Create challenges for a player for the current timestep, if not already created.
         *
         * Return a promise, which resolves to object
         * { msg: <msg>, code: <code> }
         * Codes:
         *      200     success
         *      400     user error
         *      500     server error
         */
        create: function (email) {
            var errorMsg = null;
            var timestep;

            return gameStateStore.read()
            .then(function (gameState) {
                timestep = gameState.timestep;
                return challengeStore.getMatchesOnTimestep (email, timestep);
            }).then(function (challenges) {
                console.log("Currently have " + challenges.length + " challenges for timestep " + timestep + ", need " + challengeUtils.minChallengesAndMatches);
                var numNew = Math.max(challengeUtils.minChallengesAndMatches - challenges.length, 0);
                var newChallenges = [];
                for (var i = 0; i < numNew; i++) {
                    newChallenges[i] = challengeUtils.getRandomArenaChallenge (email, timestep);
                }
                return Promise.all(newChallenges);
            }).then (function (newChallenges) {
                for (var i = 0; i < newChallenges.length; i++) {
                    if (newChallenges[i] === null) {
                        throw new Error ("Failed to create challenge");
                    }
                    newChallenges[i].status = "pending";
                    var maxInt = Math.pow(2, 31) - 1;
                    var seed = Math.round(Math.random() * maxInt);
                    newChallenges[i].random_seed = seed;
                }
                return challengeStore.createMany (newChallenges);
            }).then (function (arr) {
                if (arr.length === 0) {
                    return { msg: "no", code: 200 };
                } else {
                    return { msg: "yes", code: 200 };
                }
            })
            .catch (function (e) {
                console.error ("Error in challengeUtils.create");
                console.error (e);
                return { msg: "no", code: 500 };
            });
        },
        recordStrat: function(matchID, fight_round, strat_id){
            var column = "round_"+fight_round+"_strat";
            return knex("arena_challenges")
            .where("id", matchID)
            .update(column, strat_id);
        },
        /*
        *   Current records include 
        *   highest attendance
        *   highest gate
        */
        fight_record: function (matchID, attendance, gate) {
            var arena = [];
            var recordID = null;

            return knex("arena_challenges")
            .where("id", matchID)
            .then(function (arenaArr){
                arena = arenaArr[0];

                //insert attendance record
                return knex("arena_records")
                .returning("id")
                .insert({
                    arena: arena.arena, 
                    timestep: arena.timestep_scheduled, 
                    name: 'attendance', 
                    value: attendance
                });
                //insert attendance record holders
            }).then(function (record_id){
                recordID = parseInt(record_id[0]);

                return knex("record_holders")
                .insert({
                    record: recordID, 
                    holder: arena.arena_fighter, 
                    status: 'void'
                });
            }).then(function (){
                return knex("record_holders")
                .insert({
                    record: recordID,
                    holder: arena.player_fighter,
                    status: 'pending'
                });
                //insert gate record
            }).then(function (){
                return knex("arena_records")
                .returning("id")
                .insert({
                    arena: arena.arena,
                    timestep: arena.timestep_scheduled,
                    name: 'gate',
                    value: gate
                });
                //insert gate record holders
            }).then(function (record_id){
                recordID = parseInt(record_id[0]);

                return knex("record_holders")
                .insert({
                    record: recordID,
                    holder: arena.arena_fighter,
                    status: 'void'
                });
            }).then(function (){
                return knex("record_holders")
                .insert({
                    record: recordID,
                    holder: arena.player_fighter,
                    status: 'pending'
                });
            });
        },
        record: function (matchID, winner_id, loser_id) {
            var match = {};

            var arena_fighter = {};
            var player_fighter = {};
            var winner = {};
            var loser = {};
            var email = "";

            return knex("fighters")
            .where("id", winner_id)
            .then(function (winnerArr){
                if (winnerArr[0].bot){
                    arena_fighter = winnerArr[0];
                    winner = arena_fighter;
                } else {
                    player_fighter = winnerArr[0];
                    winner = player_fighter;
                    email = player_fighter.email;
                }

                return knex("fighters")
                .where("id", loser_id);
            }).then (function (loserArr){
                if (loserArr[0].bot){
                    arena_fighter = loserArr[0];
                    loser = arena_fighter;
                } else {
                    player_fighter = loserArr[0];
                    loser = player_fighter;
                    email = player_fighter.email;
                }

                winner.num_wins++;
                loser.num_losses++;

                return knex("arena_challenges")
                .where({id: matchID, status: 'accepted'});
            }).then(function (matchArr) {
                if (matchArr.length === 0) {
                    return null;
                } else {
                    //update fame and title only if the match is not already resolved
                    challengeUtils.updateFame (winner, loser);
                    challengeUtils.updateTitle (winner);

                    match = matchArr[0];

                    match.status = "resolved";
                    match.winner = winner.id;
                    return challengeStore.update(match)
                    .then(function (){
                        return fighterStore.update(loser);
                    }).then(function (){
                        return fighterStore.update(winner);
                    }).then(function (){
                        return playerStore.get(email);
                    }).then(function (playerState){
                        playerState.num_fights++;
                        if (winner.id === player_fighter.id) {
                            playerState.money += match.winner_prize;
                        }
                        // and return a promise
                        return playerStore.update(playerState.email, playerState);
                    }).then(function (){
                        // update player preferences
                        return challengeUtils.updateSpectatorPrefs (match, winner, loser);
                    });
                }
            });
        }
    };

    return challengeUtils;
};

