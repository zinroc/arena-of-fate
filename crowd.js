var credentials = require("./credentials.js"),
    crowdFactory = require("./my_node_modules/crowdFactory.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var crowdStore = require("./my_node_modules/crowdStore.js")(knex),
    arenaStore = require("./my_node_modules/arenaStore.js")(knex);

module.exports = {
    /**
        * Create all the crowd for each arena
        */
    create: function (res) {
        arenaStore.getArenas()
        .then(function (arenas) {
            return arenas;
        })
        .then(function (arenas) {
            var crowd = [], arenaCrowd;
            for (var i = 0; i < arenas.length; i++) {
                    arenaCrowd = crowdFactory.generateCrowd (arenas[i]);
                    arenaCrowd.forEach (function (item) {
                        crowd.push(item);
                    });
            }
            return crowd;
        })
        .then(function (crowdArray) {
            return crowdStore.createMany(crowdArray).then(function (idArray) {
                return idArray;
            });
        }).then(function (idArray) {
            res.send("ok");
        });
    },
    get: function (res) {
        crowdStore.readAll().then(function (crowdArray) {
            res.json(crowdArray);
        });
    }
};
