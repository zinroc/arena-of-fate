angular.module('App.controllers').controller('fighterManagerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

    $scope.prevFighter = null;
    $scope.selectFighter = null;
    $scope.nextFighter = null;
    $scope.loaded = false;
    $scope.selectedFighterIndex = null;
    $scope.skills = null;
    $scope.strats = null;
    $scope.stratBonuses = null;
    $scope.plans = false;

    $scope.selectedPlan = null;
    $scope.selectedTech = null;

    $scope.managedFighter = false;
    $scope.activeAnimationName = null;

    $scope.planNames = [];
    $scope.planNames = ['A', 'B', 'C'];
    $scope.bonuses = [];

    $scope.loaded = {};
    $scope.loaded.fighters = false;
    $scope.loaded.plans = false;
    $scope.loaded.slots = false;


    $scope.stratParams = [];
    $scope.stratParams = ['initiation_frequency', 'base_cardio_cost' ,'initiation_cardio_cost', 'difficulty'];
    $scope.techSlots = ['slot_1', 'slot_2', 'slot_3'];

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
/** admin init
    gameAPIservice.initTechExp().success(function (response){
        "use strict";
        console.log("Tried to initTechExp");
        console.log(response);

    });

*/


    gameAPIservice.getTraits().success(function (response){
        "use strict";
        console.log("Tried to fetch traits");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.traits = false;
        } else {
            $scope.traits = response.traits;
        }

    });

    gameAPIservice.getTechniques().success(function (response){
        "use strict";
        console.log("Tried to fetch techniques");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.techniques = false;
        } else {
            $scope.techniques = response.techniques;
        }
    });


    gameAPIservice.getStrategies().success(function (response){
        "use strict";
        console.log("Tried to fetch strategies");
        console.log(response);

        if (response.hasOwnProperty('status') && response.status === 'error') {
            $scope.strats = false;
            $scope.stratBonuses = false;
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
        }

    });

    $scope.selectTech = function(tech){
        var index = $scope.getIndexOf($scope.techniques, 'id', tech); 

        $scope.selectedTech = $scope.techniques[index];
    };

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

    $scope.checkBonusDefined = function (skill_id){
        if (typeof($scope.stratBonuses[$scope.selectedPlan.strategy][skill_id]) !=='undefined'){
            return true;
        } else {
            return false;
        }
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

        gameAPIservice.getTechCond($scope.managedFighter.id).success(function (response){
            "use strict";
            console.log("Tried to fetch conditioning");
            console.log(response);

            if (response.hasOwnProperty('status') && response.status === 'error') {
                $scope.techConditioning = false;
            } else {
                $scope.techConditioning = response.techConditioning;
                $scope.loaded.techConditioning = true;
            }

        });

        gameAPIservice.getSlots($scope.managedFighter.id).success(function (response){
            "use strict";
            console.log("Tried to fetch slots");
            console.log(response);

            if (response.hasOwnProperty('status') && response.status === 'error') {
                $scope.slots = false;
            } else {
                $scope.slots = response.slots;
                $scope.loaded.slots = true;
            }
        });


    };

    $scope.masteryConverter = function (level){
        if(level==='1'){
            return 'novice';
        } else if(level==='2'){
            return 'adept';
        } else if (level==='3'){
            return 'master';
        }
        return false;
    };

    $scope.heightConverter = function (value){
        if(value==='0'){
            return 'low';
        } else if(value==='1'){
            return 'medium';
        } else if (value==='2'){
            return 'high';
        } 
        return false;
    };

    $scope.distanceConverter = function (value){
        if(value==='0'){
            return 'close';
        } else if(value==='1'){
            return 'medium';
        } else if (value==='2'){
            return 'far';
        } else if (value==='3'){
            return 'any';
        }
        return false;
    };

    $scope.stratParamBackground = function(param){
    //    console.log("entered background", param);
        var result = "";
        if ($scope.strats[$scope.selectedPlan.strategy][param]==='high'){
            result = "red";
        } else if ($scope.strats[$scope.selectedPlan.strategy][param]==='medium'){
            result = "orange";
        } else if ($scope.strats[$scope.selectedPlan.strategy][param]==='low'){
            result = "green";
        }
    //    console.log("result ", result);
        return result;
    };

    $scope.getStratParamHeight = function (param){
        if(typeof($scope.strats[$scope.selectedPlan.strategy][param]) !=='undefined'){
            return $scope.strats[$scope.selectedPlan.strategy][param].toTitleCase();
        } else {
            return false;
        }
    };

    $scope.getRustWord = function (value){
        if(value < 50){
            return 'Rusty';
        } else if (value < 66){
            return 'Practiced';
        } else {
            return 'Conditioned';
        }
    };

    $scope.deactivateAnimation = function (){
        $scope.activeAnimationName = null;
    };

    $scope.activeAnimation = function (animation){
        console.log("animation ", animation);
        $scope.activeAnimationName = animation;
    };

    $scope.selectFighter = function(id){
        //console.log(id);
        var index = $scope.getIndexOf($scope.fighters, 'id', id);
        $scope.selectedFighterIndex = index;
        console.log($scope.selectedFighterIndex);
        $scope.initializeCarousel();
    };

    $scope.backToSelector = function (){
        $scope.activeAnimationName = null;
        $scope.managedFighter = false;
        $scope.loaded.plans = false;
        $scope.loaded.techConditioning = false;
        $scope.selectedPlan = null;
    };

    $scope.getExpBarColor = function (value){
        if( value < 50){
            return "progress-bar-danger";
        } else if (value <66){
            return "progress-bar-info";
        } else {
            return "progress-bar-success";
        }
    };

    $scope.selectPlan = function (index){
        $scope.activeAnimationName = null;

        if($scope.selectedPlan){
            $('#'+$scope.selectedPlan.name).css('border','none');
        }

        var planIndex = $scope.getIndexOf($scope.plans, 'index', index);
        $scope.selectedPlan = $scope.plans[planIndex];
        $('#'+$scope.selectedPlan.name).css('border','thick solid orange');
        $('#'+$scope.selectedPlan.name).css('border-radius','20%');

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

    $scope.getTech = function (id){
        var index = $scope.getIndexOf($scope.techniques, 'id', id);
        return $scope.techniques[index];
    };

    $scope.activateClassTooltip = function (tag){
        var tagName = "."+tag;
        $(tagName).tooltip('show');
        return 1;
    };

    $scope.activateTooltip = function (tag){
        console.log(tag);
        var tagName = "#"+tag;

        $(tagName).tooltip('show');
        return 1;
    };

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    };
});