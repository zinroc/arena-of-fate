"use strict";

var Promise = Promise || require ("bluebird");

var credentials = require("./credentials.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var strategyStore = require("./my_node_modules/strategyStore.js")(knex);
var traitStore = require("./my_node_modules/traitStore.js")(knex);
var skillStore = require("./my_node_modules/skillStore.js")(knex);
var techniqueStore = require("./my_node_modules/techniqueStore.js")(knex);
var arenaStore = require("./my_node_modules/arenaStore.js")(knex);
var crowdStore = require("./my_node_modules/crowdStore.js")(knex);
	

	function numberToTextConverter (conversion, number){
		number = parseInt(number);

		if (conversion==='height'){
			if (number === 0){
				return 'low';
			} else if (number === 1){
				return 'medium';
			} else if (number === 2){
				return 'high';
			}
		} else if (conversion==='distance'){
			if (number === 0){
				return 'close';
			} else if (number===1){
				return 'medium';
			} else if (number===2){
				return 'far';
			}
		}
    };



module.exports = {

	getSkills: function (request, response) {
		var result ={};
		skillStore.getAll().then(function (skillArr) {
			result.skills = skillArr;
			result.skillIDs = {};
			for (var i=0; i<skillArr.length; i++){
				result.skillIDs[skillArr.name] = skillArr.id;
			}
			response.json(result);
		});
	},

	getStrategies: function (request, response) {
		var strategies = [];
		var result = {};
		var bonuses = [];
		strategyStore.getAll().then(function (stratArr) {
			strategies = stratArr;
			var strat;
			result.strats = {};
			result.stratBonuses = {};

			for (var i=0; i<strategies.length; i++){
				strat = strategies[i];
				strat.initiation_frequency = numberToTextConverter('height', strat.initiation_frequency);
				strat.base_cardio_cost = numberToTextConverter('height', strat.base_cardio_cost);
				strat.initiation_cardio_cost = numberToTextConverter('height', strat.initiation_cardio_cost);
				strat.difficulty = numberToTextConverter('height', strat.difficulty);
				strat.range = numberToTextConverter('distance', strat.range);
				result.strats[strat.id] = strat;
			}
			//response.json(result);

			return strategyStore.getStratBonuses();
		}).then(function (stratBonusesArr){
			bonuses = stratBonusesArr;

			var bonus;
			for (var i=0; i<bonuses.length; i++) {
				bonus = bonuses[i];
				if (!result.stratBonuses.hasOwnProperty(bonus.strategy)) {
					result.stratBonuses[bonus.strategy] = {};
				}
				result.stratBonuses[bonus.strategy][bonus.skill] = bonus.value;
			}
			response.json(result);
		});
	},

	getTraits: function (request, response) {
		var result = {};
		traitStore.getAll().then(function (rows) {
			result.traits = {};
			for (var i=0; i<rows.length; i++){
				var row = rows[i];
				result.traits[row.id] = {};
				result.traits[row.id].id = row.id;
				result.traits[row.id].name = row.name;
				result.traits[row.id].description = row.description;
			}
			response.json(result);
		});
	},
	getArenas: function (request, response){
		var result = [];
		var arenas = [];
		var arenaFans = [];
		arenaStore.getArenas().then(function (arenasArr){
			arenas = arenasArr;
			var promises = [];

			for (var i=0; i<arenas.length;i++){
				var arena = arenas[i];
				promises[i] = crowdStore.getSpectatorsInArena(arena.id);
			}

            return Promise.all(promises);
		}).then(function (arenaFansArr){
			arenaFans = arenaFansArr;
			//arenaFans indexes are in same order as arenas as set above, so i can work for both
			for (var i=0; i<arenas.length; i++){
				result[i] = arenas[i];
				result[i].fans = arenaFans[i].length;
			}
			response.json(result);
		});
	},
	getTechniques: function (request, response) {
		var result = {};
		techniqueStore.getAll().then(function (rows) {
			result.techniques = rows;
			response.json(result);
		});
	}

};