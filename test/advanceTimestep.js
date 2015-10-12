"use strict";

var chai = require("chai");
var Promise = Promise || require("bluebird");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var bookshelf = require("bookshelf")(knex);

var testSchema = require("./schema.js")(knex),
    playerFactory = require("./playerFactory.js"),
    fighterFactory = require("../my_node_modules/fighterFactory.js"),
    challengeFactory = require("../test/challengeFactory.js"),
    arenaFactory = require("../test/arenaFactory.js"),
    advanceTimestep = require("../my_node_modules/advance_timestep.js")(knex),
    gameStateStore = require("../my_node_modules/gameStateStore.js")(knex),
    model = require("../my_node_modules/model.js")(knex, bookshelf);

var shallowCloneObject = function (obj) {
    var newObj = {};
    for (var k in obj) {
        newObj[k] = obj[k];
    }
    return newObj;
}

describe("internalAdvanceTimestep", function () {
    before(function () {
        return testSchema.createGameStateTable()
        .then(testSchema.createGameState)
        .then(testSchema.createArenaTable)
        .then(testSchema.createPlayerTable)
        .then(testSchema.createFightersTable)
        .then(testSchema.createArenaChallengesTable);
    });

    afterEach(function () {
        // delete all fighters
        return knex("fighters").select("*").del()
        .then(function () {
            return knex("players").select("*").del();
        });
    });

    context("No players, no fighters, no NOTHING", function emptyTest () {
        it("Should advance timestep by 1", function () {
            var old_game_state;
            return gameStateStore.read()
            .then(function (state) {
                old_game_state = state;
                return shallowCloneObject(old_game_state);
            })
            .then(function (state) {
                return advanceTimestep.internalAdvanceTimestep(state);
            })
            .then(gameStateStore.read)
            .then(function (state) {
                chai.expect(state.timestep).to.be.equal(old_game_state.timestep + 1);
            });
        });
    });

    context("There are players, but no fighters", function playerNoFighterTest () {
        it("Should advance timestep by 1", function () {
            var old_game_state;
            var player = playerFactory.create();
            return knex("players").insert(player)
            .then(gameStateStore.read)
            .then(function (state) {
                old_game_state = state;
                return shallowCloneObject(old_game_state);
            })
            .then(function (state) {
                return advanceTimestep.internalAdvanceTimestep(state);
            })
            .then(gameStateStore.read)
            .then(function (state) {
                chai.expect(state.timestep).to.be.equal(old_game_state.timestep + 1);
            });
        });
    });

    context("There are players and fighters, but no challenges", function noChallengesTest () {
        it("Should advance timestep by 1", function () {
            var old_game_state;
            var player = playerFactory.create();
            var fighters = [];
            var numFighters = 10;
            for (var i = 0; i < numFighters; i++) {
                fighters[i] = fighterFactory.create();
                fighters[i].email = player.email;
            }
            return knex("players").insert(player)
            .then(function () {
                return Promise.map(fighters, function (fighter) {
                    return knex("fighters").insert(fighter);
                });
            })
            .then(gameStateStore.read)
            .then(function (state) {
                old_game_state = state;
                return shallowCloneObject(old_game_state);
            })
            .then(function (state) {
                return advanceTimestep.internalAdvanceTimestep(state);
            })
            .then(gameStateStore.read)
            .then(function (state) {
                chai.expect(state.timestep).to.be.equal(old_game_state.timestep + 1);
            });
        });
    });

    /**
     * No associated arena fighter
     */
    context("There is a single pending challenge", function singlePendingTest() {
        it("Should be declined", function () {
            var p = playerFactory.create();
            var player = model.Player.forge(p);

            var a = arenaFactory.create();
            var arena = model.Arena.forge(a);
            //console.log(arena);

            var challengeStore = require("../my_node_modules/challengeStore.js");
            var c = challengeFactory.create();
            var challenge = model.Challenge.forge(c);
            //console.log(challenge);

            return player.save()
            .then(function () {
                return arena.save();
            }).then(function () {
                return challenge.set("arena", arena.get("id"))
                    .set("player", player.get("email"))
                    .save();
            })
            .then(function () {
                return model.GameState.where("id", 1).fetch();
            })
            .then(function (state) {
                return advanceTimestep.internalAdvanceTimestep(state.serialize());
            })
            .then(function () {
                return model.Challenge.fetchAll();
            })
            .then(function (challenges) {
                for (var i = 0; i < challenges.length; i++) {
                    var challenge = challenges.at(i);
                    chai.expect(challenge.get("status")).to.be.equal("declined");
                }
            });
        });
    });

    context("There is a single accepted challenge", function singleAcceptedTest () {
        it("Should be declined", function () {
        });
    });
});
