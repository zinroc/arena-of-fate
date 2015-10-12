"use strict";

var Promise = Promise || require("bluebird");

var fighterFactory = require("./my_node_modules/fighterFactory.js"),
    credentials = require("./credentials.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var playerStore = require("./my_node_modules/playerStore.js")(knex),
    fighterStore = require("./my_node_modules/fighterStore.js")(knex),
    challengeStore = require("./my_node_modules/challengeStore.js")(knex),
    arenaStore = require("./my_node_modules/arenaStore.js")(knex),
    gameStateStore = require("./my_node_modules/gameStateStore.js")(knex),
    challengeUtils = require ("./challengeUtils.js")(knex),
    characterStore = require("./my_node_modules/characterStore.js")(knex),
    strategyStore = require("./my_node_modules/strategyStore.js")(knex),
    skillStore = require("./my_node_modules/skillStore.js")(knex),
    advanceTimestep = require("./my_node_modules/advance_timestep.js")(knex);


/**
 * Functions here do calculations, and do not interact with the database
 */
var arenaUtils = {
    /**
     * Minimum number of fighters a player is allowed to have
     */
    minFighters: 3,
};

var gameState = {};

/**
 * Functions here are the interface with the outside world
 */
module.exports = gameState = {

    updateTechSlot: function(email, slot, tech_id, stratExp_id, response) {
        fighterStore.updateTechSlot(email, slot, tech_id, stratExp_id).then(function (result) {
            console.log(result, "RESULT");
            response.json(result).end();
        });
    },

    getFighters: function (email, response) {
        fighterStore.getLiving(email).then(function (rows) {
            response.json(rows).end();
        });
    },
    getFighter: function (email, fighterID, response) {
        // TODO use email somehow
        var fighter;
        return fighterStore.read(fighterID)
        .then(function (fighterObj) {
            fighter = fighterObj;
            return fighterStore.getSkills(fighterID);
        })
        .then(function (skills) {
            fighter.skills = {};
            for (var i=0; i<skills.length; i++){
                var skill = skills[i];
                fighter.skills[skill.skill] = skill.value;
            }
            return fighterStore.getStrategyExperience(fighterID);
        })
        .then(function (exp) {
            fighter.experience = {};
            for (var i=0; i<exp.length; i++){
                var expRow = exp[i];
                fighter.experience[expRow.strategy] = {};
                fighter.experience[expRow.strategy].as = expRow.experience_as;
                fighter.experience[expRow.strategy].against = expRow.experience_against;
            }

            for (var i=0; i<exp.length; i++){
                if (exp[i].rank === 1){
                    fighter.strategy = exp[i].strategy;
                    break;
                }
            }
            response.json(fighter).end();
        });
    },
    /**
    *   Returns 3 objects - fighters, fightersExperience, fighterSkills
    */
    getCharacters: function (email, response) {
        var skills = [];
        var stratExp = [];
        var characters = [];

        characterStore.getAll().then(function (charArray) {
            characters = charArray;
            var promises = [];
            var character;

            for (var i = 0; i < characters.length; i++) {
                character = characters[i];
                promises[i] = characterStore.getSkills(character.id);
            }

            return Promise.all(promises);
        }).then(function (skillsArr) {
            skills = skillsArr;
            var character;
            var promises = [];

            for (var i = 0; i < characters.length; i++) {
                character = characters[i];
                promises[i] = characterStore.getStrategyExperience(character.id);
            }

            return Promise.all(promises);
        }).then(function (stratArr) {
            stratExp = stratArr;
            var result = {};
            result.fighterSkills = {};
            result.fightersExperience = {};
            result.fighters = characters;

            for (var i=0; i<characters.length; i++){
                var character = characters[i];
                result.fighterSkills[character.id] = {};
                result.fightersExperience[character.id] = {};
                for (var j=0; j<skills[i].length; j++){
                    var skill = skills[i][j];
                    result.fighterSkills[character.id][skill.skill] = skill.value;
                }

                for (var j=0; j<stratExp[i].length; j++){
                    var exp = stratExp[i][j];
                    result.fightersExperience[character.id][exp['strategy']] = {};
                    result.fightersExperience[character.id][exp['strategy']].as = exp['experience_as'];
                    result.fightersExperience[character.id][exp['strategy']].against = exp['experience_against'];

                    if (exp.rank === 1){
                        result.fighters[i].strategy = exp['strategy'];
                    }
                }

            }
            response.json(result).end();
            //
        });
    },
    getPlans: function (fighter_id, response){
        var plans = [];
        var strategies = [];
        characterStore.getPlans(fighter_id).then(function (planArray){
            plans = planArray;
            var promises = [];
            var plan;

            for (var i=0; i<plans.length; i++){
                plan = plans[i];
                promises[i] = strategyStore.getStrategy(plan.strategy);
            }
            return Promise.all(promises);
        }).then(function (strategyArr){
            var result = {};
            result.plans = [];
            strategies = strategyArr;
            var strat; 
            for (var i=0; i<plans.length; i++){
                strat = strategies[i];
                result.plans[i] = {};
                result.plans[i] = plans[i];
                result.plans[i].name = strat.name;
            }
            response.json(result).end();
        });
    },
    /**
    * Get the techniques in each slot (slot_1, slot_2 etc.) of the active plan
    * A plan is a strategy_experience entry with a rank (not NULL)
    */
    getSlots: function (fighter_id, response){
        var plans = [];
        var planTechniques = {};
        //getPlans gets the strat_experience of entries that have ranks
        characterStore.getPlans(fighter_id).then(function (planArray){

            plans = planArray;
            var promises = [];
            var plan;

            for (var i=0; i<plans.length; i++){
                plan = plans[i];
                promises[i] = characterStore.getPlanTechniques(plan.id);
            }
            return Promise.all(promises);
        }).then(function (planTechArr){
            planTechniques = planTechArr;
            var result = {};
            result.slots = {};
            var plan;
            for (var i=0; i<plans.length; i++){
                plan = plans[i];
                result.slots[plan.strategy] = {};
                result.slots[plan.strategy].slot_1 = planTechniques[i].slot_1;
                result.slots[plan.strategy].slot_2 = planTechniques[i].slot_2;
                result.slots[plan.strategy].slot_3 = planTechniques[i].slot_3;
                result.slots[plan.strategy].ultimate = planTechniques[i].ultimate;
            }
            response.json(result).end();
        });
    },

    getTechCond: function (fighter_id, response){
        characterStore.getTechCond(fighter_id).then(function (rows){
            var result = {};
            result.techConditioning = {};
            var row;
            for (var i=0; i<rows.length; i++){
                row = rows[i];
                result.techConditioning[row.technique] = row.conditioning;
            }

            response.json(result).end();
        });
    },
    /**
     * Helper function to createFighters to create a single new fighter
     * Return promise to a fighter ID
     */
    createFighter: function (email) {
        var fighter = fighterFactory.create();
        return fighterStore.save(fighter, email)
        .then(function (fighterID) {
            return fighterID;
        });
    },
    /**
     * Create fighters for the given player.
     * Create as many fighters as they need to get to minFighters
     * Return back to the user an array of all the fighters the user has, as JSON
     */
    createFighters: function (email, response) {
        fighterStore.getLiving (email)
        .then(function (fighters) {
            var numNewFighters = Math.max(arenaUtils.minFighters - fighters.length, 0);
            console.log("Creating " + numNewFighters + " for player " + email);
            var promises = [];
            for (var i = 0; i < numNewFighters; i++) {
                promises[i] = gameState.createFighter(email);
            }
            return Promise.all(promises);
        }).then(function (fighterIDs) {
            return fighterStore.getLiving(email);
        }).then(function (fighters) {
            response.json(fighters).end();
        });
    },
    getPlayerState: function (email, name, response) {
        playerStore.get(email).then(function (player) {
            if (player) {
                player.name = name;
                playerStore.update(email, player).then(function () {
                    response.json(player).end();
                });
            } else {
                playerStore.create(name, email)
                .then(function (id) {
                    return playerStore.get(email);
                }).then(function (player) {
                    response.json(player).end();
                });
            }
        });
    },
    resetGameState: function (email, res) {
        challengeStore.deleteAll(email).then(function (r) {
            return r;
        }).then(function () {
            return fighterStore.deleteAll(email).then(function (r) {
                return r;
            });
        }).then(function () {
            return playerStore.delete(email).then(function (r) {
                return r;
            });
        }).then(function () {
            res.send("ok");
        });
    },
    /**
     * Move to the next timestep. This function is called by clients.
     * On success, give back new timestep
     * On failure (wrong timestamp), give back current timestep
     *
     * @deprecated
     */
    advanceTimestep: function (userTimestep, res) {
        var gs;
        // TODO wrap this in transaction
        return gameStateStore.read()
        .then(function (state) {
            gs = state;
            if (userTimestep !== gs.timestep) {
                throw new Error("Timestep is not correct, early exiting");
            }
            return gs;
        }).then(function (gs) {
            return advanceTimestep.internalAdvanceTimestep(gs);
        }).then(function (gs) {
            res.json({ "timestep": gs.timestep });
        });
    },
    getGameState: function (res) {
        gameStateStore.read()
        .then(function (gameState) {
            res.json(gameState);
        });
    },
    getRankings: function (res) {
        playerStore.getMoneyRankings()
        .then(function (rankings) {
            res.json(rankings);
        });
    }
};
