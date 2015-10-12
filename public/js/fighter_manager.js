var app = angular.module("ArenaApp", []);

app.factory("gameAPIservice", function gameAPIservice ($http) {
    this.getJSON = function (url, data) {
        data = data || {};
        return $http.get(url, { params: data });
    };
    this.postJSON = function (url, data) {
        data = data || {};
        return $http.post(url, data);
    };

    this.getTraits= function (){
        return $http.get("/api/traits");
    };

    this.getTechniques = function (){
        return $http.get("/api/techniques");
    };

    this.getStrategies= function (){
        return $http.get("/api/strategies");
    };

    this.getSkills = function (){
        return $http.get("/api/skills");
    };

    this.getPlans = function (fighter_id){
        return $http.get("/api/characters/plans", {params: {fighter_id: fighter_id}});
    };

    this.getTechCond = function (fighter_id){
        return $http.get("/api/characters/techCond", {params: {fighter_id: fighter_id}});
    };

    this.getSlots = function (fighter_id){
        return $http.get("/api/characters/slots", {params: {fighter_id: fighter_id}});
    };

    this.updateSlot = function (slot, tech_id, email, stratExp_id){
        return this.postJSON("/api/fighters/plans/updateTechSlot", 
            {email: email, slot: slot, tech_id: tech_id, stratExp_id: stratExp_id});
    };

    this.getFighter = function (email, fighter_id){
        return this.getJSON("/api/fighters/" + fighter_id, { email: email });
    };


    return this;
});


