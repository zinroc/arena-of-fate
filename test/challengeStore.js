"use strict";

var chai = require("chai"),
    fakeArenaFactory = require("./fakeArenaFactory.js"),
    fighterFactory = require("../my_node_modules/fighterFactory.js");

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: ":memory:"
    }
});

var challengeStore = require("../my_node_modules/challengeStore.js")(knex),
    testSchema = require("./schema.js")(knex);

var numArenas = 5;
var numFighters = 5;
// filled in before test runs
var arenas = [];
var fighters = [];

var fakeChallengeFactory = {
    randomArenaFighter: function () {
        return 1 + Math.floor(Math.random() * numFighters);
    },
    randomArena: function () {
        return 1 + Math.floor(Math.random() * numArenas);
    },
    create: function () {
        /* arena <= numArenas, arena_fighter <= numFighters */
        /* status must be pending */
        return  {
            arena: fakeChallengeFactory.randomArena(),
            player: "fake@fakeperson.com",
            status: "pending",
            arena_fighter: fakeChallengeFactory.randomArenaFighter(),
            player_fighter: null,
            entry_fee: 400,
            winner_prize: null,
            min_fame: 1000,
            timestep_scheduled: 1,
            random_seed: Math.random() * (Math.pow(2, 31) - 1)
        }
    }
};

