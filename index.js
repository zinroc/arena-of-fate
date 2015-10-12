var express = require("express"),
    bodyParser = require("body-parser"),
    gameState = require("./gameState.js"),
    staticRouter = require("./staticRouter.js"),
    challenges = require("./challenges.js"),
    crowd = require("./crowd.js"),
    database_setup = require("./database_setup.js"),
    timer = require("./timer.js");

var app = express();
app.use(bodyParser.json());
app.set("port", process.env.PORT || 8000);

app.use(express.static("public"));

database_setup.createTables().then(function () {
    timer.Timer();
});

/********************** Views *************************************/
var showLoginScreen = function (req, res) {
    res.sendFile(__dirname + "/views/login.html");
};

app.get("/", showLoginScreen);
app.get("/login", showLoginScreen);

app.get("/game", function (req, res) {
    res.sendFile(__dirname + "/views/arena.html");
});

// FIXME experimental
app.get("/fighter_manager", function (req, res) {
    res.sendFile(__dirname + "/views/fighter_manager.html");
});

app.get("/match", function (req, res) {
    res.sendFile(__dirname + "/views/fight_planner.html");
});

app.get("/partials/instructions", function (req, res) {
    res.sendFile(__dirname + "/views/partials/instructions.html");
});
/********************** Views *************************************/
/********************** Characters API ****************/
app.get("/api/characters", function (req, res) {
    if (req.query.email) {
        gameState.getCharacters(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/characters/plans", function (req, res) {
    if (req.query.fighter_id) {
        gameState.getPlans(req.query.fighter_id, res);
    } else {
        res.status(400).send("Fighter ID is required");
    }
});


app.get("/api/characters/slots", function (req, res) {
    if (req.query.fighter_id) {
        gameState.getSlots(req.query.fighter_id, res);
    } else {
        res.status(400).send("Fighter ID is required");
    }
});


app.get("/api/characters/techCond", function (req, res) {
    if (req.query.fighter_id) {
        gameState.getTechCond(req.query.fighter_id, res);
    } else {
        res.status(400).send("Fighter ID is required");
    }
});
/********************** Characters API ****************/
/******************** Fighters API ****************/
app.get("/api/fighters", function (req, res) {
    if (req.query.email) {
        gameState.getFighters(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/fighters/plans/updateTechSlot", function (req, res){
    
    if(req.body.email){
        gameState.updateTechSlot(req.body.email, req.body.slot, req.body.tech_id, req.body.stratExp_id, res);
    } else {
        res.status(400).send("Email is required");
    }

});

app.get("/api/fighters/:fighterID", function (req, res) {
    if (req.query.email) {
        gameState.getFighter(req.query.email, req.params.fighterID, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/fighters/new", function (req, res) {
    if (req.body.email) {
        gameState.createFighters(req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/fighters/update", function (req, res) {
    if (req.body.email && req.body.fighter) {
        arena.updateFighter(req.body.email, req.body.fighter, res);
    } else {
        res.status(400).send("Email and fighter are required");
    }
});

app.delete("/api/fighters/:fighterID", function (req, res) {
    arena.deleteFighter(req.params.fighterID, res);
});
/********************** Fighters API ****************/

/********************** staticRouter API **************/
app.get("/api/strategies", function (req, res) {
    staticRouter.getStrategies(req, res);
});

app.get("/api/traits", function (req, res) {
    staticRouter.getTraits(req, res);
});

app.get("/api/skills", function (req, res){
    staticRouter.getSkills(req, res);
});

app.get("/api/techniques", function (req, res){
    staticRouter.getTechniques(req, res);
});

/********************** staticRouter API **************/
/********************** Arenas API **************/
app.post("/api/arenas/acceptReward", function (req, res){
    if (req.body.email){
        challenges.acceptReward(req.body.email, req.body.reward_id, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/arenas/getAll", function (req, res){
    staticRouter.getArenas(req, res);
});

app.get("/api/arenas/getRecords", function (req, res){
    if (req.query.email){
        challenges.getRecords(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/arenas/getRecordRewards", function (req, res){
    if (req.query.email){
        challenges.getRecordRewards(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});
/********************** Arenas API **************/
/******************** Challenge API *****************/
app.get("/api/challenges", function (req, res) {
    if (req.query.email) {
        challenges.getPending(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/challenges/arena/:arenaID", function (req, res) {
    if (req.query.email) {
        challenges.getArena(req.query.email, req.params.arenaID, res);
    } else {
        res.status(400).send("Email is required");
    }

});

app.get("/api/challenges/:challengeID", function (req, res) {
    if (req.query.email) {
        challenges.getChallenge(req.query.email, req.params.challengeID, res);
    } else {
        res.status(400).send("Email is required");
    }
});
app.post("/api/challenges/new", function (req, res) {
    if (req.body.email) {
        challenges.create(req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});
app.post("/api/challenges/:challengeID/accept", function (req, res) {
    if (req.body.email && req.body.fighter) {
        challenges.accept(req.params.challengeID, req.body.email, req.body.fighter, res);
    } else {
        res.status(400).send("Email and fighter are required");
    }
});
app.post("/api/challenges/:challengeID/decline", function (req, res) {
    if (req.body.email) {
        challenges.decline(req.params.challengeID, req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});
/******************** Challenge API *****************/

/******************** Matches API *****************/
app.get("/api/matches", function (req, res) {
    if (req.query.email) {
        challenges.getAccepted(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});
app.post("/api/matches/:matchID/record", function (req, res) {
    if (req.body.email){
        challenges.record(req.params.matchID, req.body.email, req.body.winner_id, req.body.loser_id, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/matches/:matchID/fight_records", function (req, res) {
    if (req.body.email){
        challenges.fight_record(req.params.matchID, req.body.email, req.body.attendance, req.body.gate, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/matches/:matchID/recordStrat", function (req, res){
    if (req.body.email){
        challenges.recordStrat(req.params.matchID, req.body.email, req.body.fight_round, req.body.strat_id, res);
    } else {
        res.status(400).send("Email is required");
    }
});
/******************** Matches API *****************/

/******************** Crowd API ***********************/
app.get("/api/crowd", function (req, res) {
    crowd.get(res);
});

app.post("/api/crowd/create", function (req, res) {
    crowd.create(res);
});
/******************** Crowd API ***********************/

/********************** Player API ********************/
app.get("/api/player", function (req, res) {
    if (req.query.email && req.query.name) {
        gameState.getPlayerState(req.query.email, req.query.name, res);
    } else {
        res.status(400).send("name and email are required");
    }
});
/********************** Player API *******************/

/********************** Game State API ****************/
app.get("/api/gameState", function (req, res) {
    gameState.getGameState(res);
});

app.get("/api/rankings", function (req, res) {
    gameState.getRankings(res);
});

app.post("/api/gameState/advanceTimestep", function (req, res) {
    if (req.body.timestep) {
        gameState.advanceTimestep (req.body.timestep, res);
    } else {
        res.status(400).send("Timestep is required");
    }
});

app.post("/api/reset", function (req, res) {
    if (req.body.email) {
        gameState.resetGameState(req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});
/********************** Game State API ****************/

/********************* API v2 *************************/
var model = require("./my_node_modules/model.js")();
var Promise = Promise || require("bluebird");

app.get("/api/v2/players", function (req, res) {
    if (req.query.email) {
        // specific player
        model.Players.where("email", req.query.email).fetch()
        .then(function (player) {
            res.json(player);
        });
    } else {
        // all players
        model.Players.fetchAll().then(function (players) {
            res.json(players);
        });
    }
});

app.get("/api/v2/fighters", function (req, res) {
    if (req.query.email) {
        model.Fighter.where("email", req.query.email).fetchAll()
        .then(function (fighters) {
            res.json(fighters);
        });
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/v2/fighters/:fighterID", function (req, res) {
    if (req.params.fighterID) {
        model.Fighter.where("id", req.params.fighterID).fetch()
        .then(function (fighter) {
            return fighter.getTrait();
        })
        .then(function (fighter) {
            res.json(fighter);
        });
    } else {
        res.status(400).send("Fighter ID is required");
    }
});

app.get("/api/v2/challenges/", function (req, res) {
    if (req.query.email) {
        var data = {
            player: req.query.email
        };
        if (req.query.status) {
            data.status = req.query.status;
        }
        model.Challenge.where(data).fetchAll()
        .then(function (challenges) {
            var promises = [];
            for (var i = 0; i < challenges.length; i++) {
                promises[i] = challenges.at(i).getArena();
            }
            return Promise.all(promises);
        })
        .then(function (challenges) {
            res.json(challenges);
        });
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/v2/game_state", function (req, res) {
    model.GameState.where("id", 1).fetch()
    .then(function (state) {
        res.json(state);
    });
});
/********************* API v2 *************************/


app.listen(app.get("port"), function () {
    console.log("Server running on port " + app.get("port"));
});
