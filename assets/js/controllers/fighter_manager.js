angular.module('App.controllers').controller('fighterManagerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

    $scope.prevFighter = null;
    $scope.selectFighter = null;
    $scope.nextFighter = null;
    $scope.loaded = false;
    $scope.selectedFighterIndex = null;

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
    	console.log(maxIndex);
    	var prevIndex = $scope.selectedFighterIndex-1;
    	console.log(prevIndex);
    	if(prevIndex < 0){
    		prevIndex = maxIndex;
    		console.log(prevIndex);
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

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    };
});