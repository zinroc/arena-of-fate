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
	$scope.corner['red'] = {};
	$scope.corner['red'].name = 'empty';
	$scope.corner['red'].selected = false;
	$scope.corner['red'].status = null;

	$scope.strat = {};
	$scope.strat['red'] = {};
	$scope.cStratBonuses = {};
	$scope.cStratBonuses['red'] = {};
	$scope.cSkills = {};
	$scope.cSkills['red'] = {};

	$scope.corner['blue'] = {};
	$scope.corner['blue'].name = 'empty';
	$scope.corner['blue'].selected = false;
	$scope.corner['blue'].status = null;

	$scope.strat['blue'] = {};
	$scope.cStratBonuses['blue'] = {};
	$scope.cSkills['blue'] = {};

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

	//vitals
	$scope.vitals = {};
	$scope.vitals['red'] = {};
	$scope.vitals['red'].consciousness = null;
    $scope.vitals['red'].facing = null;
	$scope.vitals['blue'] = {};
	$scope.vitals['blue'].consciousness = null;
    $scope.vitals['blue'].facing = null;

	$scope.transcript = [];
	$scope.transIndex = 0;

    $scope.experience = {};

    $scope.fightBars = ['initiation', 'consciousness', 'facing', 'cardio'];
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


    $scope.getBarValue = function (bar, side){
        
        console.log(bar, side + " <-- bar, side" );
        
        if(bar==='initiation'){
            return $scope.corner[side].initiationScore;
        } else if (bar==='consciousness'){
            return $scope.vitals[side].consciousness;
        } else if (bar==='facing'){
            return $scope.vitals[side].facing;
        } else if (bar==='cardio'){
            return $scope.vitals[side].cardio;
        }
    }

    $scope.getBarPercent = function (bar, side){
        var val = $scope.getBarValue(bar, side);

        if(bar==='initiation'){
            return parseInt(val);
        } else if (bar==='consciousness'){
            return parseInt(val);
        } else if (bar==='facing'){
            return parseInt((val/30)*100);
        } else if (bar==='cardio'){
            return parseInt(val/10);
        }
    }

    $scope.evaluateFight = function (){

        $scope.initializeFight();

        $scope.fightLoop();
    }

    $scope.fightFacing = function(side){
        var fightReg =  parseInt(30*Math.random()*Math.random());
        fightReg = Math.min(fightReg, 30-$scope.vitals[side].facing);

        return fightReg;
    }

    $scope.regen = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.vitals[$scope.sides[i]].facing += $scope.fightFacing($scope.sides[i]);
        }
    }

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
    }

    $scope.fightLoop = function (){

        if(!$scope.fight.stopped && !$scope.fight.paused){
            $timeout(function(){$scope.fightLoop();}, 300);
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
        }
    }

    $scope.getMovement = function (side){
        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var nextMovement = (optimalDistance - $scope.distance)/2;
        return nextMovement;

    }

    $scope.movement = function (){
        for (var i=0; i<$scope.sides.length; i++){

            if(!$scope.corner[$scope.sides[i]].pinned) {
                $scope.corner[$scope.sides[i]].nextMovement = $scope.getMovement($scope.sides[i]);
            }
        }

        for (var i=0; i<$scope.sides.length; i++){
            $scope.distance += $scope.corner[$scope.sides[i]].nextMovement;
        }


    }

    $scope.initializeRound = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].status = 'art';
        }
    }

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
            $scope.vitals[$scope.sides[i]].facing = 30;
            $scope.vitals[$scope.sides[i]].cardio = 1000; 

			$scope.corner[$scope.sides[i]].initiationScore = 0; // distance / GPfreq
            
            $scope.corner[$scope.sides[i]].gassed = false; //cardio
            $scope.corner[$scope.sides[i]].pinned = false; // facing
            $scope.corner[$scope.sides[i]].dodged = false; //evasion vs accuracy
            $scope.corner[$scope.sides[i]].blocked = false; // reflex vs speed

            $scope.fumble[$scope.sides[i]] = false; // adds to vulnerability
            $scope.predict[$scope.sides[i]] = false; // adds to vulnerability, reflex, accuracy

            $scope.corner[$scope.sides[i]].nextMovement = 0;

            $scope.winningRounds[$scope.sides[i]] = 0;
		}

        $scope.setBarValues();
    }

    $scope.initIncrease = function (side){

        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var range = Math.abs(optimalDistance - $scope.distance);
        var rangeMod = (100-range)/(100);


        return parseInt(rangeMod*$scope.heightConversion($scope.strat[side].initiation_frequency));
    }

    $scope.idleCardioPayment = function(side){
        return $scope.heightConversion($scope.strat[side].base_cardio);
    }

    $scope.updateStatuses = function(side){
        if($scope.vitals[side].facing < 0) {

            if(!$scope.corner[side].pinned){
                var msg = $scope.corner[side].name.toTitleCase() + " is pinned.";
                $scope.record(msg);
            }
            $scope.corner[side].pinned = true;

        } else {
            if($scope.corner[side].pinned){
                var msg = $scope.corner[side].name.toTitleCase() + " managed to get free";
                $scope.record(msg);
            }
            $scope.corner[side].pinned = false;
        }

        if($scope.vitals[side].cardio < 0) {
            $scope.corner[side].gassed = true;
        } else {
            $scope.corner[side].gassed = false;
        }
    }

    $scope.getRangeColor = function(side){
        if($scope.strat[side].range ==='close'){
            var range = 17;
        } else if ($scope.strat[side].range ==='medium'){
            var range = 50;
        } else if ($scope.strat[side].range ==='far'){
            var range = 83;
        }
        console.log(side, $scope.distance, range, range-$scope.distance);
        if(Math.abs(range-$scope.distance) < 17){
            return 'green';
        } else if (Math.abs(range-$scope.distance) < 34) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    $scope.getRangeWord = function (){
        if($scope.distance < 33){
            return 'Close';
        } else if($scope.distance <66) {
            return 'Medium';
        } else {
            return 'Long';
        }
    }

    $scope.stallForCardio = function (side){
        $scope.vitals[side].cardio += parseInt(Math.random()*100);
    }

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
        }

        if ($scope.initiator){
            var msg = $scope.corner[$scope.initiator].name + " initiates";
            $scope.record(msg);
        } else {
        }
        return;
    }

    $scope.getPowerScore = function (side){
        var base = 100;

        return parseInt(100*Math.random());
    }

    $scope.getSpeedScore = function (side){
        var base = 100;

        return parseInt(base*Math.random());
    }

    $scope.getAccuracyScore = function (side){
        var base = 100;

        if($scope.predict[side]){
            base += 50;
        }

        return parseInt(base*Math.random());
    }

    $scope.getEvasionScore = function (side){
        var base = 100;
        if($scope.corner[side].gassed){
            base -= 90;
        }
        return parseInt(base*Math.random());
    }

    $scope.getReflexScore = function (side){
        var base = 100;
        if($scope.corner[side].gassed){
            base -= 90;
        }
        if($scope.predict[side]){
            base +=50;
        }

        return parseInt(base*Math.random());
    }

    $scope.initiationCardioPayment = function(side){
        return $scope.heightConversion($scope.strat[side].initiation_cardio);
    }

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

    }

    $scope.resolveInitiation = function (){
        $scope.corner[$scope.initiator].initiationScore = 0;

        $scope.checkAdvantage($scope.initiator, $scope.defender);


        $scope.vitals[$scope.initiator].cardio -= $scope.initiationCardioPayment($scope.initiator);

        var powerScore = $scope.getPowerScore($scope.initiator);
        var speedScore = $scope.getSpeedScore($scope.initiator);
        var accuracyScore = $scope.getAccuracyScore($scope.initiator);
        var evasionScore = $scope.getEvasionScore($scope.defender);
        var reflexScore = $scope.getReflexScore($scope.defender);

        if($scope.corner[$scope.defender].gassed){
            var msg = $scope.corner[$scope.defender].name.toTitleCase() + " looks gassed";
            $scope.record(msg);
        }

        if (accuracyScore < evasionScore){
            var msg = $scope.corner[$scope.defender].name.toTitleCase() + " dodges attack";
            $scope.corner[$scope.defender].dodged = true;
            $scope.record(msg);

        }

        if (speedScore < reflexScore){
            var msg = $scope.corner[$scope.defender].name + " manages to react";
            $scope.record(msg);

            $scope.corner[$scope.defender].blocked = true;

        }

        if ($scope.corner[$scope.defender].dodged && $scope.corner[$scope.defender].blocked){
            if(!$scope.corner[$scope.defender].gassed){
                var counter = reflexScore - speedScore;
                $scope.dealDamage($scope.initiator, Math.max(counter-powerScore/2, 0));
            }

            $scope.resetTempCombatMods();
        } else if ($scope.corner[$scope.defender].dodged){
            //nothing
        } else if ($scope.corner[$scope.defender].blocked){
            var counter = reflexScore - speedScore;
            if(powerScore - counter/2 < 0){
                var msg= $scope.corner[$scope.defender].name.toTitleCase() + " fully blocks the attack";
                $scope.record(msg);
            }
            $scope.dealDamage($scope.defender, Math.max(powerScore-counter/2,0));
        } else {
            $scope.dealDamage($scope.defender, powerScore);
        }

        return;
    }

    $scope.resetTempCombatMods = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].dodged = false;
            $scope.corner[$scope.sides[i]].blocked = false;
        }
    }

    $scope.otherSide = function(side){
        if(side==='red'){
            return 'blue';
        } else if (side==='blue'){
            return 'red';
        }
        return;
    }

    $scope.checkVictory = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var otherSide = $scope.otherSide($scope.sides[i]);
            if ($scope.vitals[$scope.sides[i]].consciousness < 0){
                var msg=$scope.corner[$scope.sides[i]].name.toTitleCase() + " is knocked unconscious! " 
                + $scope.corner[otherSide].name.toTitleCase() + " is victorious!";

                if ($scope.vitals[otherSide].consciousness > 0){
                    $scope.victor.side = otherSide;
                } else {
                    msg = "Both fighters are knocked unconscious! This is a tie!";
                    $scope.victor.side = 'tie';
                }
                $scope.record(msg);
                $scope.fight.stopped = true;
            }
        }

        $scope.endRound();

    }

    $scope.endRound = function (){
        if ($scope.fightClock > 20*$scope.fight.round){
            $scope.fight.paused = true; 
            console.log("Round" + $scope.fight.round + " Ends");

            if($scope.vitals['red'].consciousness > $scope.vitals['blue'].consciousness){
                $scope.roundWinner[$scope.fight.round] = 'red';
                $scope.winningRounds['red']++;
            } else if ($scope.vitals['red'].consciousness < $scope.vitals['blue'].consciousness){
                $scope.roundWinner[$scope.fight.round] = 'blue';
                $scope.winningRounds['blue']++;
            } else {
                $scope.roundWinner[$scope.fight.round] = 'tie';
            }

            if ($scope.fightClock > $scope.fightClockMax){
                if ($scope.winningRounds['red'] > $scope.winningRounds['blue']){
                    $scope.victor.side = 'red';
                } else if ($scope.winningRounds['red'] < $scope.winningRounds['blue']){
                    $scope.victor.side = 'blue';
                } else {
                    $scope.victor.side = 'tie';
                }
                $scope.fight.stopped = true;
            }
        }
    }

    $scope.regenConsciousness = function(side){
        var base = parseInt(50*Math.random());
        return Math.min(base, 100-$scope.vitals[side].consciousness);
    }

    $scope.regenCardio = function(side){
        var base = parseInt(1000*Math.random()*Math.random());

        return Math.min(base, 1000-$scope.vitals[side].cardio);
    }

    $scope.regenFacing = function(side){
        return 30;
    }

    $scope.roundRegen = function (side){

        //regenerate consciousness
        var consciousnessRegen = $scope.regenConsciousness(side);
        $scope.vitals[side].consciousness += consciousnessRegen;
        //regenerate cardio
        var cardioRegen = $scope.regenCardio(side);
        $scope.vitals[side].cardio += cardioRegen;
        //regenerate facing
        $scope.vitals[side].facing = $scope.regenFacing(side);

        $scope.corner[side].pinned = false;


        var msg = $scope.corner[side].name.toTitleCase() + " recovers " + consciousnessRegen + " consciousness " +
        " and " + cardioRegen + " cardio at the end of round " + $scope.fight.round + ".";
        $scope.record(msg);
    }

    $scope.record = function(msg){
    	$scope.transcript[$scope.transIndex] = msg;
    	$scope.transIndex++;

    }


    $scope.checkVulnerable = function(side){
        if(side ==='red'){
            var otherSide = 'blue';
        } else if (side==='blue') {
            var otherSide = 'red';
        }

        var vulnerability = 100*Math.random()*Math.random();
        if ($scope.fumble[side]){

            vulnerability += 50*Math.random();
        }
        if ($scope.corner[side].gassed){

            vulnerability += 50*Math.random();
        }

        return Math.min(vulnerability, 100);
    }

    $scope.dealDamage = function(target, damage){
    	if (damage===0){
    		return;
    	} else {
	    	
            //check if target vulnerable
            var vulnerableMod = $scope.checkVulnerable(target);

            var consciousnessDMG = parseInt(damage*(vulnerableMod/100));
            var facingDMG = parseInt(damage*((100-vulnerableMod)/100));

	    	$scope.vitals[target].consciousness -= consciousnessDMG;
            $scope.vitals[target].facing -= facingDMG;

            if (consciousnessDMG + facingDMG > 0){
    	    	var msg = $scope.corner[target].name + " takes " + consciousnessDMG + " consciousness damage and loses " + facingDMG + 
                " facing";

                $scope.record(msg);
            }

	    	return;
    	}
    }

    $scope.startNextRound = function (){

        $scope.initializeRound();
        $scope.fight.round++;
        $scope.fight.paused = false;
        $scope.transcript = [];

        $scope.fightLoop();
    }


	$scope.reset = function(){
		$scope.selectedFighter = null;

		for (var i=0; i<$scope.sides.length; i++){
			$scope.corner[$scope.sides[i]] = {};
			$scope.corner[$scope.sides[i]].name = 'empty';
			$scope.corner[$scope.sides[i]].selected = false;
			$scope.corner[$scope.sides[i]].status = null;
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
	}



    $scope.selectFighter = function (id){
    	$scope.selectedFighter = id;
    }

    $scope.placeInCorner = function (id, side){
    	//remove fighter from wrong corner
    	if (side ==='red'){
    		var otherSide = 'blue';
    	} else if (side==='blue'){
    		var otherSide = 'red';
    	}
    	if(id === $scope.corner[otherSide].id){
    		$scope.corner[otherSide] = {};
    		$scope.corner[otherSide].name = "empty";
    		$scope.corner[otherSide].selected = false;
    		$scope.corner[otherSide].status = null;

    		//strategies
    		$scope.strat[otherSide] = {};
    		$scope.cStratBonuses[otherSide] = {};

    		//skills
    		$scope.cSkills[otherSide] = {};

    	}

    	//initiatize side
    	for (var i=0; i<$scope.fighters.length; i++){
    		if ($scope.fighters[i].id ===id){
                if($scope.corner[side].status){
                    var tempStatus = $scope.corner[side].status;
                } else {
                    var tempStatus = 'art';
                }
                $scope.corner[side] = $scope.fighters[i];

    			$scope.corner[side].selected = true;
                console.log($scope.corner[side].status);

    			$scope.corner[side].status = tempStatus;

                console.log($scope.corner[side].status);

                $scope.experience[side] = $scope.fightersExperience[$scope.fighters[i].id];

    			break;
    		}
    	}
    	//initialize side Strat StratBonuses
        $scope.initializeCornerStrategy(side);
		$scope.selectedFighter = null;

    }

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
            $scope.cSkills[side][$scope.skills[i].id] = $scope.fighterSkills[$scope.corner[side].id][$scope.skills[i].id];
        }

    }

    $scope.showChangeStratInput = function (side){
        $scope.corner[side].changeStrat = true;

    }

    $scope.hideChangeStratInput = function (side){
        $scope.corner[side].changeStrat = false;

    }

    $scope.updateSelectedStrat = function(side){
        $scope.corner[side].strategy = $scope.corner[side].changeStratID;
        $scope.initializeCornerStrategy(side);
    }

    $scope.artStatus = function (side){
    	$scope.corner[side].status = 'art';
    }

    $scope.statsStatus = function (side){
    	$scope.corner[side].status = 'stats';
    }

    $scope.strategyStatus = function (side){
    	$scope.corner[side].status = 'strategy';
    }

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    }

    $scope.heightConversion = function (height){
        var rand = parseInt(33*Math.random());
        if (height==='low'){
            return rand;
        } else if (height ==='medium'){
            return rand + 33;
        } else if (height ==='high'){
            return rand + 66;
        }
    }

    $scope.distanceConversion = function (distance){
        var rand = parseInt(33*Math.random());
        if(distance==='close'){
            return rand;
        } else if (distance==='medium'){
            return rand+33;
        } else if (distance ==='far'){
            return rand+66;
        }
    }

});