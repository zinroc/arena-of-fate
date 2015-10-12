"use strict";

var chai = require("chai");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var gameStateStore = require("../my_node_modules/gameStateStore.js")(knex),
    testSchema = require("./schema.js")(knex);

var fakeGameStateFactory = {
    create: function () {
        return {
            timestep: 1,
            timestep_interval: 20,
            last_change: new Date()
        }
    },
};

describe("arenaStore", function () {
    "use strict";

    before(function () {
        return testSchema.createGameStateTable();
    });

    afterEach(function () {
        return knex("game_state").del();
    });

    context("#read", function () {
        context("read game state", function () {
            it("Should give back same object as was put in", function () {
                var state = fakeGameStateFactory.create();
                knex("game_state").insert(state)
                .then(gameStateStore.read)
                .then(function (outState) {
                    chai.expect(outState.id).to.be.equal(state.id);
                    chai.expect(outState.timestep).to.be.equal(state.timestep);
                    chai.expect(outState.timestep_interval).to.be.equal(state.timestep_interval);
                    chai.expect(outState.last_change).to.be.equal(state.last_change);
                });
            });
        });
    });

    context("#update", function () {
        context("update game state", function () {
            it ("Should change the game state", function () {
                var state = fakeGameStateFactory.create();
                knex("game_state").insert(state)
                .then(function () {
                    state.timestep++;
                    state.last_change = new Date();
                    return gameStateStore.update(state);
                })
                .then(gameStateStore.read)
                .then(function (outState) {
                    chai.expect(outState.timestep).to.be.equal(state.timestep);
                    chai.expect(outState.last_change).to.be.equal(state.last_change);
                });
            });
        });
    });
});
