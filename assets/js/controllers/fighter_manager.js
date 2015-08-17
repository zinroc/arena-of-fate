angular.module('App.controllers').controller('fighterManagerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

    $scope.prevFighter = null;
    $scope.selectFighter = null;
    $scope.nextFighter = null;
    $scope.loaded = false;
    $scope.selectedFighterIndex = null;

    $scope.plans = [];

    $scope.managedFighter = false;

    $scope.planNames = [];
    $scope.planNames = ['A', 'B', 'C'];

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
        $scope.loaded = true;

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
        for (var i=0; i<3; i++){
            $scope.plans[i] = {};
            $scope.plans[i].name = $scope.planNames[i];
            $scope.plans[i].type = 'none';
            $scope.plans[i].art = 'noPlan';
        }

        $scope.managedFighter = $scope.selectedFighter;
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