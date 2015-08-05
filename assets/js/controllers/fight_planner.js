angular.module('App.controllers').controller('fightPlannerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

    $scope.fighters = null;
    $scope.fighterSkills = {};
    $scope.selectedFighter = null;
    $scope.strats = null;

    $scope.sides = [];
    $scope.sides[0] = 'red';
    $scope.sides[1] = 'blue';

    $scope.corner = {};
    $scope.corner.red = {};
    $scope.corner.red.name = 'empty';

    $scope.corner.blue = {};
    $scope.corner.blue.name = 'empty';

    $scope.show = {};
    $scope.show.red = {};
    $scope.show.blue = {};

    $scope.strat = {};
    $scope.strat.red = {};
    $scope.cStratBonuses = {};
    $scope.cStratBonuses.red = [];
    $scope.cSkills = {};
    $scope.cSkills.red = {};


    $scope.strat.blue = {};
    $scope.cStratBonuses.blue = [];
    $scope.cSkills.blue = {};

    //fight parameters
    $scope.fight = {};
    $scope.fight.started = false;
    $scope.distance = null;
    $scope.fightClock = null;
    $scope.fightClockMax = 60;
    $scope.initiator = null;
    $scope.defender = null;
    $scope.victor = {};
    $scope.victor.side = null;
    $scope.fight.stopped = false;
    $scope.fight.round = null;
    $scope.fight.paused = null;

    $scope.winningRounds = {};

    $scope.roundWinner = null;

    $scope.fumble = {};
    $scope.predict = {};
    //animation -> defender/initiatior , dodged, blocked, fumble, predict
    $scope.modifiers = ['gassed', 'pinned', 'dazed', 'quit', 'unconscious'];
    $scope.injuries = {};
    $scope.injuries.lv1 = ['bloody nose', 'bloodied vision', 'bruised leg', 'bruised torso', 'sprained finger', 'sprained ankle'];
    $scope.injuries.lv2 = ['broken nose', 'broken orbital', 'fractured leg', 'fractured rib', 'broken hand', 'broken ankle'];
    $scope.injuries.lv3 = ['missing nose', 'mask of blood', 'leg puncturing out', 'punctured organ', 'finger puncturing out', 'ankle ripped open'];
    $scope.injuries.lv4 = ['death', 'death', 'death', 'death', 'death', 'death'];

    $scope.injuryLocations = ['nose', 'eyes', 'legs', 'body', 'hands', 'feet'];

    //vitals
    $scope.vitals = {};
    $scope.vitals.red = {};
    $scope.vitals.blue = {};

    $scope.transcript = [];
    $scope.transIndex = 0;

    $scope.experience = {};

    $scope.fightBars = ['consciousness', 'cardio', 'bloodied'];
    $scope.roundBars = ['initiation', 'positioning'];

    $scope.barValue = {};


    gameAPIservice.getFighters().success(function (response){
        "use strict";
        console.log("Tried to fetch fighters");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.fighters = false;
            $scope.fighterSkills = false;
        } else {
            $scope.fighters = response.fighters;
            $scope.fighterSkills = response.fighterSkills;
            $scope.fightersExperience = response.fightersExperience;
        }
        $scope.loaded = true;

    });

    gameAPIservice.getStrategies().success(function (response){
        "use strict";
        console.log("Tried to fetch strategies");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.strats = false;
        } else {
            $scope.strats = response.strats;
            $scope.stratBonuses = response.stratBonuses;
        }
    });

    gameAPIservice.getSkills().success(function (response){
        "use strict";
        console.log("Tried to fetch skills");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.skills = false;
        } else {
            $scope.skills = response.skills;
            $scope.skillIDs = response.skillIDs;
        }
    });


    /**
    * Figure out if a side is initiator/ defender/ prediting/fumbling
    * var side STRING ==='red' or blue 
    * var modiier STRING from $scope.modifiers
    * return true or false
    **/
    $scope.getModifierValue = function (side, modifier){
        if(modifier==='initiator'){
            if($scope.initiator ===side){
                return true;
            }
        } else if (modifier==='defender'){
            if($scope.defender ===side){
                return true;
            }
        } else if (modifier ==='fumble'){
            return $scope.fumble[side];
        } else if (modifier === 'predict'){
            return $scope.predict[side];
        } else {
            return $scope.corner[side][modifier];
        }
    };

    /**
    *   bar from $scope.fightBars or scope.roundBars
    *   return INT
    */
    $scope.getBarValue = function (bar, side){

        if(bar==='initiation'){
            return $scope.corner[side].initiationScore;
        } else if (bar==='consciousness'){
            return $scope.vitals[side].consciousness;
        } else if (bar==='positioning'){
            return $scope.vitals[side].positioning;
        } else if (bar==='cardio'){
            return $scope.vitals[side].cardio;
        } else if (bar==='bloodied'){
            return $scope.vitals[side].bloodied;
        }
    };
    /**
    *   bar from $scope.fightBars or scope.roundBars
    *   return INT 0-100
    */
    $scope.getBarPercent = function (bar, side){
        var val = $scope.getBarValue(bar, side);

        if(bar==='initiation'){
            return parseInt(val);
        } else if (bar==='consciousness'){
            return parseInt(val);
        } else if (bar==='positioning'){
            return parseInt((val/30)*100);
        } else if (bar==='cardio'){
            return parseInt(val/10);
        } else if (bar==='bloodied'){
            return parseInt(val/4);
        }
    };
    /**
    *   bar from $scope.fightBars or scope.roundBars
    *   return STRING
    */
    $scope.getBarColor = function (bar, side){
        var value = $scope.getBarPercent(bar, side);
        if (value < 20 && bar==='consciousness'){
            return 'progress-bar-danger';
        } else if(value > 80 && bar==='consciousness') {
            return 'progress-bar-success';
        } else if (bar==='consciousness'){
            return 'progress-bar-warning';
        } else if (bar==='bloodied'){
            return 'progress-bar-danger';
        } else {
            return 'progress-bar-info';
        }
    };

    /**
    *   triggered by starting a fight
    */
    $scope.evaluateFight = function (){

        $scope.initializeFight();

        $scope.fightLoop();
    };


    //return INT
    $scope.getpositioningSkill = function(side){
        var skill = 0;
        if($scope.distance < 33){
            skill = $scope.getSkill(side, 'grappling');
        } else if ($scope.distance < 66){
            skill = $scope.getSkill(side, 'pocket');
        } else if ($scope.distance < 101){
            skill = $scope.getSkill(side, 'striking');
        }

        return parseInt(skill);
    };

    //regenerate positioning algorithm
    $scope.fightpositioning = function(side){
        var otherSide = $scope.otherSide(side);

        var skill = $scope.getpositioningSkill(side);
        var opposingSkill = $scope.getpositioningSkill(otherSide);

        var regen = parseInt(Math.random()*skill - Math.random()*opposingSkill);

        if (regen > 0){
            regen = Math.min(30-$scope.vitals[side].positioning ,(regen/100)*30);
        } else {
            regen = 0;
        }

        return parseInt(regen);
    };

    // stat regeneration within a round
    $scope.regen = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.vitals[$scope.sides[i]].positioning += $scope.fightpositioning($scope.sides[i]);
        }
    };

    $scope.setBarValues = function (){
        for (var i=0; i<$scope.fightBars.length; i++){
            if (typeof($scope.barValue[$scope.fightBars[i]])==='undefined'){
                $scope.barValue[$scope.fightBars[i]] = {};
            }
            for (var j=0; j<$scope.sides.length; j++){
                $scope.barValue[$scope.fightBars[i]][$scope.sides[i]] = $scope.getBarValue($scope.fightBars[i], $scope.sides[j]);
            }
        }
        return;
    };

    // main loop for the fight
    $scope.fightLoop = function (){

        if(!$scope.fight.stopped && !$scope.fight.paused){

            $scope.resetTempCombatMods();
            $scope.movement();
            $scope.initiation();
            if ($scope.initiator){
                $scope.resolveInitiation();
            }
            $scope.checkVictory();
            if(!$scope.fight.stopped){
                $scope.regen();
            }

            if($scope.fight.paused && !$scope.fight.stopped){

                for (var i=0; i<$scope.sides.length; i++){
                    $scope.roundRegen($scope.sides[i]);
                }
            }

            $scope.setBarValues();

            $scope.fightClock++;
            $timeout(function(){$scope.fightLoop();}, 600);
        }
    };

    //find the distance a fighter wants to move
    $scope.getMovement = function (side){
        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var nextMovement = (optimalDistance - $scope.distance)/2;
        return nextMovement;

    };

    // fighter movement within a round
    $scope.movement = function (){
        for (var i=0; i<$scope.sides.length; i++){

            if(!$scope.corner[$scope.sides[i]].pinned) {
                $scope.corner[$scope.sides[i]].nextMovement = $scope.getMovement($scope.sides[i]);
            }
        }

        for (i=0; i<$scope.sides.length; i++){
            $scope.distance += $scope.corner[$scope.sides[i]].nextMovement;
        }


    };

    // non-fight parameters that are set when a new round is started
    $scope.initializeRound = function (){
        $scope.distance = 100;
        for(var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].status = 'art';
        }
    };

    // fight parameters set when a  new fight is started
    $scope.initializeFight = function (){

        $scope.fight.started = true;
        $scope.fight.stopped = false;
        $scope.fightClock = 0;
        $scope.fight.round = 1;
        $scope.fight.paused = false;
        $scope.roundWinner = [];
        $scope.distance = 100;


        console.log("initializing fight");

        $scope.initializeRound();

        for (var i=0; i<$scope.sides.length; i++){

            $scope.vitals[$scope.sides[i]].consciousness = 100;
            $scope.vitals[$scope.sides[i]].positioning = 30;
            $scope.vitals[$scope.sides[i]].bloodied = 0;

            var maxCardio = 100 + $scope.getSkill($scope.sides[i], 'endurance')*10;

            $scope.vitals[$scope.sides[i]].cardio = maxCardio;

            $scope.corner[$scope.sides[i]].initiationScore = 0; // distance / GPfreq

            $scope.corner[$scope.sides[i]].gassed = false; //cardio
            $scope.corner[$scope.sides[i]].pinned = false; // positioning
            $scope.corner[$scope.sides[i]].dazed = false;
            $scope.corner[$scope.sides[i]].quit = false;
            $scope.corner[$scope.sides[i]].unconscious = false;

            $scope.corner[$scope.sides[i]].dodged = false; //evasion vs accuracy
            $scope.corner[$scope.sides[i]].blocked = false; // reflex vs speed

            //body parts
            $scope.corner[$scope.sides[i]].nose = null;
            $scope.corner[$scope.sides[i]].eyes = null;
            $scope.corner[$scope.sides[i]].body = null;
            $scope.corner[$scope.sides[i]].legs = null;
            $scope.corner[$scope.sides[i]].feet = null;
            $scope.corner[$scope.sides[i]].hands = null;

            $scope.fumble[$scope.sides[i]] = false; // adds to vulnerability
            $scope.predict[$scope.sides[i]] = false; // adds to vulnerability, reflex, accuracy

            $scope.corner[$scope.sides[i]].nextMovement = 0;

            $scope.winningRounds[$scope.sides[i]] = 0;
        }

        $scope.setBarValues();
    };

    //determine how much closer a fighter is to initiating this cycle in fightLoop
    $scope.initIncrease = function (side){

        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var range = Math.abs(optimalDistance - $scope.distance);
        var rangeMod = (100-range)/(100);


        return parseInt(rangeMod*$scope.heightConversion($scope.strat[side].initiation_frequency));
    };

    //determine how much cardio fighter pays this cycle in fightLoop
    $scope.idleCardioPayment = function(side){
        return parseInt($scope.heightConversion($scope.strat[side].base_cardio)/2);
    };

    //set all status flags based on vitals
    $scope.updateStatuses = function(side){
        var msg = "";

        if($scope.vitals[side].positioning < 0) {

            if(!$scope.corner[side].pinned){
                msg = $scope.corner[side].name.toTitleCase() + " is pinned.";
                $scope.record(msg);
            }
            $scope.corner[side].pinned = true;

        } else {
            if($scope.corner[side].pinned){
                msg = $scope.corner[side].name.toTitleCase() + " managed to get free";
                $scope.record(msg);
            }
            $scope.corner[side].pinned = false;
        }

        if($scope.vitals[side].cardio < 0) {
            $scope.corner[side].gassed = true;
        } else {
            $scope.corner[side].gassed = false;
        }

        if($scope.vitals[side].consciousness < 20){
            if (!$scope.corner[side].dazed){
                msg = $scope.corner[side].name.toTitleCase() + " is dazed!";
                $scope.record(msg);
            }
            $scope.corner[side].dazed = true;
        } else {
            $scope.corner[side].dazed = false;
        }



    };

    /**
    *   @param level INT 
    *   sets corner[side][bodypart];
    *   if level 1 - add new injury
    *   if level 2-4 upgrade existing injury 
    */
    $scope.addInjury = function(side, level){
        console.log(side, level);
        var levelIndex = "lv" + level;

        level = parseInt(level);
        var priorLevel = level-1;

        var msg = "";
        var priorLevelIndex = "lv" + priorLevel;

        var injury = null;
        var injuryLocation = null;
        var injuryIndex = null;
        // pick an injury
        if (level === 1){
            //console.log("adding injury");
            injuryIndex = Math.floor(Math.random()*($scope.injuries[levelIndex].length));
            injury = $scope.injuries[levelIndex][injuryIndex];
            injuryLocation = $scope.injuryLocations[injuryIndex];

            // apply the injury
            if(!$scope.corner[side][injuryLocation]){
                $scope.corner[side][injuryLocation] = injury;
                $scope.corner[side].injuryLv1 = true;
                msg = $scope.corner[side].name.toTitleCase() + " was injured with a " + $scope.corner[side][injuryLocation].toTitleCase();
                $scope.record(msg);
             //   console.log(msg);
            }

        } else {
            //console.log("upgradeing injury");
            //pick an injury to upgrade
            var j =0;
            var upgradeArray = [];
            for (var i=0; i<$scope.injuryLocations.length; i++){
                if ($scope.corner[side][$scope.injuryLocations[i]] === $scope.injuries[priorLevelIndex][i]){
                    upgradeArray[j] = i;
                    j++;
                    //console.log($scope.corner[side][$scope.injuryLocations[i]], $scope.injuries[priorLevelIndex][i]);
                }
            }
            //console.log(upgradeArray);

            if(j===0){
                //nothing to upgrade, add lower level injury
                //console.log("nothing to upgrade");
                level--;
                $scope.addInjury(side, level);
            } else {
                //pick a random injury to upgrade
                var upgradeIndex = Math.floor(Math.random()*j);
                $scope.corner[side][$scope.injuryLocations[upgradeArray[upgradeIndex]]] = $scope.injuries[levelIndex][upgradeArray[upgradeIndex]];
                msg = $scope.corner[side].name.toTitleCase() + " was injured with a " + $scope.corner[side][$scope.injuryLocations[upgradeArray[upgradeIndex]]];
                $scope.record(msg);
                //console.log(msg);

            }
            var cornerInjury = "injury" + levelIndex;
            $scope.corner[side][cornerInjury] = true;

        }


        return;
    };

    //set the color of close/medium/far range under fighter portrait within a round
    $scope.getRangeColor = function(side){
        var rangeVal = 0;
        if($scope.strat[side].range ==='close'){
            rangeVal = 17;
        } else if ($scope.strat[side].range ==='medium'){
            rangeVal = 50;
        } else if ($scope.strat[side].range ==='far'){
            rangeVal = 83;
        }
        if(Math.abs(rangeVal-$scope.distance) < 17){
            return 'green';
        } else if (Math.abs(rangeVal-$scope.distance) < 34) {
            return 'orange';
        } else {
            return 'red';
        }
    };

    // return STRING for distance under fight portrait within a round
    $scope.getRangeWord = function (){
        if($scope.distance < 33){
            return 'Close';
        } else if($scope.distance < 66) {
            return 'Medium';
        } else {
            return 'Long';
        }
    };

    //cardio regen while gassed
    $scope.stallForCardio = function (side){
        var base = $scope.getSkill(side, 'recovery');

        $scope.vitals[side].cardio += parseInt(Math.random()*base);
    };

    //set the defender / initiator
    // if there is no initiator, allow for consciousness regen if dazed
    $scope.initiation = function (){

        for (var i=0; i<$scope.sides.length; i++){

            $scope.updateStatuses($scope.sides[i]);


            if(!$scope.corner[$scope.sides[i]].gassed && !$scope.corner[$scope.sides[i]].pinned){
                $scope.corner[$scope.sides[i]].initiationScore += $scope.initIncrease($scope.sides[i]);
                $scope.vitals[$scope.sides[i]].cardio -= $scope.idleCardioPayment($scope.sides[i]);
            } else if($scope.corner[$scope.sides[i]].gassed) {
                $scope.stallForCardio($scope.sides[i]);
            } else {

            }
        }

        if($scope.corner['red'].initiationScore > 100 && $scope.corner['blue'].initiationScore > 100){
            if ($scope.corner['red'].initiationScore > $scope.corner['blue'].initiationScore){
                $scope.initiator = 'red';
                $scope.defender = 'blue';
            } else {
                $scope.initiator = 'blue';
                $scope.defender = 'red';
            }
        } else if ($scope.corner['red'].initiationScore > 100){
            $scope.initiator = 'red';
            $scope.defender = 'blue';
        } else if ($scope.corner['blue'].initiationScore > 100){
            $scope.initiator = 'blue';
            $scope.defender = 'red';
        } else {
            $scope.initiator = null;
            //recover from being dazed
            $scope.fightConsciousness();
        }

        if ($scope.initiator){
            var msg = $scope.corner[$scope.initiator].name + " initiates";
            $scope.record(msg);
        } else {
        }
        return;
    };

    //regen fight consciousness while dazed if no initiator
    $scope.fightConsciousness = function (){
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            if($scope.corner[side].dazed){
                var skill = $scope.getSkill(side, 'recovery');
                $scope.vitals[side].consciousness += parseInt((Math.random()*skill)/10);
            }
        }
    };


    $scope.getIndexOf = function(array, object, target){
        var result = false;
        for(var i=0; i<array.length; i++){
            if(array[i][object]===target){
                result = i;
            }
        }

        return result;
    };

    //apply strategy bonuses to base skills 
    // return INT
    $scope.getSkill = function (side, skill){
        var base  = parseInt($scope.cSkills[side][skill]);
        var index = $scope.getIndexOf($scope.cStratBonuses[side], 'name', skill);
        var bonusMod = 1;

        if ((index || index===0) && !$scope.corner[side].dazed){
            bonusMod = parseInt($scope.cStratBonuses[side][index].value);
            bonusMod = 1+(bonusMod/100);
        } else {
            bonusMod = 1;
        }

        return parseInt(bonusMod*base);
    };

    $scope.getPowerScore = function (side){
        var strength = $scope.getSkill(side, 'strength');
        var speed = $scope.getSkill(side, 'speed');

        var base = parseInt((strength + speed) / 2);

        return parseInt(base*Math.random());
    };

    $scope.getSpeedScore = function (side){
        var base = $scope.getSkill(side, 'speed');

        if (base<5){
            base=5;
        }

        return parseInt(base*Math.random());
    };

    $scope.getAccuracyScore = function (side){
        var base = $scope.getSkill(side, 'accuracy');

        if($scope.predict[side]){
            base += 50;
        }

        if($scope.corner[side].dazed){
            base -=70;
        }
        if(base < 5){
            base = 5;
        }

        return parseInt(base*Math.random());
    };

    $scope.getEvasionScore = function (side){
        var base = $scope.getSkill(side, 'evasion');
        if($scope.corner[side].gassed){
            base -= 90;
        }

        if(base < 5){
            base = 5;
        }
        return parseInt(base*Math.random());
    };

    $scope.getReflexScore = function (side){
        var base = $scope.getSkill(side, 'reflex');
        if($scope.corner[side].gassed){
            base -= 90;
        }
        if($scope.predict[side]){
            base +=50;
        }
        if ($scope.corner[side].dazed){
            base -=50;
        }

        if(base<5){
            base = 5;
        }

        return parseInt(base*Math.random());
    };

    $scope.initiationCardioPayment = function(side){
        return $scope.heightConversion($scope.strat[side].initiation_cardio);
    };

    //check if fighter has fumble or predict
    $scope.checkAdvantage = function (initiator, defender){

        var initiatorAs = $scope.fightersExperience[$scope.corner[initiator].id][$scope.strat[initiator].id].as;
        var initiatorAgainst = $scope.fightersExperience[$scope.corner[initiator].id][$scope.strat[initiator].id].against;
        var defenderAs = $scope.fightersExperience[$scope.corner[defender].id][$scope.strat[defender].id].as;
        var defenderAgainst = $scope.fightersExperience[$scope.corner[defender].id][$scope.strat[defender].id].against;

        var initiatorDifficulty = $scope.heightConversion($scope.strat[initiator].difficulty);
        var defenderDifficulty = $scope.heightConversion($scope.strat[defender].difficulty);


        var msg ="";
        if (initiatorDifficulty > initiatorAs) {
            $scope.fumble[initiator] = true;
            msg += $scope.corner[initiator].name.toTitleCase() + " fumbles. ";
        }

        if (defenderDifficulty > defenderAs) {
            $scope.fumble[defender] = true;
            msg += $scope.corner[defender].name.toTitleCase() + " fumbles. ";
        }

        if (initiatorAgainst - defenderDifficulty > defenderAs){
            $scope.predict[initiator] = true;
            msg += $scope.corner[initiator].name.toTitleCase() + " predicts " + $scope.corner[defender].name.toTitleCase() + "'s next movement.";
        }

        if (defenderAgainst - initiatorDifficulty > initiatorAs){
            $scope.predict[defender] = true;
            msg += $scope.corner[defender].name.toTitleCase() + " predicts " + $scope.corner[initiator].name.toTitleCase() + "'s next movement.";
        }
        $scope.record(msg);

    };

    //resolve all _Score competitions and deal damage
    $scope.resolveInitiation = function (){
        $scope.corner[$scope.initiator].initiationScore = 0;

        $scope.checkAdvantage($scope.initiator, $scope.defender);


        $scope.vitals[$scope.initiator].cardio -= $scope.initiationCardioPayment($scope.initiator);

        var powerScore = $scope.getPowerScore($scope.initiator);
        var speedScore = $scope.getSpeedScore($scope.initiator);
        var accuracyScore = $scope.getAccuracyScore($scope.initiator);
        var evasionScore = $scope.getEvasionScore($scope.defender);
        var reflexScore = $scope.getReflexScore($scope.defender);

        var msg = "";
        if($scope.corner[$scope.defender].gassed){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " looks gassed";
            $scope.record(msg);
        }

        if (accuracyScore < evasionScore){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " dodges attack";
            $scope.corner[$scope.defender].dodged = true;
            $scope.record(msg);

        }

        if (speedScore < reflexScore){
            msg = $scope.corner[$scope.defender].name + " manages to react";
            $scope.record(msg);
            $scope.corner[$scope.defender].blocked = true;

        }

        if ($scope.corner[$scope.defender].dodged && $scope.corner[$scope.defender].blocked){
            $scope.evaluateCounter($scope.defender, reflexScore, speedScore);
        } else if ($scope.corner[$scope.defender].dodged){
            $scope.evaluateDodge($scope.defender);
        } else if ($scope.corner[$scope.defender].blocked){
            $scope.evaluateBlock($scope.defender, reflexScore, speedScore, powerScore);
        } else {
            $scope.dealDamage($scope.defender, powerScore);
        }


        return;
    };

    //blocking reduces damage taken and may result in a counter
    $scope.evaluateBlock = function (blocker, reflex, speed, power){
        var windowSize = null;
        if(reflex - speed < 33){
            windowSize = 0.33;
        } else if (reflex - speed < 66) {
            windowSize = 0.66;
        } else {
            windowSize = 1;
        }
        var blockScore = parseInt($scope.getPowerScore(blocker)*windowSize);
        var msg = "";
        if (blockScore > power){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " fully blocks the attack";
            $scope.record(msg);
        } else {
            msg = $scope.corner[blocker].name.toTitleCase() + " blocks " + (power-blockScore) + " damage.";
            $scope.record(msg);
            $scope.dealDamage($scope.defender, power-blockScore);
        }

        $scope.evaluateCounter(blocker, reflex, speed);

    };
    //dodging negates all damage
    $scope.evaluateDodge = function (dodger){
        return;
    };
    //counter may happen after block
    $scope.evaluateCounter = function(counterer, reflex, speed){

        if(!$scope.corner[counterer].gassed){
            var windowSize = null;
            if(reflex - speed < 33){
                windowSize = 0.33;
            } else if (reflex - speed < 66) {
                windowSize = 0.66;
            } else {
                windowSize = 1;
            }

            var powerScore = $scope.getPowerScore(counterer);
            var counterDMG = parseInt(powerScore*windowSize);


            $scope.dealDamage($scope.initiator, counterDMG);
            $scope.vitals[counterer].cardio -= parseInt($scope.idleCardioPayment(counterer)/2);
        }
    };

    //mods that reset after every initiation
    $scope.resetTempCombatMods = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].dodged = false;
            $scope.corner[$scope.sides[i]].blocked = false;

            $scope.fumble[$scope.sides[i]] = false;
            $scope.predict[$scope.sides[i]] = false;
        }
        $scope.initiator = null;
        $scope.defender = null;
    };

    //return STRING 'red' or 'blue'
    $scope.otherSide = function(side){
        if(side==='red'){
            return 'blue';
        } else if (side==='blue'){
            return 'red';
        }
        return;
    };

    //victory conditions that trigger fight.stopped
    $scope.checkVictory = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var otherSide = $scope.otherSide($scope.sides[i]);
            var msg = "";
            if ($scope.vitals[$scope.sides[i]].consciousness < 0){

                $scope.corner[$scope.sides[i]].unconscious = true;

                msg = $scope.corner[$scope.sides[i]].name.toTitleCase() + " is knocked unconscious! " +
                $scope.corner[otherSide].name.toTitleCase() + " is victorious!";

                if ($scope.vitals[otherSide].consciousness > 0){
                    $scope.victor.side = otherSide;
                } else {
                    msg = "Both fighters are knocked unconscious! This is a tie!";
                    $scope.victor.side = 'tie';

                    $scope.corner[otherSide].unconscious = true;
                }
                $scope.record(msg);
                $scope.fight.stopped = true;
            }

            if ($scope.corner[$scope.sides[i]].quit){
                msg = $scope.corner[$scope.sides[i]].name.toTitleCase() + " submits!";
                $scope.record(msg);

                $scope.fight.stopped = true;
                $scope.victor.side = otherSide;
            }
        }

        $scope.endRound();

    };

    //when the fight clock goes over the max round timer
    $scope.endRound = function (){
        if ($scope.fightClock > 20*$scope.fight.round){
            $scope.fight.paused = true; 
            console.log("Round" + $scope.fight.round + " Ends");

            if($scope.vitals['red'].consciousness > $scope.vitals['blue'].consciousness){
                $scope.roundWinner[$scope.fight.round] = 'red';
                $scope.winningRounds.red++;
            } else if ($scope.vitals['red'].consciousness < $scope.vitals['blue'].consciousness){
                $scope.roundWinner[$scope.fight.round] = 'blue';
                $scope.winningRounds.blue++;
            } else {
                $scope.roundWinner[$scope.fight.round] = 'tie';
            }

            if ($scope.fightClock > $scope.fightClockMax){
                if ($scope.winningRounds.red > $scope.winningRounds.blue){
                    $scope.victor.side = 'red';
                } else if ($scope.winningRounds.red < $scope.winningRounds.blue){
                    $scope.victor.side = 'blue';
                } else {
                    $scope.victor.side = 'tie';
                }
                $scope.fight.stopped = true;
            }


        }
    };

    /**
    *   @param side STRING either 'red' or 'blue'
    *   @param type STRING 
    *   @return FLOAT
    */
    $scope.getInjuryMod = function (side, type){
        console.log(side, type);
        if(!$scope.corner[side][type]){
            console.log("no injury");
            return 1;
        } else {
            for (var i=1; i<5; i++){
                var injuryIndex = "lv"+i;
                for (var j=0; j<$scope.injuries[injuryIndex].length; j++){
                    if ($scope.corner[side][type]===$scope.injuries[injuryIndex][j]){
                        var percent = (5-i)/5;
                        console.log("injury lv" + i + " percent: " + percent);
                        return percent;
                    }
                }
            }
        }
    };
    /**
    *   regeneration between rounds
    */
    $scope.regenConsciousness = function(side){
        var base = $scope.getSkill(side, 'recovery');
        var injuryMod = $scope.getInjuryMod(side, 'nose');
        base = parseInt(base*Math.random()*injuryMod);

        return Math.min(base, 100-$scope.vitals[side].consciousness);
    };

    //regeneration between rounds
    $scope.regenCardio = function(side){
        var base = $scope.getSkill(side, 'recovery')*10; //100*10
        var regen = parseInt(base*Math.random());

        var maxCardio = 100+$scope.getSkill(side, 'endurance')*10;

        return Math.min(regen, maxCardio-$scope.vitals[side].cardio);
    };

    //regeneration between rounds
    $scope.regenpositioning = function(side){
        return 30;
    };

    //regeneration between rounds
    $scope.regenInitiationScore = function (side){
        return 0;
    };

    //regeneration between rounds
    $scope.roundRegen = function (side){

        //regenerate consciousness
        var consciousnessRegen = $scope.regenConsciousness(side);
        $scope.vitals[side].consciousness += consciousnessRegen;
        //regenerate cardio
        var cardioRegen = $scope.regenCardio(side);
        $scope.vitals[side].cardio += cardioRegen;
        //regenerate positioning
        $scope.vitals[side].positioning = $scope.regenpositioning(side);
        $scope.corner[side].initiationScore = $scope.regenInitiationScore(side);


        $scope.corner[side].pinned = false;
        if ($scope.vitals[side].consciousness > 20){
            $scope.corner[side].dazed = false;
        }


        var msg = $scope.corner[side].name.toTitleCase() + " recovers " + consciousnessRegen + " consciousness " +
            " and " + cardioRegen + " cardio at the end of round " + $scope.fight.round + ".";
        $scope.record(msg);
    };

    //record onto the fight transcript
    $scope.record = function(msg){
        $scope.transcript[$scope.transIndex] = msg;
        $scope.transIndex++;

    };

    //determine fraction of consciousness : positioning damage
    $scope.checkVulnerable = function(side){
        var otherSide = '';
        if(side ==='red'){
            otherSide = 'blue';
        } else if (side==='blue') {
            otherSide = 'red';
        }

        var vulnerability = 100*Math.random()*Math.random();
        if ($scope.fumble[side]){

            vulnerability += 50*Math.random();
        }
        if ($scope.corner[side].gassed){

            vulnerability += 50*Math.random();
        }

        return Math.min(vulnerability, 100);
    };

    //add modifiers to base positioning damage
    $scope.getpositioningDamage = function (target, damage, vulnerableMod){
        var otherSide = $scope.otherSide(target);

        var targetSkill = $scope.getpositioningSkill(target);
        var attackerSkill = $scope.getpositioningSkill(otherSide);

        var skillMod =  (Math.random()*attackerSkill - Math.random()*targetSkill)/100;

        if (skillMod < 0){
            skillMod = 1 - Math.abs(skillMod);
        } else {
            skillMod = 1+ Math.abs(skillMod);
        }

        return parseInt(damage*((100-vulnerableMod)/100)*skillMod);
    };

    //determine bloodied damage from base consciousness damage
    $scope.getBloodiedDamage = function(target, damage){
        var otherSide = $scope.otherSide(target);
        var base = damage;

        var attackerSkill = $scope.getpositioningSkill(otherSide);

        var skillMod = (attackerSkill * Math.random())/20;
        return parseInt(skillMod*damage);

    };


    //for stats screen
    $scope.getSkillColor = function (value){
        if(value < 20){
            return 'progress-bar-danger';
        } else if (value > 80){
            return 'progress-bar-success';
        } else {
            return 'progress-bar-info';
        }
    };

    //deal damage to fights conscioussness, positioning, bloodied bar
    $scope.dealDamage = function(target, damage){
        if (damage===0){
            return;
        } else {
            //check if target vulnerable
            var vulnerableMod = $scope.checkVulnerable(target);
            var chinMod = (150-$scope.getSkill(target, 'chin'))/100;


            var consciousnessDMG = parseInt(damage*(vulnerableMod/100)*chinMod);

            var positioningDMG = $scope.getpositioningDamage(target, damage, vulnerableMod);

            var bloodiedDMG = $scope.getBloodiedDamage(target, consciousnessDMG);

            $scope.vitals[target].consciousness -= consciousnessDMG;
            $scope.vitals[target].positioning -= positioningDMG;
            $scope.vitals[target].bloodied += bloodiedDMG;

            if (consciousnessDMG + positioningDMG + bloodiedDMG > 0){

                var msg = $scope.corner[target].name + " takes ";
                if(consciousnessDMG){
                    msg += consciousnessDMG + " consciousness ";
                }
                if (positioningDMG){
                    msg += positioningDMG + " positioning ";
                }
                if (bloodiedDMG){
                    msg += bloodiedDMG + " bloodied ";
                }
                msg += " damage ";

                $scope.record(msg);
            }

            if ($scope.vitals[target].bloodied > 400) {
                if (!$scope.corner[target].injuryLv4){
                    $scope.addInjury(target, '4');
                }
            } else if ($scope.vitals[target].bloodied > 200) {
                if (!$scope.corner[target].injuryLv3){
                    $scope.addInjury(target, '3');
                }
                else if (Math.random()*100 > 50){
                    $scope.addInjury(target, '3');
                }
            } else if ($scope.vitals[target].bloodied > 100){
                if(!$scope.corner[target].injuryLv2){
                    $scope.addInjury(target, '2');
                } else if (Math.random()*100 > 50){
                    $scope.addInjury(target, '2');
                }
            } else if ($scope.vitals[target].bloodied > 50){
                if (!$scope.corner[target].injuryLv1){
                    $scope.addInjury(target, '1');
                } else if (Math.random()*100 > 50){
                    $scope.addInjury(target, '1');
                }
            }

            //check if target quits
            $scope.checkQuit(target);

            return;
        }
    };

    //fighters may submit in bad situations before going unconscious
    $scope.checkQuit = function (target){
        var base = 0;
        if ($scope.corner[target].dazed && $scope.corner[target].gassed && $scope.corner[target].pinned){
            base += 100;
        } else {
            if ($scope.corner[target].dazed){
                base += 15;
            }

            if ($scope.corner[target].gassed){
                base +=10;
            }

            if ($scope.corner[target].pinned){
                base+=5;
            }
        }

        var skill = $scope.getSkill(target, 'heart');

        if(Math.random()*base > Math.random()*skill){
            $scope.corner[target].quit = true;
        }

    };

    //start round 2 or 3
    $scope.startNextRound = function (){

        $scope.initializeRound();
        $scope.fight.round++;
        $scope.fight.paused = false;
        $scope.transcript = [];

        $scope.fightLoop();
    };


    // reset to do a new fight
    $scope.reset = function(){
        $scope.selectedFighter = null;

        for (var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]] = {};
            $scope.corner[$scope.sides[i]].name = 'empty';
            $scope.corner[$scope.sides[i]].selected = false;
            $scope.corner[$scope.sides[i]].status = null;
            $scope.corner[$scope.sides[i]].quit = false;
            $scope.corner[$scope.sides[i]].unconscious = false;
            $scope.corner[$scope.sides[i]].injuryLv1 = false;
            $scope.corner[$scope.sides[i]].injuryLv2 = false;
            $scope.corner[$scope.sides[i]].injuryLv3 = false;
            $scope.corner[$scope.sides[i]].injuryLv4 = false;

            for (var j=0; j<$scope.injuryLocations.length; j++){
                $scope.corner[$scope.sides[i]][$scope.injuryLocations[j]] = null;
            }

            $scope.victor = {};
            $scope.victor.side = null;
        }

        $scope.fight.started = false;
        $scope.fight.stopped = false;
        $scope.fight.paused = false;
        $scope.fight.round = null;

        $scope.transIndex = 0;
        // $scope.transcript = null;
        // $scope.transcript = {};
        $scope.transcript = [];
    };


    $scope.showAllSkills = function (side){
        $scope.show[side].skills = true;
        return;
    };

    $scope.hideAllSkills = function (side){
        $scope.show[side].skills = false;
        return;
    };

    $scope.selectFighter = function (id){
        $scope.selectedFighter = id;
    };


    //place selected fighter on the fighter list to a corner 
    // prefight
    $scope.placeInCorner = function (id, side){
        //remove fighter from wrong corner
        var otherSide = '';
        if (side ==='red'){
            otherSide = 'blue';
        } else if (side==='blue'){
            otherSide = 'red';
        }
        if(id === $scope.corner[otherSide].id){
            $scope.corner[otherSide] = {};
            $scope.corner[otherSide].name = "empty";
            $scope.corner[otherSide].selected = false;
            $scope.corner[otherSide].status = null;

            //strategies
            $scope.strat[otherSide] = {};
            $scope.cStratBonuses[otherSide] = [];

            //skills
            $scope.cSkills[otherSide] = {};

        }

        //initiatize side
        for (var i=0; i<$scope.fighters.length; i++){
            if ($scope.fighters[i].id ===id){
                var tempStatus = '';
                if($scope.corner[side].status){
                    tempStatus = $scope.corner[side].status;
                } else {
                    tempStatus = 'art';
                }
                $scope.corner[side] = $scope.fighters[i];

                $scope.corner[side].selected = true;

                $scope.corner[side].status = tempStatus;

                $scope.show[side].skills = false;


                $scope.experience[side] = $scope.fightersExperience[$scope.fighters[i].id];

                break;
            }
        }
        //initialize side Strat StratBonuses
        $scope.initializeCornerStrategy(side);
        $scope.selectedFighter = null;

    };


    // fill in the side strategy from the fighter info that fills the corner
    $scope.initializeCornerStrategy = function (side){
        $scope.strat[side] = $scope.strats[$scope.corner[side].strategy];
        var j=0;
        for (var i=0; i<$scope.skills.length; i++){
            if (typeof($scope.stratBonuses[$scope.corner[side].strategy][$scope.skills[i].id]) !=='undefined'){
                $scope.cStratBonuses[side][j] = {};
                $scope.cStratBonuses[side][j].name = $scope.skills[i].name;
                $scope.cStratBonuses[side][j].value = $scope.stratBonuses[$scope.corner[side].strategy][$scope.skills[i].id];
                j++;
            }

            //initialize Skills
            $scope.cSkills[side][$scope.skills[i].name] = $scope.fighterSkills[$scope.corner[side].id][$scope.skills[i].id];
        }

    };

    $scope.showChangeStratInput = function (side){
        $scope.corner[side].changeStrat = true;

    };

    $scope.hideChangeStratInput = function (side){
        $scope.corner[side].changeStrat = false;

    };

    $scope.updateSelectedStrat = function(side){
        $scope.corner[side].strategy = $scope.corner[side].changeStratID;
        $scope.initializeCornerStrategy(side);
    };

    $scope.artStatus = function (side){
        $scope.corner[side].status = 'art';
    };

    $scope.statsStatus = function (side){
        $scope.corner[side].status = 'stats';
    };

    $scope.strategyStatus = function (side){
        $scope.corner[side].status = 'strategy';
    };

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    };

    $scope.heightConversion = function (height){
        var rand = parseInt(33*Math.random());
        if (height==='low'){
            return rand;
        } else if (height ==='medium'){
            return rand + 33;
        } else if (height ==='high'){
            return rand + 66;
        }
    };

    $scope.distanceConversion = function (distance){
        var rand = parseInt(33*Math.random());
        if(distance==='close'){
            return rand;
        } else if (distance==='medium'){
            return rand+33;
        } else if (distance ==='far'){
            return rand+66;
        }
    };

});
