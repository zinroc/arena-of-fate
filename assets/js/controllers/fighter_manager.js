angular.module('App.controllers').controller('fighterManagerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

    $scope.prevFighter = null;
    $scope.selectFighter = null;
    $scope.nextFighter = null;
    $scope.loaded = false;
    $scope.selectedFighterIndex = null;

    $scope.plans = false;

    $scope.selectedPlan = null;

    $scope.managedFighter = false;

    $scope.planNames = [];
    $scope.planNames = ['A', 'B', 'C'];

    $scope.loaded = {};
    $scope.loaded.fighters = false;
    $scope.loaded.plans = false;

    $scope.stratParams = [];
    $scope.stratParams = ['Initiation Frequency', 'Idle Cardio' ,'Initiation Cardio', 'Difficulty'];
    $scope.techSlots = ['slot 1', 'slot 2', 'slot 3']

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
            $scope.selectedFighterIndex = 0;
            $scope.initializeCarousel();
        }
        $scope.loaded.fighters = true;

    });

    gameAPIservice.getTraits().success(function (response){
        "use strict";
        console.log("Tried to fetch modifiers");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.traits = false;
        } else {
            $scope.traits = response.traits;
        }

    });


    $scope.initializeCarousel = function () {
    	$scope.selectedFighter = $scope.fighters[$scope.selectedFighterIndex];
    	var maxIndex = $scope.fighters.length - 1;

    	var prevIndex = $scope.selectedFighterIndex-1;

    	if(prevIndex < 0){
    		prevIndex = maxIndex;

    	}

    	$scope.prevFighter = $scope.fighters[prevIndex];

    	var nextIndex = $scope.selectedFighterIndex+1;
    	if (nextIndex > maxIndex){
    		nextIndex = 0;
    	}
    	$scope.nextFighter = $scope.fighters[nextIndex];
    };

    $scope.cycleRight = function (){
    	$scope.selectedFighterIndex++;
    	if($scope.selectedFighterIndex === $scope.fighters.length || $scope.selectedFighterIndex > $scope.fighters.length){
    		$scope.selectedFighterIndex = 0;
    	}
    	$scope.initializeCarousel();
    };

    $scope.cycleLeft = function (){
    	$scope.selectedFighterIndex--;
    	if($scope.selectedFighterIndex < 0){
    		$scope.selectedFighterIndex = $scope.fighters.length-1;
    	}
    	$scope.initializeCarousel();
    };

    $scope.manageFighter = function (){

        $scope.managedFighter = $scope.selectedFighter;

        gameAPIservice.getPlans($scope.managedFighter.id).success(function (response){
            "use strict";
            console.log("Tried to fetch plans");
            console.log(response);

            if (response.hasOwnProperty('status') && response.status === 'error') {
                $scope.plans = false;
            } else {
                $scope.plans = response.plans;
                for(var i=0; i<3; i++){
                    $scope.plans[i].index = $scope.planNames[i];
                }
                $scope.loaded.plans = true;
            }

        });
    };

    $scope.selectFighter = function(id){
        console.log(id);
        var index = $scope.getIndexOf($scope.fighters, 'id', id);
        $scope.selectedFighterIndex = index;
        console.log($scope.selectedFighterIndex);
        $scope.initializeCarousel();
    };

    $scope.backToSelector = function (){
        $scope.managedFighter = false;
        $scope.loaded.plans = false;
    };

    $scope.selectPlan = function (index){
        if($scope.selectedPlan){
            $('#'+$scope.selectedPlan.name).css('border','none');;
        }

        var planIndex = $scope.getIndexOf($scope.plans, 'index', index);
        $scope.selectedPlan = $scope.plans[planIndex];
        $('#'+$scope.selectedPlan.name).css('border','thick solid orange');
        $('#'+$scope.selectedPlan.name).css('border-radius','20%');

    }

    $scope.getIndexOf = function(array, object, target){
        var result = false;
        for(var i=0; i<array.length; i++){
            if(array[i][object]===target){
                result = i;
            }
        }

        return result;
    };

    $scope.activateTooltip = function (tag){
        console.log("mouse", tag);

        var tagName = "#"+tag;

        $(tagName).tooltip('show');
        return 1;
    };

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    };
});