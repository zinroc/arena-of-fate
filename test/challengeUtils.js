"use strict";

var chai = require("chai");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var challengeUtils = require("../challengeUtils.js")(knex),
    testSchema = require("./schema.js")(knex);

var fakeArenaFactory = require("./fakeArenaFactory.js");

describe("challengeUtils", function () {
    before(function () {
        return testSchema.createTraitsTable()
        .then(testSchema.createArenaChallengesTable)
        .then(testSchema.createGameStateTable)
        .then(testSchema.createGameState)
        .then(testSchema.createArenaTable)
        .then(testSchema.createFightersTable);
    });

    afterEach(function (done) {
        return knex("arena_challenges").del().then(function () {
            done();
        });
    });

    describe("#create", function () {
        context("No arenas", function () {
            it("Should return server-side error code", function () {
                var email = "fake@fakeperson.com";

                return challengeUtils.create(email)
                .then(function (obj) {
                    chai.expect(obj.code).to.be.equal(500);
                    chai.expect(obj.msg).to.not.be.null;
                });
            });
        });

        context ("Create first challenge", function () {
            it("Should create a challenge and return OK code", function () {
                var email = "fake@fakeperson.com";
                var arena = fakeArenaFactory.create();

                return knex("arenas").insert(arena)
                .then(function () {
                    return challengeUtils.create(email)
                }).then(function (obj) {
                    chai.expect(obj.code).to.be.equal(200);
                    chai.expect(obj.msg).to.be.not.be.null;
                });
            });

            // TODO verify that challenge was created
        });
    });

    describe("#accept", function () {
        context ("No such challenge", function () {
            it ("Should return code 400 and some sort of error msg", function () {
                return challengeUtils.accept(25, 25, "fake@fakeperson.com")
                .then(function (obj) {
                    chai.expect(obj.code).to.be.equal(400);
                    chai.expect(obj.msg).to.not.be.null;
                });
            });
        });

        context("No such fighter", function () {
            it ("Should return code 400 and some sort of error msg", function () {
                var email = "fake@fakeperson.com";

                return challengeUtils.create(email)
                .then(function (challengeID) {
                    return challengeUtils.accept(challengeID, 25, email);
                }).then(function (obj) {
                    chai.expect(obj.code).to.be.equal(400);
                    chai.expect(obj.msg).to.not.be.null;
                });
            });
        });
    });
});
