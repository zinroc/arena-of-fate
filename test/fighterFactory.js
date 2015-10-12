"use strict";

var chai = require("chai");
var fighterFactory = require("../my_node_modules/fighterFactory.js");

describe("fighterFactory", function () {
    describe("#create", function () {
        it("should produce fighter object with name", function () {
            var fighter = fighterFactory.create();
            chai.expect(fighter.name).not.to.be.null;
        });

        it("should produce fighter object with fame", function () {
            var fighter = fighterFactory.create();
            chai.expect(fighter.fame).not.to.be.null;
        });

        it("should produce fighter object with skill", function () {
            var fighter = fighterFactory.create();
            chai.expect(fighter.skill).not.to.be.null;
        });

        it("should produce fighter object with no wins", function () {
            var fighter = fighterFactory.create();
            chai.expect(fighter.num_wins).to.be.equal(0);
        });

        it("should produce fighter object with no losses", function () {
            var fighter = fighterFactory.create();
            chai.expect(fighter.num_losses).to.be.equal(0);
        });
    });
});
