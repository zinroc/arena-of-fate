angular.module('App.controllers').controller('fightPlannerController', function ($scope, gameAPIservice) {
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
	$scope.initiator = null;
	$scope.defender = null;
	$scope.victor = {};
	$scope.victor.side = null;
	$scope.fight.stopped = false;
    $scope.fight.round = null;
    $scope.fight.paused = null;


	//vitals
	$scope.vitals = {};
	$scope.vitals['red'] = {};
	$scope.vitals['red'].consciousness = null;
	$scope.vitals['blue'] = {};
	$scope.vitals['blue'].consciousness = null;

	$scope.transcript = [];
	$scope.transIndex = 0;



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
        while (!$scope.fight.stopped && !$scope.fight.paused){
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

    $scope.initializeFight = function (){

    	$scope.fight.started = true;
    	$scope.fight.stopped = false;
		$scope.fightClock = 0;
        $scope.fight.round = 1;
        $scope.fight.paused = false;

		console.log("initializing fight");
		for (var i=0; i<$scope.sides.length; i++){
			$scope.vitals[$scope.sides[i]].consciousness = 100;
			$scope.corner[$scope.sides[i]].initiationScore = 0;
		}
    }

    $scope.initIncrease = function (side){
        return $scope.heightConversion($scope.strat[side].initiation_frequency);
    }

    $scope.initiation = function (){
        //check increase fighter initiation.
        for (var i=0; i<$scope.sides.length; i++){
            //$scope.corner[$scope.sides[i]].initiationScore += parseInt(100*Math.random());
            $scope.corner[$scope.sides[i]].initiationScore += $scope.initIncrease($scope.sides[i]);
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
    }

    $scope.resolveInitiation = function (){
        $scope.corner[$scope.initiator].initiationScore = 0;

        var accuracyScore = parseInt(100*Math.random());
        var evasionScore = parseInt(100*Math.random());
        var speedScore = parseInt(100*Math.random());
        var reflexScore = parseInt(100*Math.random());
        var powerScore = parseInt(100*Math.random());

        if (accuracyScore < evasionScore){
            var msg = $scope.corner[$scope.defender].name.toTitleCase() + " dodges attack";
            console.log(msg);
            $scope.record(msg);

        } else if (speedScore < reflexScore){
            var msg = $scope.corner[$scope.defender].name + " manages to partially counteract the attack";
            console.log(msg)
            $scope.record(msg);
            var counter = reflexScore - speedScore;
            //console.log(powerScore, counter);
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
                $scope.fight.stopped = true;


            }
        }
        if ($scope.fightClock > 10 && $scope.fight.round === 1){
            $scope.fight.paused = true; 
            console.log("Round 1 Ends");
        } else if ($scope.fightClock > 20 && $scope.fight.round === 2){
            $scope.fight.paused = true;
            console.log("Round 2 Ends");
        } else if ($scope.fightClock > 30){
            $scope.victor.side = 'tie';
            $scope.fight.stopped = true;

        }
    }

    $scope.regen = function (side){
        $scope.vitals[side].consciousness = parseInt(Math.min($scope.vitals[side].consciousness + 50*Math.random(), 100));

        var msg = $scope.corner[side].name.toTitleCase() + " recovers to " + $scope.vitals[side].consciousness + " consciousness.";
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
	    	console.log(msg);
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
        console.log(side);
        $scope.corner[side].changeStrat = true;

    }

    $scope.hideChangeStratInput = function (side){
        console.log(side);
        $scope.corner[side].changeStrat = false;

    }

    $scope.updateSelectedStrat = function(side){
        console.log($scope.corner[side].changeStratID);
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
        console.log(height);
        var rand = parseInt(33*Math.random());
        if (height==='low'){
            console.log(rand);
            return rand;
        } else if (height ==='medium'){
            return rand + 33;
        } else if (height ==='high'){
            return rand + 66;
        }
    }

});