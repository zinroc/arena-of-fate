// assertion library
var chai = require("chai");
// in-memory database for testing
var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});
// create schemas for testing database calls
var testSchema = require("./schema.js")(knex);
// import the thing we're actually testing
var playerStore = require ("../my_node_modules/playerStore.js")(knex);
/**
 * Create fake players for the purposes of testing
 */
var playerFactory = {
    _randomChoice: function (arr) {
        var idx = Math.floor (Math.random() * arr.length);
        return arr[idx];
    },
    _fakeEmail: function () {
        var name = ["a", "b", "c", "dbk99", "fast2furious"];
        var domain = ["google", "hotmail", "fastmail", "aol"];
        var tld = ["slv", "ca", "com", "ru", "fr"];
        return playerFactory._randomChoice(name) + "@" + playerFactory._randomChoice(domain) + "." + playerFactory._randomChoice(tld);
    },
    _fakeName: function () {
        var first = ["Christopher", "Carter", "Emma", "Hailey"];
        var last = ["Sun", "Jones", "Ryan", "Patel"];
        return playerFactory._randomChoice (first) + " " + playerFactory._randomChoice(last);
    },
    create: function () {
        return {
            name: playerFactory._fakeName(),
            email: playerFactory._fakeEmail(),
            num_fights: Math.round(Math.random() * 1000),
            money: Math.round(Math.random() * 1000000),
            fame: Math.random() * 2000
        }
    }
};

describe("playerStore", function () {
    before (function () {
        return testSchema.createPlayerTable();
    });

    afterEach(function (done) {
        knex("players").del().then(function () {
            done();
        });
    });

    describe("#get", function () {
        context ("Read a non-existant player", function () {
            it ("Returns null", function () {
                return playerStore.get ("not@anemail.com").then (function (player) {
                    chai.expect (player).to.be.null;
                });
            });

            it ("Returns same object as was put in", function () {
                var player = playerFactory.create();
                return knex("players").insert(player).then(function () {
                    return playerStore.get (player.email);
                }).then (function (outPlayer) {
                    chai.expect(outPlayer).to.not.be.null;
                    chai.expect(outPlayer.email).to.be.equal(player.email);
                    chai.expect(outPlayer.name).to.be.equal(player.name);
                    chai.expect(outPlayer.num_fights).to.be.equal(player.num_fights);
                    chai.expect(outPlayer.money).to.be.equal(player.money);
                    // TODO maybe something more concrete here
                    chai.expect(outPlayer.fame).to.be.greaterThan(0);
                });
            });
        });
    });

    describe("#create", function () {
        context ("Create a player", function () {
            it ("Puts the player into the DB", function () {
                var fakePlayer = playerFactory.create();
                return playerStore.create (fakePlayer.name, fakePlayer.email)
                .then(function (id) {
                    chai.expect (id).to.not.be.null;
                    return playerStore.get(fakePlayer.email);
                }).then(function (outPlayer) {
                    chai.expect(outPlayer).to.not.be.null;
                    chai.expect(outPlayer.email).to.be.equal(fakePlayer.email);
                    chai.expect(outPlayer.name).to.be.equal(fakePlayer.name);
                    chai.expect(outPlayer.num_fights).to.be.equal(0);
                    // TODO maybe do something more concrete here
                    chai.expect(outPlayer.money).to.be.greaterThan(0);
                    chai.expect(outPlayer.fame).to.be.not.be.null;
                });
            });
        });
    });

    describe("#getFameRankings", function () {
        context ("No players", function () {
            it ("Returns an empty array", function () {
                return playerStore.getFameRankings()
                .then(function(rankings) {
                    chai.expect(rankings).to.not.be.null;
                    chai.expect(rankings).to.be.empty;
                });
            });
        });

        context("1 player", function () {
            it ("Returns that player's name and fame", function () {
                var fakePlayer = playerFactory.create();
                return playerStore.create(fakePlayer.name, fakePlayer.email)
                .then(function () {
                    // update with fake player's fame
                    return playerStore.update(fakePlayer.email, fakePlayer);
                }).then(function () {
                    return playerStore.getFameRankings();
                }).then(function (repArray) {
                    chai.expect(repArray).to.not.be.null;
                    chai.expect(repArray).to.not.be.empty;
                    var outPerson = repArray[0];
                    chai.expect(outPerson).to.not.be.null;
                    chai.expect(outPerson.name).to.be.equal(fakePlayer.name);
                    chai.expect(outPerson.fame).to.be.equal(fakePlayer.fame);
                });
            });
        });
    });
});
