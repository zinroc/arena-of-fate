"use strict";
module.exports = function (knex) {
    return {
        createGameStateTable: function createGameStateTable () {
            return knex.schema.hasTable("game_state")
            .then(function(exists) {
                if (!exists) {
                    return knex.schema.createTable("game_state", function (table) {
                        table.increments("id");
                        table.integer("timestep").notNullable();
                        // in minutes
                        table.integer("timestep_interval").notNullable();
                    });
                }
            });
        },
        /**
         * Insert a game state into the table, if none exists
         */
        createGameState: function createGameState () {
            return knex("game_state").select("*")
            .then(function (rows) {
                if (rows.length === 0) {
                    return knex("game_state").insert({
                        "id": 1,
                        "timestep": 1,
                        "timestep_interval": 10,
                    });
                }
            });
        },
        createSpectatorTable: function createSpectatorTable () {
            return knex.schema.hasTable("spectators")
            .then(function (exists) {
                if (! exists) {
                    return knex.schema.createTable("spectators", function (table) {
                        table.increments("id").notNullable();
                        table.integer("home_arena").notNullable().references("id").inTable("arena");
                    });
                }
            });
        },
        createSpectatorPrefsTable: function createSpectatorPrefsTable () {
            return knex.schema.hasTable("spectator_prefs")
            .then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable("spectator_prefs", function (table) {
                        table.integer("spectator_id").references("id").inTable("spectators");
                        table.integer("fighter_id").references("id").inTable("fighters");
                        table.float("pref");
                    });
                }
            });
        },
        createArenaChallengesTable: function createArenaChallengesTable () {
            return knex.schema.hasTable("arena_challenges")
            .then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable("arena_challenges", function (table) {
                        table.increments("id");
                        table.integer("arena").notNullable();
                        table.string("player").notNullable().references("email").inTable("players");
                        table.string("status");
                        table.integer("arena_fighter").references("id").inTable("fighters");
                        table.integer("player_fighter").references("id").inTable("fighters");
                        table.integer("entry_fee").notNullable();
                        table.integer("winner_prize");
                        table.integer("winner").references("id").inTable("fighters");
                        table.integer("min_fame");
                        table.integer("timestep_scheduled").notNullable();
                        // so the fight can be repeatable
                        table.integer("random_seed").notNullable();
                        table.integer("round_1_strat").references("id").inTable("strategies");
                        table.integer("round_2_strat").references("id").inTable("strategies");
                        table.integer("round_3_strat").references("id").inTable("strategies");
                    });
                }
            });
        },
        createArenaTable: function createArenaTable () {
            return knex.schema.hasTable("arenas")
            .then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable("arenas", function (table) {
                        table.increments("id");
                        table.string("name");
                        table.integer("capacity");
                        table.float("ticket_price");
                        table.integer("daily_prize_pool");
                        table.integer("record_prize_pool");
                        table.integer("stash");
                    });
                }
            });
        },
        createArenaRecordsTable: function createArenaRecordsTable (){
            return knex.schema.hasTable("arena_records")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("arena_records", function (table){
                        table.increments("id");
                        table.integer("arena").references("id").inTable("arenas");
                        table.integer("timestep");
                        table.string("name");
                        table.integer("value");
                    });
                }
            });
        },
        createRecordHoldersTable: function createRecordHoldersTable () {
            return knex.schema.hasTable("record_holders")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("record_holders", function (table){
                        table.increments("id");
                        table.integer("record").references("id").inTable("arena_records");
                        table.integer("holder").references("id").inTable("fighters");
                        table.string("status");
                        table.integer("reward");
                    });
                }
            });
        },
        createPlayerTable: function () {
            return knex.schema.hasTable("players")
            .then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable("players", function (table) {
                        table.increments("id");
                        table.string("name").notNullable();
                        table.string("email").notNullable().unique();
                        table.integer("money").notNullable().defaultTo(0);
                        table.integer("num_fights").notNullable().defaultTo(0);
                        table.float("fame").notNullable();
                        table.boolean("admin").notNullable().defaultTo(false);
                        table.integer("gym_level").defaultTo(1);
                    });
                }
            });
        },
        createStrategiesTable: function (){
            return knex.schema.hasTable("strategies")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("strategies", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.integer("initiation_frequency");
                        table.integer("base_cardio_cost");
                        table.integer("initiation_cardio_cost");
                        table.integer("difficulty");
                        table.integer("range");
                        table.integer("art");
                    });
                }
            });

        },
        createRoomsTable: function(){
            return knex.schema.hasTable("rooms")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("rooms", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.string("art");

                    });
                }
            });
        },
        createPlayerRoomsTable: function (){
            return knex.schema.hasTable("player_rooms")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("player_rooms", function (table){
                        table.increments("id");
                        table.string("room"); //there are more rooms than those listed in rooms table
                        table.string("owner").references("email").inTable("players");
                        table.integer("occupant").references("id").inTable("fighters");
                        table.integer("rent").defaultTo(0);
                        table.boolean("rent_open").defaultTo(false);
                        table.integer("index");
                        table.integer("level");

                    });
                }
            });
        },
        createTraitsTable: function  () {
            return knex.schema.hasTable("traits")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("traits", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.string("description");
                    });
                }
            });
        },
        createSkillsTable: function createSkillsTable () {
            return knex.schema.hasTable("skills")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("skills", function (table){
                        table.increments("id");
                        table.string("name").unique();
                    });
                }
            });
        },
        createTechniquesTable: function createTechniquesTable () {
            return knex.schema.hasTable("techniques")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("techniques", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.integer("level");
                        table.integer("trait").references("id").inTable("traits");
                        table.integer("strategy").references("id").inTable("strategies");
                        table.string("effect_description");
                        table.string("preconditions");
                        table.integer("range");
                        table.integer("brawl_value");
                        table.boolean("ultimate");
                        table.integer("technical_value");
                        table.integer("cardio_cost");
                    });
                }
            });
        },
        insertDummyTech: function (){
            return knex("techniques")
            .where("id", 0)
            .then(function (rows) {
                if (rows.length === 0) {
                    return knex("techniques").insert({id: 0, name: 'bot_dummy'});
                }
            });
        },
        createCharacterArtTable: function (){
            return knex.schema.hasTable("character_art")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("character_art", function(table){
                        table.increments("id");
                        table.string("portrait");
                        table.string("body");
                    });
                }
            });
        },
        createFightersTable: function () {
            return knex.schema.hasTable("fighters")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("fighters", function (table){
                        table.increments("id");
                        table.string("name").notNullable();
                        table.integer("art");
                        table.integer("body_art");
                        table.integer("trait").references("id").inTable("traits");
                        // does not reference email in table player because of bots
                        table.string("email").notNullable();
                        table.string("title");
                        table.integer("fame").notNullable();
                        table.integer("num_wins").notNullable().defaultTo(0);
                        table.string("status");
                        table.integer("num_losses").notNullable().defaultTo(0);
                        table.integer("num_ties").notNullable().defaultTo(0);
                        table.boolean("bot").defaultTo(false);
                        table.integer("trust").defaultTo(1);
                        table.integer("misery").defaultTo(0);
                        table.integer("age").defaultTo(2);
                    });
                }
            });
        },
        createPersonalitiesTable: function (){
            return knex.schema.hasTable("personalities")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("personalities", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.string("color").unique();
                        table.integer("train");
                        table.integer("feast");
                        table.integer("pray");
                        table.integer("entertainment");
                        table.integer("family");
                    });
                }
            });
        },
        createCharacterPersonalitiesTable: function (){
            return knex.schema.hasTable("character_personalities")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("character_personalities", function (table){
                        table.increments("id");
                        table.integer("character").references("id").inTable("fighters");
                        table.integer("index");
                        table.string("personality_trait").references("name").inTable("personalities");
                    });
                }
            });
        },
        createCharacterModifiersTable: function (){
            return knex.schema.hasTable("character_modifiers")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("character_modifiers", function (table){
                        table.increments("id");
                        table.integer("character_id").references("id").inTable("fighters");
                        table.string("modifier");
                    });
                }
            });
        },
        createCharacterSkillsTable: function (){
            return knex.schema.hasTable("character_skills")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("character_skills", function (table) {
                        table.increments("id");
                        table.integer("character").references("id").inTable("fighters");
                        table.integer("skill").references("id").inTable("skills");
                        table.integer("value").notNullable();
                        table.unique(["character", "skill"]);
                    });
                }
            });
        },
        createLevelsTable: function createLevelsTable () {
            return knex.schema.hasTable("levels")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("levels", function (table) {
                        table.increments("id");
                        table.string("name").unique();
                        table.integer("rank");
                    });
                }
            });
        },
        createStrategyExperienceTable: function createStrategyExperienceTable () {
            return knex.schema.hasTable("strategy_experience")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("strategy_experience", function (table){
                        table.increments("id");
                        table.integer("character").references("id").inTable("fighters");
                        table.integer("experience_as");
                        table.integer("experience_against");
                        table.integer("strategy").references("id").inTable("strategies");
                        table.integer("rank");
                    });
                }
            });
        },
        createPlanTechniquesTable: function createPlanTechniquesTable () {
            return knex.schema.hasTable("plan_techniques")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("plan_techniques", function (table){
                        table.increments("id");
                        table.integer("plan").references("id").inTable("strategy_experience");
                        table.integer("slot_1").references("id").inTable("techniques");
                        table.integer("slot_2").references("id").inTable("techniques");
                        table.integer("slot_3").references("id").inTable("techniques");
                        table.integer("ultimate").references("id").inTable("techniques");
                    });
                }
            });
        },
        createStrategyBonusesTable: function createStrategyBonusesTable () {
            return knex.schema.hasTable("strategy_bonuses")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("strategy_bonuses", function (table){
                        table.increments("id");
                        table.integer("strategy").references("id").inTable("strategies");
                        table.integer("skill").references("id").inTable("skills");
                        table.integer("value");
                    });
                }
            });
        },
        createTechniqueConditioningTable: function createTechniqueConditioningTable () {
            return knex.schema.hasTable("technique_conditioning")
            .then(function (exists){
                if (!exists) {
                    return knex.schema.createTable("technique_conditioning", function (table){
                        table.increments("id");
                        table.integer("character").references("id").inTable("fighters");
                        table.integer("technique").references("id").inTable("techniques");
                        table.integer("conditioning");
                    });
                }
            });
        }
    };
};
