"use strict";

var chai = require("chai"),
    fighterFactory = require("../my_node_modules/fighterFactory.js");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var arenaStore = require("../my_node_modules/arenaStore.js")(knex),
    testSchema = require("./schema.js")(knex);
var fakeArenaFactory = require("./fakeArenaFactory.js");

describe("arenaStore", function () {
    before(function () {
        return testSchema.createArenaTable();
    });

    afterEach(function (done) {
        knex("arenas").del().then(function () {
            done();
        });
    });

    describe("#getArenas", function () {
        context("No arenas", function () {
            it("Should have length 0", function () {
                return arenaStore.getArenas()
                .then(function (arenaList) {
                    chai.expect(arenaList.length).to.be.equal(0);
                });
            });
        });

        context("1 arena", function () {
            it("Should have length 1", function () {
                var arena = fakeArenaFactory.create();
                return knex("arenas").insert(arena).then(function () {
                    return arenaStore.getArenas();
                }).then(function (arenaList) {
                    chai.expect(arenaList.length).to.be.equal(1);
                });
            });

            it("Should have same properties as inserted arena", function () {
                var arena = fakeArenaFactory.create();
                return knex("arenas").insert(arena).then(function () {
                    return arenaStore.getArenas();
                }).then(function (arenaList) {
                    var outArena = arenaList[0];
                    chai.expect(outArena.name).to.be.equal(arena.name);
                    chai.expect(outArena.capacity).to.be.equal(arena.capacity);
                    chai.expect(outArena.ticket_price).to.be.equal(arena.ticket_price);
                });
            });
        });
    });

    describe("#read", function () {
        context("read arena which doesn't exist", function () {
            it("Should return null", function () {
                return arenaStore.read(3).then(function (arena) {
                    chai.expect(arena).to.be.null;
                });
            });
        });

        context("read arena which exists", function () {
            it("Should have same ID", function () {
                var arena = fakeArenaFactory.create();
                var sqlID;

                return knex("arenas").insert(arena)
                .returning("id")
                .then(function (arenaID) {
                    sqlID = arenaID[0];
                    return arenaStore.read(sqlID);
                }).then (function (outArena) {
                    chai.expect(outArena).to.not.be.null;
                    chai.expect(outArena.id).to.not.be.null;
                    chai.expect(outArena.id).to.be.equal(sqlID);
                });
            });
        });
    });
});
