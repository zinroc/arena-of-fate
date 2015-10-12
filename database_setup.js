"use strict";

var Promise = Promise || require("bluebird"),
    credentials = require("./credentials.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var schema = require("./test/schema.js")(knex);

module.exports = {
    createTables: function () {
        console.log("Creating tables...");
            // static tables (those which house data not modified by player) first
        return schema.createGameStateTable()
            .then(schema.createLevelsTable)
            .then(schema.createArenaTable)
            .then(schema.createTraitsTable)
            .then(schema.createStrategiesTable)
            .then(schema.createSkillsTable)
            .then(schema.createTechniquesTable)
            .then(schema.insertDummyTech)
            // then player table
            .then(schema.createPlayerTable)
             //then fighters table
            .then(schema.createFightersTable)
            // then all tables which reference fighters
            .then(schema.createArenaChallengesTable)
            .then(schema.createCharacterArtTable)
            .then(schema.createSpectatorTable)
            .then(schema.createSpectatorPrefsTable)
            .then(schema.createArenaRecordsTable)
            .then(schema.createRecordHoldersTable)
            .then(schema.createCharacterSkillsTable)
            .then(schema.createStrategyExperienceTable)
            .then(schema.createPlanTechniquesTable)
            .then(schema.createStrategyBonusesTable)
            .then(schema.createTechniqueConditioningTable)
            .then(schema.createGameState)
        .error(function (e) {
            console.error("There was an error creating some tables");
            console.error(e);
        });
    }
};
