var app = angular.module("ArenaApp");

app.controller("ArenaCtrl", function arenaCtrl ($scope, arenaService, $timeout) {
    "use strict";
    /**** these show whether resources have been loaded or not */
    $scope.matchesLoaded = false;
    $scope.challengesLoaded = false;

    /*** game state ******/
    $scope.challenges = [];
    $scope.email = utils.getCookie("email");
    $scope.player_name = utils.getCookie("name");
    $scope.player_id = null; // filled in later
    $scope.timestep = null;
    $scope.num_fights = 0;
    $scope.money = 5000;
    $scope.matches = [];
    $scope.arenaRewardsLoaded = false;
    $scope.loadedArenas = false;
    /**
     * These are just the player's fighters
     */
    $scope.fighters = [];
    /**
     * BOTS
     */
    $scope.arena_fighters = [];

    $scope.rankings = []; // sorted from best down
    $scope.challengeError = null;

    /**
    *   Monitor the globalgamestate to know when it changes
    */
    $scope.monitorGameState = function (){
        arenaService.getGameState()
        .then(function (response) {
            console.log("Got game state:");
            console.log(response.data);
            if ($scope.timestep === response.data.timestep){
                //do nothing, gameState hasn't changed
            } else {

                $scope.timestep = response.data.timestep;

                // and refetch matches and challenges
                $scope.loadChallenges();
                $scope.loadMatches();
                // refresh fighter W/L
                $scope.loadFighters();
                $scope.loadArenaRecords();
                $scope.loadRecordRewards();

                $scope.selectedChallenge = null;
            }
        });

        $timeout(function(){
            $scope.monitorGameState();
        }, 2000);
    };


    /**
     * Has complexity O(n)
     */
    $scope.getArenaFighterById = function (id) {
        for (var i = 0; i < $scope.arena_fighters.length; i++) {
            if ($scope.arena_fighters[i].id === id) {
                return $scope.arena_fighters[i];
            }
        }
        return null;
    };

    /*
    *   checks if the fighter is currently in an accepted challenge
    *   need to lock fighter_manager + other fight parameters so player can't get diff results on replays
    *   return true if locked, false if free
    */
    $scope.lockedInChallenge = function (fighter_id){
        for (var i=0; i<$scope.matches.length; i++){
            var match = $scope.matches[i];
            //console.log(match, match.player_fighter, match.status, fighter_id);
            if(fighter_id === match.player_fighter && match.status==='accepted'){
                return true;
            }
        }
        return false;
    };

    /**
    *   Redirects to fighter_manager with a certial fighter_id
    */
    $scope.redirectToFighterManager = function (id){
        console.log($scope.selectedFighter, $scope.selectedFighter.id);
        if (!$scope.lockedInChallenge(id)) {
           window.location.href = "/fighter_manager?fighter_id=" + id;
        } 
    };
    $scope.activateClassTooltip = function (tag){

        console.log(tag);
        var tagName = "."+tag;

        $(tagName).tooltip('show');
        return 1;
    };

    $scope.deactivateClassTooltip = function (tag){
        var tagName = "."+tag;

        $(tagName).tooltip('hide');
        return 1;
    };
    /**
     * Has complexity O(n)
     */
    $scope.getFighterById = function (id) {
        for (var i = 0; i < $scope.fighters.length; i++) {
            if ($scope.fighters[i].id === id) {
                return $scope.fighters[i];
            }
        }
        return null;
    };
    /**
    *   Has complexity 0(n)
    */
    $scope.getArenaById = function (id){
        for (var i = 0; i < $scope.arenas.length; i++) {
            if ($scope.arenas[i].id === id) {
                return $scope.arenas[i];
            }
        }
        return null;
    };
    /****************************** Records / Awards ******************************/
    $scope.loadArenaRecords = function (){
        arenaService.getArenaRecords($scope.email).then(function (response){
            console.log("Got Arena Records!");
            console.log(response.data);

            $scope.arenaRecords = response.data;
        });
    };

    $scope.loadRecordRewards = function (){
        arenaService.getRecordRewards($scope.email).then(function (response){
            console.log("Got Arena Rewards!");
            console.log(response.data);

            $scope.arenaRewardsLoaded = true;
            $scope.arenaRewards = response.data;
        });
    };

    /**
    *   reward.id is the id from record_holders
    */
    $scope.acceptReward = function (reward){
        arenaService.acceptReward($scope.email, reward.id).then(function (response){
            console.log("Accepted Arena Reward!");
            console.log(response.data);
            $scope.loadRecordRewards();
        });
    };

    $scope.getNumPendingRecords = function (){
        var count = 0;
        for (var i=0; i<$scope.fighters.length; i++){
            var fighter = $scope.fighters[i];
            if (!$scope.arenaRewards[fighter.id]){
                continue;
            } else {
                for (var j=0; j<$scope.arenaRewards[fighter.id].length; j++){
                    if ($scope.arenaRewards[fighter.id][j].status==='offered' && 
                        $scope.arenaRewards[fighter.id][j].timestep < $scope.timestep){
                        count++;
                    }
                }
            }
        }
        return count;
    };


    /****************************** Records / Awards ******************************/
    /****************************** Matches ******************************/
    $scope.loadMatches = function () {
        console.log("Fetching matches from server...");
        arenaService.getMatches($scope.email).then(function (response) {
            console.log("Got matches:");
            console.log(response.data);

            $scope.matchesLoaded = true;
            $scope.matches = response.data;

            $scope.matches.map(function (match) {
                var fighter = $scope.getArenaFighterById(match.arena_fighter);
                if (fighter === null) {
                    $scope.loadFighterInfo(match.arena_fighter);
                }
            });
        });
    };
    /****************************** Matches ******************************/

    /**
     * Request information about fighter from API
     */
    $scope.loadFighterInfo = function (fighter_id) {
        console.log("Getting info about fighter with ID " + fighter_id);
        arenaService.getFighter($scope.email, fighter_id)
        .then(function (response) {
            var fighter = response.data;
            console.log("Got fighter info: " + fighter);
            var oldFighter = $scope.getArenaFighterById(fighter.id);
            if (oldFighter) {
                var i = $scope.arena_fighters.indexOf(oldFighter);
                $scope.arena_fighters.splice(i, 1, fighter);
            } else {
                $scope.arena_fighters.push(fighter);
            }
        });
    };

    $scope.requestNewFighters = function () {
        console.log("Requesting new fighter batch");
        arenaService.requestNewFighters($scope.email)
        .then(function (response) {
            $scope.fighters = response.data;
            console.log(response.data);
        });
    };

    $scope.loadRankings = function () {
        console.log("Fetching rankings from server...");
        arenaService.getRankings()
        .then (function (response) {
            console.log("Got rankings:");
            console.log(response.data);
            $scope.rankings = response.data;
        });
    };

    /**
     * Load game state from backing store
     */
    $scope.loadGameState = function () {
        arenaService.getPlayer($scope.email, $scope.player_name)
        .then(function (response) {
            console.log("Got player state:");
            console.log(response.data);
            $scope.money = response.data.money;
            $scope.num_fights = response.data.num_fights;
            $scope.player_id = response.data.id;
        });

        arenaService.getGameState()
        .then(function (response) {
            console.log("Got game state:");
            console.log(response.data);
            $scope.timestep = response.data.timestep;
        });

        $scope.loadRankings();
    };

    $scope.loadFighters = function () {
        console.log("Fetching fighters from server...");
        arenaService.getFighters($scope.email)
        .then(function (response) {
            console.log("Got fighters:");
            console.log(response.data);
            $scope.fighters = response.data;
            if ($scope.fighters.length === 0) {
                return $scope.requestNewFighters();
            }
        });
    };

    $scope.loadArenas = function (){
        console.log("Fetching areans from server...");
        arenaService.getArenas($scope.email)
        .then(function (response){
            console.log("Got arenas");
            console.log(response.data);
            $scope.arenas = response.data;
            $scope.loadedArenas = true;
        });
    };

    $scope.requestChallenge = function () {
        //console.log("Requesting new challenges from server...");
        //arenaService.requestNewChallenge($scope.email)
        //.then(function (response) {
            //console.log(response.data);
            //$scope.loadChallenges();
        //});
    };

    $scope.minChallengesAndMatches = 3;

    $scope.loadChallenges = function () {
        console.log("Fetching challenges from server...");
        arenaService.getChallenges($scope.email)
        .then(function (response) {
            console.log("Got challenges:");
            console.log(response.data);
            $scope.challenges = response.data;
            $scope.challengesLoaded = true;

            if ($scope.challenges.length === 0 && $scope.matches.length === 0 &&
                    $scope.matchesLoaded && $scope.challengesLoaded) {
                $scope.requestChallenge();
            } else {
                for (var i = 0; i < $scope.challenges.length; i++) {
                    $scope.challenges[i].fighter = null;
                }
            }
        });
    };

    /****************************** Crowd stuff **************************/
    /**
     * This should not live on the client-side
     */
    $scope.loadCrowd = function () {
        console.log("Fetching crowd from server...");
        arenaService.getCrowd()
        .then(function (crowdArray) {
            console.log("Got crowd:");
            console.log(crowdArray.data);
            if (crowdArray.data.length === 0) {
                $scope.generateCrowd();
            }
        });
    };

    /**
     * This should not live on the client-side
     */
    $scope.generateCrowd = function () {
        arenaService.createCrowd()
        .then(function () {
            console.log("Crowd created");
            $scope.loadCrowd();
        });
    };
    /****************************** Crowd stuff **************************/

    $scope.init = function () {
        if (!$scope.email) {
            // not logged in
            window.location.href = "/login";
        }

        $scope.loadFighters();
        $scope.loadMatches();
        $scope.loadChallenges();
        $scope.loadGameState();
        $scope.loadCrowd();
        $scope.loadArenas();
        $scope.loadArenaRecords();
        $scope.loadRecordRewards();
        $scope.monitorGameState();
    };

    $scope.init();

    /********************************** Challenge stuff **********************/
    $scope.selectedFighter = null;

    /**
     * Triggered when clicking on a fighter.
     * If fighter is selected, deselect it.
     * If fighter is not selected, select it.
     * In any case, reset challenge error
     */
    $scope.toggleSelectFighter = function (fighter) {
        $scope.challengeError = null;
        if ($scope.selectedFighter === fighter) {
            $scope.releaseSelectFighter();
        } else {
            $scope.selectedFighter = fighter;
        }
    };

    $scope.releaseSelectFighter = function () {
        $scope.selectedFighter = null;
    };

    $scope.addSelectFighterToChallenge = function (challenge) {
        if (! $scope.selectedFighter) {
            return;
        }
        challenge.fighter = $scope.selectedFighter;
        $scope.releaseSelectFighter();
    };

    $scope.canAcceptChallenge = function (challenge) {
        return challenge.fighter && $scope.money >= challenge.entry_fee;
    };

    $scope.declineChallenge = function (challenge) {
        console.log("Declining challenge with ID " + challenge.id);
        $scope.challengeError = null;
        arenaService.declineChallenge(challenge.id, $scope.email)
        .then(function (response) {
            // re-fetch challenges
            $scope.loadChallenges();
        }, function (response) {
            $scope.challengeError = response.data;
        });
    };

    $scope.acceptChallenge = function (challenge) {
        challenge.fighter = $scope.selectedFighter;

        if (!$scope.canAcceptChallenge(challenge)) {
            console.log("Cannot accept challenge");
            return;
        }
        $scope.challengeError = null;
        console.log("Accepting challenge with ID " + challenge.id);
        arenaService.acceptChallenge(challenge.id, $scope.email, challenge.fighter.id)
        .then(function (response) {
            console.log("Successfully accepted challenge");
            console.log(response.data);
            // remove challenge from list of challenges
            var idx = $scope.challenges.indexOf(challenge);
            console.log("Removing challenge " + idx);
            $scope.challenges.splice(idx, 1);
            // re-fetch matches
            $scope.loadMatches();
            // money changed
            $scope.loadGameState();

            // go to fighter view
            $scope.goToMatch(challenge);
        }, function (response) {
            console.log("Failed to accept challenge");
            console.log(response);
            $scope.challengeError = response.data;
        });
    };

    $scope.resetChallengeFighter = function (challenge) {
        challenge.fighter = null;
        $scope.challengeError = null;
    };
    /****************************** Challenge stuff **********************/

    /**
     * Reset the game, then reload page
     */
    $scope.resetGame = function () {
        arenaService.resetGame()
        .then(function (response) {
            window.location.reload();
        });
    };

    $scope.advanceTimestep = function () {
        arenaService.advanceTimestep($scope.timestep)
        .then(function (response) {
            console.log("Successfully advanced to next timestep!");
            console.log(response.data);
            if (response.data.timestep != $scope.timestep) {
                $scope.timestep = response.data.timestep;

                // and refetch matches and challenges
                $scope.loadChallenges();
                $scope.loadMatches();
                // refresh fighter W/L
                $scope.loadFighters();
                $scope.loadArenaRecords();
                $scope.loadRecordRewards();
            }
        });
    };


    /********************** Match calendar ***********************************/
    $scope.selectedChallenge = null;

    $scope.selectMatch = function (match) {
        $scope.selectedChallenge = match;
        match.fighter_name = match.arena_fighter_name;
    };

    $scope.deselectChallenge = function () {
        $scope.selectedChallenge = null;
    };

    $scope.goToMatch = function (challenge) {
        window.location.href = "/match?match_id=" + challenge.id;
    };
    /********************** Match calendar ***********************************/

    /***************************** Visuals *******************************/
    $scope.getNumStars = function (fame) {
        return (fame / 200) - 3;
    };

    $scope.getStars = function (fame) {
        var stars = [];
        for (var i = 0; i < $scope.getNumStars(fame); i++) {
            stars.push(i);
        }
        return stars;
    };

    $scope.getAssetImg = function (art) {
        return "/img/" + art + ".png";
    };
    /***************************** Visuals *******************************/

    $scope.selectChallenge = function (challenge) {
        $scope.selectedChallenge = challenge;
        // close pending challenges modal
        $("#pending-challenges-modal").find("button.close").click();
    };

    // initialize bootstrap stuff
    $('[data-toggle="tooltip"]').tooltip();
});
