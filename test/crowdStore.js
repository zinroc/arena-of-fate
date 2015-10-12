"use strict";

var chai = require("chai");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var crowdStore = require("../my_node_modules/crowdStore.js")(knex),
    testSchema = require("./schema.js")(knex);

var fakeCrowdFactory = {
    create: function () {
        return {
            home_arena: 2
        }
    }
};

describe("crowdStore", function () {
    before(function () {
        return testSchema.createSpectatorTable()
        .then(function () {
            return testSchema.createSpectatorPrefsTable();
        });
    });

    afterEach(function () {
        return knex("spectators").del();
    });

    describe("#create", function () {
        context("Create first spectator", function () {
            it("Should return ID which is 1", function () {
                var spectator = fakeCrowdFactory.create();
                return crowdStore.create(spectator).then(function (specID) {
                    chai.expect(specID).to.be.equal(1);
                });
            });
        });
    });

    describe("#read", function () {
        context("No such spectator", function () {
            it("Should return null", function () {
                return crowdStore.read(1).then(function (s) {
                    chai.expect(s).to.be.null;
                });
            });
        });

        context("Spectator exists", function () {
            it("Should read back same props as given", function () {
                var in_s = fakeCrowdFactory.create();
                return crowdStore.create(in_s)
                .then(function (id) {
                    return crowdStore.read(id);
                }).then(function (out_s) {
                    chai.expect(out_s).to.not.be.null;
                    chai.expect(out_s.home_arena).to.be.equal(in_s.home_arena);
                });
            });
        });
    });

    describe("#getSpectatorPrefs", function () {
        context("Fighter does not exist", function () {
            it("Should return empty array", function () {
                crowdStore.getSpectatorPrefs(-1, 2)
                .then(function (arr) {
                    chai.expect(arr).to.not.be.null;
                    chai.expect(arr.length).to.be.equal(0);
                });
            });
        });

        context("Arena does not exist", function () {
            it("Should return empty array", function () {
                crowdStore.getSpectatorPrefs(2, -1)
                .then(function (arr) {
                    chai.expect(arr).to.not.be.null;
                    chai.expect(arr.length).to.be.equal(0);
                });
            });
        });
    });
});