app.controller('fighterManagerController', function ($scope, gameAPIservice, $timeout) {

    "use strict";

    $scope.email = utils.getCookie("email");
    $scope.player_name = utils.getCookie("name");
    $scope.fighterID = utils.getURLParams().fighter_id;
    console.log($scope.fighterID, "fighterID");


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
    $scope.selectedTrait = null;
    $scope.selectedFiPara = null;

    $scope.managedFighter = false;
    $scope.activeAnimationName = null;
    $scope.techAnimationName = null;

    $scope.planNames = [];
    $scope.planNames = ['A', 'B', 'C'];
    $scope.bonuses = [];

    $scope.loaded = {};
    $scope.loaded.fighters = false;
    $scope.loaded.plans = false;
    $scope.loaded.slots = false;


    $scope.stratParams = [];
    $scope.stratParams = ['initiation_frequency', 'base_cardio_cost' ,'initiation_cardio_cost', 'difficulty'];
    $scope.stratParamDesc = {};
    $scope.stratParamDesc = {initiation_frequency_high: 
        "This fighter will attack very often and try to overwhelm their opponent quickly.",
        initiation_frequency_medium: "This fighter will attack at a regular rate and whittle their opponent away over time.",
        initiation_frequency_low: "This fighter will try to dodge and counter rather than attack.",
        base_cardio_cost_high: "This strategy requires fast footwork and the fighters cardio will drain quickly even while they are idle. ",
        base_cardio_cost_medium: "This strategy requires regular movement which will gradually drain the fighters cardio even while idle. ",
        base_cardio_cost_low: "This strategy is energy efficient and uses little cardio while idle.",
        initiation_cardio_cost_high: "The fighter will lose a high amount of cardio with each attack.",
        initiation_cardio_cost_medium: "The fighter will lose some cardio with each attack.",
        initiation_cardio_cost_low: "The fighter will lose very little cardio with each attack.", 
        difficulty_high: "This strategy is very technically difficult. The fighter will fumble frequently if they have low experience with it, however when done properly opponents will have a hard time predicting what you will do next.",
        difficulty_medium: "This strategy requires some practice, otherwise the fighter may fumble. Very experienced opponents may be able to predict some aspects of this strategy", 
        difficulty_low: "This strategy is very easy and even inexperienced fighters can master it. Opponents will likely be able to predict most aspects of this strategy"
    };


    $scope.techSlots = ['slot_1', 'slot_2', 'slot_3'];


    gameAPIservice.getFighter($scope.email, $scope.fighterID).then(function (response){
        console.log("Tried to fetch fighter" + $scope.fighterID);
        console.log(response.data);

        if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
            $scope.selectedFighter = null;
        } else {
            $scope.selectedFighter = response.data;
            $scope.manageFighter();
            $scope.loaded.fighters=true;
        }
    });


    gameAPIservice.getTraits().then(function (response){

        console.log("Tried to fetch traits");
        console.log(response.data);

        if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
            $scope.traits = false;
        } else {
            $scope.traits = response.data.traits;
        }

    });

    gameAPIservice.getTechniques().then(function (response){

        console.log("Tried to fetch techniques");
        console.log(response.data);

        if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
            $scope.techniques = false;
        } else {
            $scope.techniques = response.data.techniques;
        }
    });


    gameAPIservice.getStrategies().then(function (response){
        
        console.log("Tried to fetch strategies");
        console.log(response.data);

        if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
            $scope.strats = false;
            $scope.stratBonuses = false;
        } else {
            $scope.strats = response.data.strats;
            $scope.stratBonuses = response.data.stratBonuses;
        }

    });

    gameAPIservice.getSkills().then(function (response){
        
        console.log("Tried to fetch skills");
        console.log(response.data);

        if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
            $scope.skills = false;
        } else {
            $scope.skills = response.data.skills;
        }

    });




    $scope.selectTech = function(tech){
        var index = $scope.getIndexOf($scope.techniques, 'id', tech); 

        $scope.selectedTech = $scope.techniques[index];
    };

    $scope.selectFiPara = function (param){
        console.log(param);
        $scope.selectedFiPara = {};
        $scope.selectedFiPara.name = param; 
        var level = $scope.getStratParamHeight(param);
        $scope.selectedFiPara.level = level;
        var index = param + "_" + level;
        $scope.selectedFiPara.description = $scope.stratParamDesc[index];
        console.log($scope.selectedFiPara, "final obj");
    };

    $scope.selectTrait = function(trait_id){
        $scope.selectedTrait = $scope.traits[trait_id];
    };



    $scope.cycleRight = function (){
    	$scope.selectedFighterIndex++;
    	if($scope.selectedFighterIndex === $scope.fighters.length || $scope.selectedFighterIndex > $scope.fighters.length){
    		$scope.selectedFighterIndex = 0;
    	}
    	$scope.initializeCarousel();
    };

    $scope.setTechAnimation = function (name){
        $scope.techAnimationName = name;
    };

    $scope.unsetTechAnimation = function (name){
        $scope.techAnimationName = null;
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

        gameAPIservice.getPlans($scope.managedFighter.id).then(function (response){
            
            console.log("Tried to fetch plans");
            console.log(response.data);

            if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
                $scope.plans = false;
            } else {
                $scope.plans = response.data.plans;
                for(var i=0; i<3; i++){
                    $scope.plans[i].index = $scope.planNames[i];
                }
                $scope.loaded.plans = true;
            }

        });

        gameAPIservice.getTechCond($scope.managedFighter.id).then(function (response){
            
            console.log("Tried to fetch conditioning");
            console.log(response.data);

            if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
                $scope.techConditioning = false;
            } else {
                $scope.techConditioning = response.data.techConditioning;
                $scope.loaded.techConditioning = true;
            }

        });

        gameAPIservice.getSlots($scope.managedFighter.id).then(function (response){
            
            console.log("Tried to fetch slots");
            console.log(response.data);

            if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
                $scope.slots = false;
            } else {
                $scope.slots = response.data.slots;
                $scope.loaded.slots = true;
            }
        });
    };

    $scope.techInSlot = function (slot, tech, stratExp_id){
        console.log(slot, tech.id, $scope.email, stratExp_id);
        
        gameAPIservice.updateSlot(slot, tech.id, $scope.email, stratExp_id).then(function (response){
            console.log("Tried to update slot " + slot + " stratExp_id " + stratExp_id);
            console.log(response.data);

            gameAPIservice.getSlots($scope.managedFighter.id).then(function (response){
                
                console.log("Tried to fetch slots");
                console.log(response.data);

                if (response.data.hasOwnProperty('status') && response.data.status === 'error') {
                    $scope.slots = false;
                } else {
                    $scope.slots = response.data.slots;
                    $scope.loaded.slots = true;
                }
            });
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
        if(value===0){
            return 'low';
        } else if(value===1){
            return 'medium';
        } else if (value===2){
            return 'high';
        } 
        return false;
    };

    $scope.distanceConverter = function (value){
        if(value===0){
            return 'close';
        } else if(value===1){
            return 'medium';
        } else if (value===2){
            return 'far';
        } else if (value===3){
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
            return $scope.strats[$scope.selectedPlan.strategy][param];
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

    $scope.home = function (){
        window.location.href = "/game";
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
            $('#'+$scope.selectedPlan.name).css('background-color','white');
        }

        var planIndex = $scope.getIndexOf($scope.plans, 'index', index);
        $scope.selectedPlan = $scope.plans[planIndex];
        $('#'+$scope.selectedPlan.name).css('border','thick solid orange');
        $('#'+$scope.selectedPlan.name).css('border-radius','20%');
        $('#'+$scope.selectedPlan.name).css('background-color','orange');

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
        return "/img/" + art + ".png";
    };
});