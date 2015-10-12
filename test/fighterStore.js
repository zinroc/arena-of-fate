"use strict";

var chai = require("chai"),
    fighterFactory = require("../my_node_modules/fighterFactory.js");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var fighterStore = require("../my_node_modules/fighterStore.js")(knex),
    testSchema = require("./schema.js")(knex);

describe("fighterStore", function () {
    before(function () {
        return testSchema.createTraitsTable()
        .then(testSchema.createFightersTable());
    });

    afterEach(function (done) {
        knex("fighters").del().then(function () {
            done();
        });
    });

    describe("#save", function () {
        context("Create first fighter", function () {
            it("Should return ID which is 1", function () {
                var fighter = fighterFactory.create();
                var fakeEmail = "fake@email.fake";

                return fighterStore.save(fighter, fakeEmail).then(function (fighterID) {
                    chai.expect(fighterID).to.be.equal(1);
                });
            });
        });
    });

    describe("#read", function () {
        context("No such fighter", function () {
            it("Should return null", function () {
                return fighterStore.read(7).then(function (fighter) {
                    chai.expect(fighter).to.be.null;
                });
            });
        });

        context("Fighter in = fighter out", function () {
            it ("Fighter out should have same name and ID as fighter in", function () {
                var fighter = fighterFactory.create(),
                fakeEmail = "fake@email.fake",
                fighterID = null;
                return fighterStore.save(fighter, fakeEmail).then(function (id) {
                    fighterID = id;
                    return fighterID;
                }).then(function (fighterID) {
                    return fighterStore.read(fighterID);
                }).then(function (f2) {
                    chai.expect(fighterID).to.be.equal(f2.id);
                    chai.expect(fighter.name).to.be.equal(f2.name);
                });
             });
        });
    });
});
