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
    $scope.fightClockMax = 30;
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
	$scope.vitals['blue'] = {};
	$scope.vitals['blue'].consciousness = null;


	$scope.transcript = [];
	$scope.transIndex = 0;

    $scope.experience = {};



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


    $scope.evaluateFight = function (){

        $scope.initializeFight();

        $scope.fightLoop();
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

            if($scope.fight.paused){

                for (var i=0; i<$scope.sides.length; i++){
                    $scope.regen($scope.sides[i]);
                }
            }

            $scope.fightClock++;
        }
    }

    $scope.getMovement = function (side){
        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var nextMovement = (optimalDistance - $scope.distance)/2;
        //console.log(side, optimalDistance, $scope.distance);
        return nextMovement;

    }

    $scope.movement = function (){
        for (var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].nextMovement = $scope.getMovement($scope.sides[i]);
        }

        for (var i=0; i<$scope.sides.length; i++){
            $scope.distance += $scope.corner[$scope.sides[i]].nextMovement;
            console.log($scope.corner[$scope.sides[i]].name.toTitleCase() + " moves " +
                $scope.corner[$scope.sides[i]].nextMovement + " to distance " + $scope.distance);
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
		for (var i=0; i<$scope.sides.length; i++){
			$scope.vitals[$scope.sides[i]].consciousness = 100;
            $scope.vitals[$scope.sides[i]].cardio = 1000;
			$scope.corner[$scope.sides[i]].initiationScore = 0;
            $scope.corner[$scope.sides[i]].gassed = false;

            $scope.fumble[$scope.sides[i]] = false;
            $scope.predict[$scope.sides[i]] = false;

            $scope.corner[$scope.sides[i]].nextMovement = 0;

            $scope.winningRounds[$scope.sides[i]] = 0;
		}
    }

    $scope.initIncrease = function (side){
        return $scope.heightConversion($scope.strat[side].initiation_frequency);
    }

    $scope.idleCardioPayment = function(side){
        return $scope.heightConversion($scope.strat[side].base_cardio);
    }

    $scope.initiation = function (){

        for (var i=0; i<$scope.sides.length; i++){
            //$scope.corner[$scope.sides[i]].initiationScore += parseInt(100*Math.random());

            if($scope.vitals[$scope.sides[i]].cardio > 0) {
                $scope.corner[$scope.sides[i]].initiationScore += $scope.initIncrease($scope.sides[i]);
                $scope.corner[$scope.sides[i]].gassed = false;

                $scope.vitals[$scope.sides[i]].cardio -= $scope.idleCardioPayment($scope.sides[i]);
            } else {
                //fighter is low on cardio and vulnerable
                $scope.corner[$scope.sides[i]].gassed = true;
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
            $scope.record(msg);

        } else if (speedScore < reflexScore){
            var msg = $scope.corner[$scope.defender].name + " manages to partially counteract the attack";
            $scope.record(msg);
            var counter = reflexScore - speedScore;
            $scope.dealDamage($scope.defender, Math.max(powerScore-counter/2,0));
            $scope.dealDamage($scope.initiator, Math.max(counter-powerScore/2, 0));

        } else {
            $scope.dealDamage($scope.defender, powerScore);
        }

        return;
    }

    $scope.checkVictory = function (){
        for(var i=0; i<$scope.sides.length; i++){
            if ($scope.vitals[$scope.sides[i]].consciousness < 0){
                if ($scope.sides[i] ==='blue'){
                    if ($scope.vitals['red'].consciousness > 0){
                        $scope.victor.side = 'red';
                    } else {
                        $scope.victor.side = 'tie';
                    }
                } else {
                    if ($scope.vitals['blue'].consciousness > 0){
                        $scope.victor.side = 'blue';
                    } else {
                        $scope.victor.side = 'tie';
                    }
                }
                console.log($scope.victor.side + " Wins!");
                //$scope.fight.stopped = true;


            }
        }

        $scope.endRound();

    }

    $scope.endRound = function (){
        if ($scope.fightClock > 10*$scope.fight.round){
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
        var base = parseInt(1000*Math.random());

        return Math.min(base, 1000-$scope.vitals[side].cardio);
    }

    $scope.regen = function (side){

        //regenerate consciousness
        var consciousnessRegen = $scope.regenConsciousness(side);
        $scope.vitals[side].consciousness += consciousnessRegen;
        //regenerate cardio
        var cardioRegen = $scope.regenCardio(side);
        $scope.vitals[side].cardio += cardioRegen;

        var msg = $scope.corner[side].name.toTitleCase() + " recovers " + consciousnessRegen + " consciousness " +
        " and " + cardioRegen + " cardio at the end of round " + $scope.fight.round + ".";
        $scope.record(msg);
    }

    $scope.record = function(msg){
    	$scope.transcript[$scope.transIndex] = msg;
    	$scope.transIndex++;

    }


    $scope.dealDamage = function(target, damage){
    	if (damage===0){
    		return;
    	} else {
	    	
	    	$scope.vitals[target].consciousness -= damage;
	    	var msg = $scope.corner[target].name + " takes " + damage + " damage and has " 
	    		+ $scope.vitals[target].consciousness + " consciousness remaining";
	    	$scope.record(msg);
	    	return;
    	}
    }

    $scope.startNextRound = function (){
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
    	} else {
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
    			$scope.corner[side] = $scope.fighters[i];
    			$scope.corner[side].selected = true;
    			$scope.corner[side].status = 'art';

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
        return gameAPIservice.assetPrefix() + "/img/" + art + ".png";
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