describe("challengeStore", function () {
    before(function () {
        return testSchema.createArenaChallengesTable()
        .then (function () {
            return testSchema.createArenaTable();
        }).then (function () {
            return testSchema.createFightersTable();
        }).then (function () {
            // populate the arena table
            for (var i = 0; i < numArenas; i++) {
                arenas[i] = fakeArenaFactory.create();
            }
            return knex("arenas").insert(arenas);
        }).then (function () {
            // populate the fighters table with a fighter for each arena
            for (var i = 0; i < numFighters; i++) {
                fighters[i] = fighterFactory.create();
                fighters[i].email = arenas[i].name + "@arenas.com";
            }
            return knex("fighters").insert(fighters);
        });
    });

    afterEach(function (done) {
        return knex("arena_challenges").del().then(function () {
            done();
        });
    });

    describe("#create", function () {
        context("initial challenge", function () {
            it("Should return ID", function () {
                var challenge = fakeChallengeFactory.create();
                return challengeStore.create(challenge)
                .then(function (challengeID) {
                    chai.expect(challengeID).to.not.be.null;
                });
            });
        });
    });

    describe("#createMany", function () {
        context("create none", function () {
            it("Should return empty array", function () {
                return challengeStore.createMany([])
                .then(function (arr) {
                    chai.expect(arr).to.be.empty;
                });
            });
        });
    });

    describe("#read", function () {
        context ("get by ID when ID invalid", function () {
            it ("Should return null", function () {
                return challengeStore.read(1)
                .then (function (challenge) {
                    chai.expect(challenge).to.be.null;
                });
            });
        });

        context ("get by ID when ID valid", function () {
            it ("Should return same thing as put in", function () {
                var challenge = fakeChallengeFactory.create();
                var challengeID;
                return challengeStore.create (challenge)
                .then (function (id) {
                    challengeID = id;
                    return challengeStore.read(id);
                }).then (function (c) {
                    chai.expect(c).to.not.be.null;
                    chai.expect(c.id).to.not.be.null;
                    chai.expect(c.id).to.be.equal (challengeID);
                    chai.expect(c.status).to.be.equal (challenge.status);
                    chai.expect(c.arena).to.be.equal (challenge.arena);
                    chai.expect(c.player_fighter).to.be.equal (challenge.player_fighter);
                    chai.expect(c.arena_fighter).to.be.equal (challenge.arena_fighter);
                    chai.expect(c.winner_prize).to.be.equal (challenge.winner_prize);
                });
            });
        });
    });

    describe("#getPending", function () {
        context ("No challenges for anyone", function () {
            it ("Should return an empty array", function () {
                var email = "fake@fakeperson.com";
                return challengeStore.getPending (email)
                .then (function (rows) {
                    chai.expect(rows).to.not.be.null;
                    chai.expect(rows).to.be.empty;
                });
            });
        });

        context ("No pending challenges, other challenges for this email", function () {
            it ("Should return empty array", function () {
                var challenge = fakeChallengeFactory.create();
                challenge.status = "declined";
                var email = challenge.player;
                return challengeStore.create(challenge)
                .then (function (id) {
                    return challengeStore.getPending (email)
                }).then (function (rows) {
                    chai.expect(rows).to.not.be.null;
                    chai.expect(rows).to.be.empty;
                });
            });
        });

        context ("No pending challenges for this player, pending challenges for other players", function () {
            it ("Should return empty array", function () {
                var challenge = fakeChallengeFactory.create();
                challenge.status = "pending";
                var email = "anotherperson@different.slav";
                return challengeStore.create(challenge)
                .then (function (id) {
                    return challengeStore.getPending (email)
                }).then (function (rows) {
                    chai.expect(rows).to.not.be.null;
                    chai.expect(rows).to.be.empty;
                });
            });
        });

        context ("1 pending challenge, no other challenges", function () {
            it ("Should return array of 1", function () {
                var challenge = fakeChallengeFactory.create();
                var email = challenge.player;
                return challengeStore.create(challenge)
                .then (function (id) {
                    return challengeStore.getPending (email)
                }).then (function (rows) {
                    chai.expect(rows).to.not.be.null;
                    chai.expect(rows).to.not.be.empty;
                    chai.expect(rows.length).to.be.equal(1);
                });
            });
        });
    });

    describe("#decline", function () {
        context("challenge doesn't exist", function () {
            it("Should return false", function () {
                return challengeStore.decline(1)
                .then(function (result) {
                    chai.expect(result).to.be.equal(false);
                });
            });
        });

        context("challenge exists", function () {
            it("Should return true and challenge should be declined in DB", function () {
                var challenge = fakeChallengeFactory.create();
                var challengeID;
                return challengeStore.create(challenge)
                .then(function (id) {
                    challengeID = id;
                    return challengeStore.decline(challengeID);
                }).then(function (result) {
                    chai.expect(result).to.be.equal(true);
                    return challengeStore.read (challengeID);
                }).then(function (c) {
                    chai.expect(c.status).to.be.equal("declined");
                });
            });
        });
    });

    describe ("#declineAll", function () {

        context("multiple challenges", function () {
            it ("Should update all challenges and return true for all", function () {
                var challenge = fakeChallengeFactory.create();
                var email = challenge.player;
                var challenges = [];
                return challengeStore.create(challenge)
                .then(function (id) {
                    challenges.push(id);
                    challenge = fakeChallengeFactory.create();
                    return challengeStore.create(challenge);
                }).then (function (id) {
                    challenges.push(id);
                    return challengeStore.declineAll(challenges);
                }).then(function (result) {
                    chai.expect(result.length).to.be.equal(2);
                    for (var i = 0; i < result.length; i++) {
                        chai.expect(result[i]).to.be.equal(true);
                    }
                    return challengeStore.getAll (email);
                }).then(function (challengeList) {
                    for (var i = 0; i < challengeList.length; i++) {
                        chai.expect(challengeList[i].status).to.be.equal("declined");
                    }
                });
            });
        });
    });

    describe ("#getExpired", function () {
        context("No challenges", function () {
            it ("Should return no challenges", function () {
                return challengeStore.getExpired (1)
                .then (function (challenges) {
                    chai.expect(challenges).to.be.empty;
                });
            });
        });

        context("No expired challenges", function () {
            it ("Should return no challenges", function () {
                var challenge = fakeChallengeFactory.create();
                challenge.timestep_scheduled = 2;
                return challengeStore.create (challenge)
                .then (function () {
                    return challengeStore.getExpired (2);
                }).then (function (challenges) {
                    chai.expect (challenges).to.be.empty;
                });
            });
        });

        context ("Single expired challenge", function () {
            it ("Should return the expired challenge", function () {
                var challenge = fakeChallengeFactory.create();
                challenge.timestep_scheduled = 1;
                var challengeID = null;
                return challengeStore.create(challenge)
                .then (function (id) {
                    challengeID = id;
                    return challengeStore.getExpired (2);
                }).then (function (challenges) {
                    chai.expect (challenges).to.not.be.empty;
                    chai.expect (challenges.length).to.be.equal(1);
                    chai.expect (challenges[0].id).to.be.equal(challengeID);
                });
            });
        });

        context ("Mix of expired and not expired", function () {
            it ("Should just return the expired challenge", function () {
                var challenge = fakeChallengeFactory.create();
                challenge.timestep_scheduled = 1;
                var expiredChallengeID = null;
                return challengeStore.create (challenge)
                .then (function (id) {
                    expiredChallengeID = id;
                    challenge = fakeChallengeFactory.create();
                    challenge.timestep_scheduled = 2;
                    return challengeStore.create(challenge);
                }).then (function () {
                    return challengeStore.getExpired (2);
                }).then (function (challenges) {
                    chai.expect (challenges).to.not.be.empty;
                    chai.expect (challenges.length).to.be.equal (1);
                    chai.expect (challenges[0].id).to.be.equal(expiredChallengeID);
                });
            });
        });
    });
});
