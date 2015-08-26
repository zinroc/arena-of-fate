angular.module('App.controllers').controller('fightPlannerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

/**----------------------- INIT  -------------------**/
    
    $scope.activeTechniques = {};

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


    $scope.selectedTech = null;

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
    $scope.modifiers = ['gassed', 'pinned', 'dazed', 'quit', 'unconscious', 'blood_lust', 'blood_rage', 
    'unstoppable_frenzy', 'stunned'];
    $scope.injuries = {};
    $scope.injuries.lv1 = ['bloody nose', 'bloodied vision', 'bruised leg', 'bruised torso', 'sprained finger', 'sprained ankle'];
    $scope.injuries.lv2 = ['broken nose', 'broken orbital', 'fractured leg', 'fractured rib', 'broken hand', 'broken ankle'];
    $scope.injuries.lv3 = ['missing nose', 'mask of blood', 'leg puncturing out', 'punctured organ', 'finger puncturing out', 'ankle ripped open'];
    $scope.injuries.lv4 = ['death', 'death', 'death', 'death', 'death', 'death'];

    $scope.injuryLocations = ['nose', 'eyes', 'legs', 'body', 'hands', 'feet'];

    $scope.animations = {};

    $scope.stratParams = [];
    $scope.stratParams = ['initiation_frequency', 'base_cardio_cost' ,'initiation_cardio_cost', 'difficulty'];

    //vitals
    $scope.vitals = {};
    $scope.vitals.red = {};
    $scope.vitals.blue = {};

    $scope.transcript = [];
    $scope.transIndex = 0;

    $scope.experience = {};

    $scope.fightBars = ['consciousness', 'cardio', 'bloodied'];
    $scope.roundBars = ['initiation', 'positioning'];

    $scope.fastEffects = [];
    $scope.fastEffects = ['initiator', 'dodge', 'block', 'fumble', 'predict', 'counter', 'gassed'];

    $scope.techAnimations = [];
    $scope.techAnimations = ['blood_lust', 'blood_rage', 'unstoppable_frenzy', 'flying', 'shield_smash', 
    'jumping_strike', 'maul', 'burning_strike'];

    $scope.barValue = {};

    $scope.loaded = {};
    $scope.loaded.fighter = false;

    //tech slots used for itterating through UI since 'ultimate' gets its own css
    $scope.techSlots = ['slot_1', 'slot_2', 'slot_3'];
    //all slots used for itterating through fight functions where ultimates arn't treated differently.
    $scope.allSlots = ['slot_1', 'slot_2', 'slot_3', 'ultimate'];

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
        $scope.loaded.fighters = true;

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


/**--------------------------------- INIT END---------------------------------**/
/**--------------------------------- Indexers ---------------------------------**/
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

    $scope.distnaceBackConverter = function(distance){
        if (distance < 33){
            return 0; 
        } else if (distance < 66){
            return 1;
        } else if (distance < 100){
            return 2;
        }
        return false;
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
    };

    $scope.getExpBarColor = function (value){
        value = parseInt(value);
        if( value < 50){
            return "progress-bar-danger";
        } else if (value <66){
            return "progress-bar-info";
        } else {
            return "progress-bar-success";
        }
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

    //return STRING 'red' or 'blue'
    $scope.otherSide = function(side){
        if(side==='red'){
            return 'blue';
        } else if (side==='blue'){
            return 'red';
        }
        return;
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

    //set the color of close/medium/far range under fighter portrait within a round
    $scope.getRangeColor = function(side){
        var rangeVal = 0;
        if($scope.strat[side].range ==='close'){
            rangeVal = 17;
            if ($scope.distance < 0){
                return 'green';
            }
        } else if ($scope.strat[side].range ==='medium'){
            rangeVal = 50;
        } else if ($scope.strat[side].range ==='far'){
            rangeVal = 83;
            if($scope.distance > 99){
                return 'green';
            }
        }
        if(Math.abs(rangeVal-$scope.distance) < 17){
            return 'green';
        } else if (Math.abs(rangeVal-$scope.distance) < 34) {
            return 'orange';
        } else {
            return 'red';
        }
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

    $scope.getShortParamName = function(param){
        if (param ==='initiation_frequency'){
            return "Init. Freq.";
        } else if (param ==='base_cardio_cost'){
            return "B. C. Cost";
        } else if (param ==='initiation_cardio_cost'){
            return "Init. C. Cost";
        } else if (param ==='difficulty'){
            return "Difficulty";
        }
        return false;
    };

    $scope.getTech = function (id){
        var index = $scope.getIndexOf($scope.techniques, 'id', id);
        return $scope.techniques[index];
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

    $scope.stratParamBackground = function(side, param){
        if(typeof ($scope.corner[side].selectedPlan) !== 'undefined'){
            var result = "";
            if ($scope.strats[$scope.corner[side].selectedPlan.strategy][param]==='high'){
                result = "red";
            } else if ($scope.strats[$scope.corner[side].selectedPlan.strategy][param]==='medium'){
                result = "orange";
            } else if ($scope.strats[$scope.corner[side].selectedPlan.strategy][param]==='low'){
                result = "green";
            }
            return result;
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

    $scope.getStratParamHeight = function (side, param){
        if(typeof ($scope.corner[side].selectedPlan) !=='undefined'){
            if(typeof($scope.strats[$scope.corner[side].selectedPlan.strategy][param]) !=='undefined'){
                return $scope.strats[$scope.corner[side].selectedPlan.strategy][param].toTitleCase();
            } else {
                return false;
            }
        }
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

    $scope.getRustWord = function (value){
        value = parseInt(value);
        if(value < 50){
            return 'Rusty';
        } else if (value < 66){
            return 'Practiced';
        } else {
            return 'Conditioned';
        }
    };
/**--------------------------------- Indexers END ---------------------------------**/

/**--------------------------------- Fight Functions--------------------------------- **/
    // main loop for the fight
    $scope.fightLoop = function (){

        if(!$scope.fight.stopped && !$scope.fight.paused){

            $scope.resetTempCombatMods();
            $scope.resetTechniques();

            $scope.movement();

            $scope.checkAnyTimeTechniques();
            $scope.checkPreInitTechniques();
            $scope.initiation();
            if ($scope.initiator){

                $scope.resolveInitiation();
                
                $scope.checkPostInitTechniques();
            } else if (!$scope.initiator){
                $scope.checkNoInitTechniques();
            }
            $scope.checkAnyTimeTechniques();

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

            $scope.fastEffectAnimations();
            //animation delay

            $timeout(function(){$scope.endAnimations();}, 1050);
        }
    };


    $scope.checkAnyTimeTechniques = function (){

    };

    $scope.checkNoInitTechniques = function (){

    };
    $scope.checkPostInitTechniques = function (){

    };
    $scope.checkDuringInitTechniques = function (initiator, defender){
        var skipAbility = $scope.checkTechFlying(initiator);
        console.log("skipAbility", skipAbility);
        if (skipAbility!=='shield_smash'){
            $scope.checkTechShieldSmash(initiator);
        }
        if(skipAbility!=='jumping_strike'){
            $scope.checkTechJumpingStrike(initiator);
        }
        if(skipAbility!=='burning_strike'){
            $scope.checkTechBurningStrike(initiator);
        }

        $scope.checkTechMaul(initiator);
    };


    $scope.conditionCheck = function (side, tech, exp){
        exp = parseInt(exp);
        var bar = parseInt(parseInt(tech.technical_value)*33*Math.random()) + 33*Math.random();
        console.log("bar", bar, "exp", exp);

        var score = parseInt(Math.random()*exp);
        if(exp > bar){
            return true;
        } else{
            var msg = $scope.corner[side].name.toTitleCase() + " fumbled attempting " + 
            tech.name.split('_').join(' ').toTitleCase();
            $scope.record(msg);
        }
    };

    $scope.checkTechActive = function (side, name){
       for(var i=0; i<$scope.allSlots.length; i++){
            var tech = $scope.getTech($scope.activeTechniques[side][$scope.allSlots[i]].id);
            if(tech.name===name){
                tech.exp = $scope.activeTechniques[side][$scope.allSlots[i]].exp;
                return tech;
            }
        }
        return false;
    }

    $scope.checkTechBurningStrike = function(side){
        var tech = $scope.checkTechActive(side, 'burning_strike');

        if (tech){
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].burning_strike = false;
                console.log("burning strike range check failed");
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].burning_strike = false;
                console.log("burning strike fumbled");
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].jumping_strike = false;
                console.log("insufficient cardio to burning_strike");
                return false;
            }

            $scope.corner[side].burning_strike = 2;
            $scope.animations[side].burning_strike.value = true;
            console.log("BURNING STRIKE!");

            return 'burning_strike';
        } else {

            return false;
        }
    }

    $scope.checkTechShieldSmash = function(side){
        var tech = $scope.checkTechActive(side, 'shield_smash');

        if (tech){
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].shield_smash = false;
                console.log("shield smash range check failed");
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].shield_smash = false;
                console.log("shield smash fumbled");
                return false;
            }
            //cardio check done when resolved


            $scope.corner[side].shield_smash = 2;
            console.log("SHIELD SMASH!");

            return 'shield_smash';
        } else {

            return false;
        }
    }

    $scope.checkTechJumpingStrike = function(side){
        var tech = $scope.checkTechActive(side, 'jumping_strike');

        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].jumping_strike = false;
                console.log("jumping strike range check failed");
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].jumping_strike = false;
                console.log("jumping strike fumbled");
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].jumping_strike = false;
                console.log("insufficient cardio to jumping_strike");
            }

            $scope.corner[side].jumping_strike = 2;
            $scope.animations[side]['jumping_strike'].value = true;

            console.log("JUMPING STRIKE!");

            return 'jumping_strike';
        } else {
            return false;
        }

    }

    $scope.checkTechFlying = function(side){
        for(var i=0; i<$scope.allSlots.length; i++){
            var tech = $scope.getTech($scope.activeTechniques[side][$scope.allSlots[i]].id);
            if(tech.name==='flying'){
                tech.exp = $scope.activeTechniques[side][$scope.allSlots[i]].exp;
                //range check 
                if (!$scope.rangeCheck(tech)){
                    $scope.corner[side].flying = false;
                    console.log("Flying range check failed");
                    return false;
                }
                //conditioning check
                if (!$scope.conditionCheck(side, tech, tech.exp)){
                    $scope.corner[side].flying = false;
                    console.log("Flying fumbled");
                    return false;
                }
                //cardio check 
                if (!$scope.cardioCheck(side, tech.cardio_cost)){
                    $scope.corner[side].flying = false;
                    console.log("insufficient cardio to fly");
                }
                $scope.animations[side].flying.value = true;

                $scope.corner[side].flying = 2;
                console.log("FLYING!");

                $scope.distance = 80;
                var ability = $scope.findFlyAbility(side);
                if(ability){
                    return ability;
                } else {
                    $scope.distance = 50;
                }
                ability = $scope.findFlyAbility(side);
                if(ability){
                    return ability;
                } else {
                    $scope.distance = 1;
                }
                ability = $scope.findFlyAbility(side);
                if (ability){
                    return ability;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    $scope.findFlyAbility = function (side){
        var result = false;
        result = $scope.checkTechShieldSmash(side);

        if (!result){
            result = $scope.checkTechJumpingStrike(side);
        }

        if (!result){
            result = $scope.checkTechBurningStrike(side);
        }

        if(!result){
            console.log($scope.distance, "no ability found");
        } else {
            console.log($scope.distance, result);
        }
        return result;
    }

    $scope.cardioCheck = function (side, cardio_cost){
        var cardioCost = parseInt(cardio_cost);
        cardioCost = 33*cardioCost;
        if ($scope.vitals[side].cardio < cardioCost){
            return false;
        } else {
            $scope.vitals[side].cardio -= cardioCost;
            return true;
        }
    }

    $scope.rangeCheck = function (tech){
        console.log(tech, tech.range, $scope.distance);
        var distance = $scope.distnaceBackConverter($scope.distance);
        var range = parseInt(tech.range);
        if (range===3 || range === distance){
            return true;
        } else {
            return false;
        }
    }

    /**
    * target 'red' / 'blue' -> side taking damage
    */
    $scope.checkTechBloodLust = function (side, bloodiedDMG){
        //check if target () has applicable technique
        var tech = $scope.checkTechActive(side, 'blood_lust');

        if(tech){
            //check if significant bloodied damage
            if (bloodiedDMG < 5){
                $scope.corner[side].blood_lust = false;
                console.log("insufficient blood", bloodiedDMG);
                return;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].blood_lust = false;
                return;
            }

            $scope.animations[side].blood_lust.value = true;

            $scope.corner[side].blood_lust = 100; // bloodlust is reset when an attack is dodged
            var msg = $scope.corner[side].name.toTitleCase() + " enters Blood Lust!";
            $scope.record(msg);
        } else {
            return false;
        }

    };

    $scope.checkTechUnstoppableFrenzy = function (target, targeter, bloodiedDMG){
        //check if target () has applicable technique
        for(var i=0; i<$scope.allSlots.length; i++){
            var tech = $scope.getTech($scope.activeTechniques[target][$scope.allSlots[i]].id);
            var msg = "";
            var maxCardio = 0;
            var oldCardio = 0;
            if(tech.name==='unstoppable_frenzy'){
                //check if blood_rage is active
                if(!$scope.corner[target].blood_rage){
                    return;
                }

                //check if significant bloodied damage
                if (bloodiedDMG < 10){
                    console.log("insufficient blood for frenzy", bloodiedDMG);
                    return;
                }
                //conditioning check
                if (!$scope.conditionCheck(target, tech, $scope.activeTechniques[target][$scope.allSlots[i]].exp)){
                    return;
                }

                $scope.animations[target].unstoppable_frenzy.value = true;
                $scope.corner[target].unstoppable_frenzy = 20;
                oldCardio = $scope.vitals[target].cardio;
                maxCardio = 100 + $scope.getSkill(target, 'endurance')*10;
                $scope.vitals[target].cardio = maxCardio;

                msg = $scope.corner[target].name.toTitleCase() + " recovers " + (maxCardio - oldCardio) + 
                    " cardio and enters an Unstoppable Frenzy!";
                $scope.record(msg);
            }

            tech = $scope.getTech($scope.activeTechniques[targeter][$scope.allSlots[i]].id);
            if(tech.name==='unstoppable_frenzy'){
                //check if blood_rage is active
                if(!$scope.corner[targeter].blood_rage){
                    return;
                }

                //check if significant bloodied damage
                if (bloodiedDMG < 10){
                    console.log("insufficient blood for frenzy", bloodiedDMG);
                    return;
                }
                //conditioning check
                if (!$scope.conditionCheck(targeter, tech, $scope.activeTechniques[targeter][$scope.allSlots[i]].exp)){
                    return;
                }

                $scope.animations[targeter].unstoppable_frenzy.value = true;
                $scope.corner[targeter].unstoppable_frenzy = 20;
                oldCardio = $scope.vitals[targeter].cardio;
                maxCardio = 100 + $scope.getSkill(targeter, 'endurance')*10;
                $scope.vitals[targeter].cardio = maxCardio;

                msg = $scope.corner[targeter].name.toTitleCase() + " recovers " + (maxCardio - oldCardio) + 
                    " cardio and enters an Unstoppable Frenzy!";
                $scope.record(msg);
            }
        }
    };

    /**
    * target 'red' / 'blue' -> side taking damage
    */
    $scope.checkTechBloodRage = function (side, bloodiedDMG){
        //check if target () has applicable technique
        var tech = $scope.checkTechActive(side, 'blood_rage');

        if(tech){
            //check if significant bloodied damage
            if (bloodiedDMG < 5){
                $scope.corner[side].blood_rage = false;
                console.log("insufficient blood", bloodiedDMG);
                return;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].blood_rage = false;
                return;
            }

            $scope.animations[side].blood_rage.value = true;

            $scope.corner[side].blood_rage = 15;
            var msg = $scope.corner[side].name.toTitleCase() + " enters Blood Rage!";
            $scope.record(msg);
        } else {
            return false;
        }
        
    };


    $scope.checkTechMaul = function (side){
       var otherSide = $scope.otherSide(side);

        var tech = $scope.checkTechActive(side, 'maul');

        if (tech){
            //check pinned
            if (!$scope.corner[otherSide].pinned){
                $scope.corner[side].maul = false;
                console.log("maul target not pinned");
                return false;
            }
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].maul = false;
                console.log("maul range check failed");
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].maul = false;
                console.log("maul fumbled");
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].maul = false;
                console.log("insufficient cardio to maul");
                return false;
            }
            $scope.animations[side].maul.value = true;
            $scope.corner[side].maul = 2;
            console.log("MAUL!");

            return 'maul';
        } else {
            return false;
        }

    };

    $scope.checkPreInitTechniques = function (){

    };

    $scope.resetTechniques = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            for (var j=0; j<$scope.allSlots.length; j++){
                var slot = $scope.allSlots[j];
                //console.log(side, slot, $scope.activeTechniques[side][slot].name, $scope.corner[side][$scope.activeTechniques[side][slot].name]);
                if($scope.corner[side][$scope.activeTechniques[side][slot].name] < 2 && 
                    $scope.corner[side][$scope.activeTechniques[side][slot].name]){
                    $scope.corner[side][$scope.activeTechniques[side][slot].name] = false;
                    if ($scope.activeTechniques[side][slot].name==='unstoppable_frenzy'){
                        var cardio = $scope.vitals[side].cardio;
                        $scope.vitals[side].cardio = 0;
                        var msg = $scope.corner[side].name.toTitleCase() + " loses " + cardio + 
                        " cardio when leaving an Unstoppable Frenzy";
                        $scope.record(msg);
                    }
                } else if ($scope.corner[side][$scope.activeTechniques[side][slot].name]){
                    $scope.corner[side][$scope.activeTechniques[side][slot].name]--;
                }
            }
        }
    };

    // stat regeneration within a round
    $scope.regen = function (){
        for(var i=0; i<$scope.sides.length; i++){
            $scope.vitals[$scope.sides[i]].positioning += $scope.fightpositioning($scope.sides[i]);
        }
    };

    /**
    *   triggered by starting a fight
    */
    $scope.evaluateFight = function (){

        $scope.initializeFight();

        $scope.fightLoop();
    };



    $scope.effectActive = function(side, effect){
        if (effect==='initiator'){
            if ($scope.initiator === side){
                return true;
            }
        } else if (effect==='dodge'){
            if($scope.corner[side].dodged){
                return true;
            }
        } else if (effect==='block'){
            if($scope.corner[side].blocked){
                return true;
            }
        } else if (effect === 'counter'){
            if($scope.corner[side].counter){
                return true;
            }
        } else if (effect === 'fumble'){
            if($scope.fumble[side]){
                return true;
            }
        } else if (effect ==='predict'){
            if($scope.predict[side]){
                return true;
            }
        } else if (effect==='gassed'){
            if ($scope.corner[side].gassed){
                return true;
            }
        }
        return false;
    };

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

    //return INT
    $scope.getpositioningSkill = function(side){
        var skill = 0;
        var injuryMod = 1;
        if($scope.distance < 33){
            skill = $scope.getSkill(side, 'grappling');
            injuryMod = $scope.getInjuryMod(side, 'body');
        } else if ($scope.distance < 66){
            skill = $scope.getSkill(side, 'pocket');
            injuryMod = $scope.getInjuryMod(side, 'feet');
        } else if ($scope.distance < 101){
            skill = $scope.getSkill(side, 'striking');
            injuryMod = $scope.getInjuryMod(side, 'feet');
        }

        return parseInt(skill*injuryMod);
    };

    //regenerate positioning algorithm
    $scope.fightpositioning = function(side){
        var otherSide = $scope.otherSide(side);

        var skill = $scope.getpositioningSkill(side);
        var opposingSkill = $scope.getpositioningSkill(otherSide);

        var regen = parseInt(Math.random()*skill - Math.random()*opposingSkill);

        if ($scope.corner[side].stunned){
            regen = 0;
        }
        if (regen > 0){
            regen = Math.min(30-$scope.vitals[side].positioning ,(regen/100)*30);
        } else {
            regen = 0;
        }

        return parseInt(regen);
    };


    //find the distance a fighter wants to move
    $scope.getMovement = function (side){
        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var nextMovement = (optimalDistance - $scope.distance)/2;
        var injuryMod = $scope.getInjuryMod(side, 'legs') * $scope.getInjuryMod(side, 'feet');

        if ($scope.corner[side].stunned){
            nextMovement = 0;
        }

        return parseInt(nextMovement*injuryMod);

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
            $scope.corner[$scope.sides[i]].stunned = false;
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

            $scope.animations[$scope.sides[i]] = {};
            for(var j=0; j<$scope.fastEffects.length; j++){
                $scope.animations[$scope.sides[i]][$scope.fastEffects[j]] = {};
                $scope.animations[$scope.sides[i]][$scope.fastEffects[j]].value = false;
            }

            $scope.animations[$scope.sides[i]]['blood'] = {};
            $scope.animations[$scope.sides[i]]['blood'].value = false;

            for( j=0; j<$scope.techAnimations.length; j++){
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]] = {};
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]].value = false;
            }

        }

        $scope.setBarValues();
    };

    //determine how much closer a fighter is to initiating this cycle in fightLoop
    $scope.initIncrease = function (side){

        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var range = Math.abs(optimalDistance - $scope.distance);
        var rangeMod = (100-range)/(100);

        var increase = parseInt(rangeMod*$scope.heightConversion($scope.strat[side].initiation_frequency));
        if($scope.corner[side].stunned){
            increase = 0;
        }
        return increase;
    };

    //determine how much cardio fighter pays this cycle in fightLoop
    $scope.idleCardioPayment = function(side){
        return parseInt($scope.heightConversion($scope.strat[side].base_cardio_cost)/2);
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
            injuryIndex = Math.floor(Math.random()*($scope.injuries[levelIndex].length));
            injury = $scope.injuries[levelIndex][injuryIndex];
            injuryLocation = $scope.injuryLocations[injuryIndex];

            // apply the injury
            if(!$scope.corner[side][injuryLocation]){
                $scope.corner[side][injuryLocation] = injury;
                $scope.corner[side].injuryLv1 = true;
                msg = $scope.corner[side].name.toTitleCase() + " was injured with a " + $scope.corner[side][injuryLocation].toTitleCase();
                $scope.record(msg);
            }

        } else {
            //pick an injury to upgrade
            var j =0;
            var upgradeArray = [];
            for (var i=0; i<$scope.injuryLocations.length; i++){
                if ($scope.corner[side][$scope.injuryLocations[i]] === $scope.injuries[priorLevelIndex][i]){
                    upgradeArray[j] = i;
                    j++;
                }
            }

            if(j===0){
                //nothing to upgrade, add lower level injury
                level--;
                $scope.addInjury(side, level);
            } else {
                //pick a random injury to upgrade
                var upgradeIndex = Math.floor(Math.random()*j);
                $scope.corner[side][$scope.injuryLocations[upgradeArray[upgradeIndex]]] = $scope.injuries[levelIndex][upgradeArray[upgradeIndex]];
                msg = $scope.corner[side].name.toTitleCase() + " was injured with a " + $scope.corner[side][$scope.injuryLocations[upgradeArray[upgradeIndex]]];
                $scope.record(msg);

            }
            var cornerInjury = "injury" + levelIndex;
            $scope.corner[side][cornerInjury] = true;

        }


        return;
    };



    //cardio regen while gassed
    $scope.stallForCardio = function (side){
        var base = $scope.getSkill(side, 'recovery');
        var injuryMod = $scope.getInjuryMod(side, 'body');

        var regen = parseInt(Math.random()*base*injuryMod);

        if($scope.corner[side].blood_rage){
            var oldRegen = regen;
            regen += parseInt(regen*1.5);

            var msg = $scope.corner[side].name.toTitleCase() + " regenerated " + (regen-oldRegen) +
            " bonus cardio due to Blood Range";
            $scope.record(msg);
        }

        $scope.vitals[side].cardio += regen;
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

        //tech Blood Lust
        if($scope.corner[side].blood_lust){
            var oldStrength = strength;
            strength = parseInt(strength*1.5);

            var msg = $scope.corner[side].name.toTitleCase() + " gains " + (strength - oldStrength) + 
            " bonus strength under the effect of Blood Lust!";
            $scope.record(msg);

        }


        var base = parseInt((strength + speed) / 2);

        //tech Flying
        if ($scope.corner[side].flying){
            var oldBase = base;

            base = parseInt(base*1.4);

            var msg = $scope.corner[side].name.toTitleCase() + " gains " + (base - oldBase) + 
            " bonus power under the effect of Flying!";
            $scope.record(msg);
        }

        if ($scope.corner[side].maul){
            var oldBase = base;

            base = parseInt(base*1.2);

            var msg = $scope.corner[side].name.toTitleCase() + " gains " + (base - oldBase) + 
            " bonus power while Mauling!";
            $scope.record(msg);
        }

        return parseInt(base*Math.random());
    };

    $scope.getSpeedScore = function (side){
        var base = $scope.getSkill(side, 'speed');

        if (base<5){
            base=5;
        }

        var injuryMod = ($scope.getInjuryMod(side, 'body')+$scope.getInjuryMod(side, ' legs'))/2;

        return parseInt(base*Math.random()*injuryMod);
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

        var injuryMod = $scope.getInjuryMod(side, 'eyes');

        return parseInt(base*Math.random()*injuryMod);
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
            //tech turtle

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

        var injuryMod = $scope.getInjuryMod(side, 'eyes');

        return parseInt(base*Math.random());
    };

    $scope.initiationCardioPayment = function(side){
        return $scope.heightConversion($scope.strat[side].initiation_cardio_cost);
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

        $scope.checkDuringInitTechniques($scope.initiator, $scope.defender);

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
            $scope.corner[$scope.initiator].blood_lust = false;
            $scope.corner[$scope.initiator].jumping_strike = false;
            $scope.corner[$scope.initiator].maul = false;
            $scope.corner[$scope.initiator].burning_strike = false;
            $scope.record(msg);

        } else if ($scope.corner[$scope.initiator].jumping_strike){
            $scope.resolveJumpingStrike($scope.initiator);
        }

        if (speedScore < reflexScore){
            msg = $scope.corner[$scope.defender].name + " manages to react";
            $scope.record(msg);
            $scope.corner[$scope.defender].blocked = true;

            //tech shield_smash
            if($scope.corner[$scope.initiator].shield_smash){

                $scope.resolveShieldSmash($scope.initiator);
            }
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

    $scope.resolveJumpingStrike = function (side){
        var otherSide = $scope.otherSide(side);
        $scope.corner[otherSide].stunned = true;
        
        var abilityName = "";
        if(!$scope.corner[side].flying){
            abilityName = "Jumping Strike";
        } else {
            abilityName = "Flying Jumping Strike";
        }

        var msg = $scope.corner[$scope.initiator].name.toTitleCase() + " stuns with "+ abilityName +" Strike";
        $scope.record(msg);
    }

    $scope.resolveShieldSmash = function(side){
        var otherSide = $scope.otherSide(side);
        if (!$scope.cardioCheck(side, 1)){
            $scope.corner[side].shield_smash = false;
            console.log("insufficient cardio to shield smash");
        } else {
            var cardioDMG = $scope.getPowerScore(side);
            var techName = "";
            if($scope.corner[side].flying){
                techName = "Flying Shield Smash";
            } else {
                techName = "Shield Smash";
            }

            $scope.vitals[otherSide].cardio -= cardioDMG;
            var msg = $scope.corner[side].name.toTitleCase() + " performs " + techName + " dealing " + 
            cardioDMG + " cardio damage!";
            $scope.record(msg);

            $scope.animations[side].shield_smash.value = true;
            $scope.corner[side].shield_smash = false;
        }
        return;
    }

    //blocking reduces damage taken and may result in a counter
    $scope.evaluateBlock = function (blocker, reflex, speed, power){
        var attacker = $scope.otherSide(blocker);
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
            $scope.corner[attacker].blood_lust = false;
            $scope.corner[attacker].burning_strike = false;
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


            var damage = $scope.dealDamage($scope.initiator, counterDMG);
            $scope.vitals[counterer].cardio -= parseInt($scope.idleCardioPayment(counterer)/2);
            if (damage > 0){
                $scope.corner[counterer].counter = true;
            }
        }
    };

    //mods that reset after every initiation
    $scope.resetTempCombatMods = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var otherSide = $scope.otherSide($scope.sides[i]);
            $scope.corner[$scope.sides[i]].dodged = false;
            $scope.corner[$scope.sides[i]].blocked = false;
            $scope.corner[$scope.sides[i]].counter = false;
            $scope.corner[$scope.sides[i]].acceptedDamage = false;

            if (!$scope.corner[otherSide].jumping_strike){
                $scope.corner[$scope.sides[i]].stunned = false;
            }

            $scope.fumble[$scope.sides[i]] = false;
            $scope.predict[$scope.sides[i]] = false;

        }
        $scope.initiator = null;
        $scope.defender = null;
    };


    /**
    * check injury level of side
    * @return STRING if doctor stoppage, false if not
    */
    $scope.checkDoctor = function (side){
        for (var i=0; i<$scope.injuryLocations.length; i++){
            var injuryMod = $scope.getInjuryMod(side, $scope.injuryLocations[i]);
            if (injuryMod < 0.25) {
                if ($scope.injuryLocations[i] === 'eyes'){
                    return $scope.corner[side].name.toTitleCase() + " falls covering their face in incredible pain";
                } else if ($scope.injuryLocations[i] === 'nose'){
                    return $scope.corner[side].name.toTitleCase() + " falls covering their face in incredible pain";
                } else if ($scope.injuryLocations[i] === 'body'){
                    return $scope.corner[side].name.toTitleCase() + " collapses from excessive internal bleeding";
                } else if ($scope.injuryLocations[i] === 'legs'){
                    return $scope.corner[side].name.toTitleCase() + " faints due to blood lost from leg artery";
                } else if ($scope.injuryLocations[i] === 'hands'){
                    return $scope.corner[side].name.toTitleCase() + " faints due to blood lost from hand";
                } else if ($scope.injuryLocations[i] === 'feet'){
                    return $scope.corner[side].name.toTitleCase() + " faints due to blood lost from foot";
                }
            } else if(injuryMod < 0.45){
                if ($scope.injuryLocations[i] === 'eyes'){
                    return "Doctor stoppage due to large cut";
                } else if ($scope.injuryLocations[i] === 'nose'){
                    return false;
                } else if ($scope.injuryLocations === 'body'){
                    return false;
                } else if ($scope.injuryLocations[i] === 'legs'){
                    return "Doctor stoppage due to broken leg";
                } else if ($scope.injuryLocations[i] === 'hands'){
                    return false;
                } else if ($scope.injuryLocations[i] === 'feet'){
                    return "Doctor stopped due to detached foot";
                }
            }
        }
        return false;
    };

    //victory conditions that trigger fight.stopped
    $scope.checkVictory = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var otherSide = $scope.otherSide($scope.sides[i]);
            var msg = "";
            //ref stoppage
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
            //doctor stoppeage

            var docMsg = $scope.checkDoctor($scope.sides[i]);
            if (docMsg) {
                $scope.record(docMsg);

                $scope.fight.stopped = true;
                $scope.victor.side = otherSide;
            }

            //submit
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
        if ($scope.fightClock > 20*$scope.fight.round || $scope.fight.stopped){
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
            //delay to end last animation
        }
    };



    /**
    *   @param side STRING either 'red' or 'blue'
    *   @param type STRING from injuryLocations array.
    *   @return FLOAT
    */
    $scope.getInjuryMod = function (side, type){
        if(!$scope.corner[side][type]){
            return 1;
        } else {
            for (var i=1; i<5; i++){
                var injuryIndex = "lv"+i;
                for (var j=0; j<$scope.injuries[injuryIndex].length; j++){
                    if ($scope.corner[side][type]===$scope.injuries[injuryIndex][j]){
                        var percent = (5-i)/5;
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

        var regen = Math.min(base, 100-$scope.vitals[side].consciousness);



        return regen;
    };

    //regeneration between rounds
    $scope.regenCardio = function(side){
        var base = $scope.getSkill(side, 'recovery')*10; //100*10
        var regen = parseInt(base*Math.random());

        var maxCardio = 100+$scope.getSkill(side, 'endurance')*10;

        if($scope.corner[side].blood_rage){
            var oldRegen = regen;
            regen = parseInt(regen*1.5);
            if(regen > oldRegen){
                var msg = $scope.corner[side].name.toTitleCase() + " regenerated " + (regen-oldRegen) +
                " bonus cardio due to Blood Rage";
                $scope.record(msg);
            }
        }

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
        var finalDamage = parseInt(damage*((100-vulnerableMod)/100)*skillMod);
        return finalDamage;
    };

    //determine bloodied damage from base consciousness damage
    $scope.getBloodiedDamage = function(target, damage){
        var otherSide = $scope.otherSide(target);
        var base = damage;

        var attackerSkill = $scope.getpositioningSkill(otherSide);

        var skillMod = (attackerSkill * Math.random())/20;
        return parseInt(skillMod*damage);

    };


    //deal damage to fights conscioussness, positioning, bloodied bar
    $scope.dealDamage = function(target, damage){
        var targeter = $scope.otherSide(target);

        $scope.corner[target].acceptedDamage = true;

        if (damage===0){
            return;
        } else {

            //check if target vulnerable
            var vulnerableMod = $scope.checkVulnerable(target);
            var chinMod = (150-$scope.getSkill(target, 'chin'))/100;


            var consciousnessDMG = parseInt(damage*(vulnerableMod/100)*chinMod);


            var positioningDMG = $scope.getpositioningDamage(target, damage, vulnerableMod);

            var bloodiedDMG = $scope.getBloodiedDamage(target, consciousnessDMG);
            var msg ="";
            if($scope.corner[target].unstoppable_frenzy){
                msg = $scope.corner[target].name.toTitleCase() + 
                " has consciousness damage reduced to 0 due to being in an Unstoppable Frenzy";
                $scope.record(msg);
                consciousnessDMG = 0;
            }

            var totalDMG = consciousnessDMG + positioningDMG + bloodiedDMG;

            if($scope.corner[targeter].burning_strike){
                $scope.resolveBurningStrike(targeter, totalDMG);
            }

            $scope.vitals[target].consciousness -= consciousnessDMG;
            $scope.vitals[target].positioning -= positioningDMG;
            $scope.vitals[target].bloodied += bloodiedDMG;

            if (totalDMG > 0){
                msg = $scope.corner[target].name + " takes ";
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

            if (bloodiedDMG > 0){
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
            }

            var targeter = $scope.otherSide(target);


            $scope.checkPostDamageTech(target, targeter, bloodiedDMG);
            //check if target quits
            $scope.checkQuit(target);

            return totalDMG;
        }
    };

    $scope.resolveBurningStrike = function (targeter, totalDMG){
        var damage = parseInt(totalDMG/3);
        var target = $scope.otherSide(targeter);
        var maxDMG = parseInt($scope.vitals[target].bloodied); 
        var burnDMG = parseInt(damage/2);

        var msg = "";
        //perform bloodied -> consciousnessDMG conversion
        if(maxDMG > 0){
            var conDMG = Math.min(maxDMG, totalDMG);
            $scope.vitals[target].bloodied -= conDMG;
            $scope.vitals[target].conscioussness -= (conDMG+burnDMG);
            msg = $scope.corner[targeter].name.toTitleCase() + "'s burning strike burns into wounds dealing "
             + (conDMG+burnDMG) + " conscioussness damage! ";
            $scope.record(msg);
        } else {
            msg = $scope.corner[target].name.toTitleCase() + " is not wounded and imune to burning strike";
            $scope.record(msg);
        }
        $scope.corner[targeter].burning_strike = false;

    }

    $scope.checkPostDamageTech = function(target, targeter, bloodiedDMG){
        $scope.checkTechUnstoppableFrenzy(target, targeter, bloodiedDMG);
        //unstoppable frenzy comes first so it cant be activated on same turn as lust/rage
        $scope.checkTechBloodLust(targeter, bloodiedDMG);
        $scope.checkTechBloodRage(target, bloodiedDMG);
    };

    //fighters may submit in bad situations before going unconscious
    $scope.checkQuit = function (target){
        var targeter = $scope.otherSide(target);

        if($scope.corner[target].unstoppable_frenzy){
            return;
        }

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

            if($scope.corner[targeter].maul){
                var msg = "Mauling increases " + $scope.corner[target].name.toTitleCase() + "'s chance to quit";
                $scope.record(msg);
                base+=15;
            }

            for (var i=0; i<$scope.injuryLocations.length; i++){
                var injuryMod = $scope.getInjuryMod(target, $scope.injuryLocations[i]);

                base += parseInt((1-injuryMod)*10);

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

    $scope.initializeTechniques = function (side){
            $scope.corner[side].blood_lust = false;
            $scope.corner[side].blood_rage = false;
            $scope.corner[side].unstoppable_frenzy = false;
            $scope.corner[side].flying = false;
            $scope.corner[side].shield_smash = false;
            $scope.corner[side].jumping_strike = false;
            $scope.corner[side].maul = false;
            $scope.corner[side].burning_strike = false;
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

            $scope.initializeTechniques($scope.sides[i]);
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
        $scope.transcript = [];
    };

    $scope.selectFighter = function (id){
        $scope.selectedFighter = id;
    };

    $scope.selectPlan = function (side, plan){
        $scope.corner[side].selected = false;
        $scope.corner[side].selectedPlan = plan;

        $scope.initializeCornerStrategy(side);
        $scope.corner[side].selected = true;
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

            $scope.corner[otherSide].plans = null;
            $scope.corner[otherSide].selectedPlan = null;

            $scope.corner[otherSide].slots = null;

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
                $scope.corner[side].status = tempStatus;

                gameAPIservice.getPlans($scope.corner[side].id).success(function (response){
                    "use strict";
                    console.log("Tried to fetch strategies");
                    console.log(response);

                    if (response.hasOwnProperty('status') && response.status === 'error') {
                        $scope.corner[side].plans = false;
                    } else {
                        $scope.corner[side].plans = response.plans;
                        $scope.corner[side].selectedPlan = response.plans[0];
                    }

                    gameAPIservice.getSlots($scope.corner[side].id).success(function (response){
                        "use strict";
                        console.log("Tried to fetch slots");
                        console.log(response);

                        if (response.hasOwnProperty('status') && response.status === 'error') {
                            $scope.corner[side].slots = false;
                        } else {
                            $scope.corner[side].slots = response.slots;
                        }

                        gameAPIservice.getTechCond($scope.corner[side].id).success(function (response){
                            "use strict";
                            console.log("Tried to fetch tech conditioning");
                            console.log(response);

                            if (response.hasOwnProperty('status') && response.status === 'error') {
                                $scope.corner[side].techCond = false;
                            } else {
                                $scope.corner[side].techCond = response.techConditioning;
                            }
                            $scope.initializeCornerStrategy(side);
                            $scope.corner[side].selected = true;
                        });
                    });
                });


                $scope.show[side].skills = false;
                $scope.experience[side] = $scope.fightersExperience[$scope.fighters[i].id];

                break;
            }
        }
        //initialize side Strat StratBonuses

        $scope.selectedFighter = null;

    };

    // fill in the side strategy from the fighter info that fills the corner
    $scope.initializeCornerStrategy = function (side){
        $scope.strat[side] = $scope.strats[$scope.corner[side].selectedPlan.strategy];
        $scope.activeTechniques[side] = {};

        $scope.initializeTechniques(side);

        for(var k=0; k<$scope.allSlots.length; k++){
            $scope.activeTechniques[side][$scope.allSlots[k]] = {};

            $scope.activeTechniques[side][$scope.allSlots[k]].id = $scope.corner[side].slots[$scope.strat[side].id][$scope.allSlots[k]];
            $scope.activeTechniques[side][$scope.allSlots[k]].exp = $scope.corner[side].techCond[$scope.activeTechniques[side][$scope.allSlots[k]].id];
            var tech = $scope.getTech($scope.activeTechniques[side][$scope.allSlots[k]].id);
            $scope.activeTechniques[side][$scope.allSlots[k]].name = tech.name;
        }
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

/**--------------------------------- Fighter Functions  END--------------------------------- **/
/**--------------------------------- Dynamic UI --------------------------------- **/

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


    $scope.fastEffectAnimations = function (){
        //check if new fast effect active

        for (var i=0; i<$scope.fastEffects.length; i++){
            for (var j=0; j<$scope.sides.length; j++){
                if ($scope.effectActive($scope.sides[j], $scope.fastEffects[i]) && 
                    !$scope.animations[$scope.sides[j]][$scope.fastEffects[i]].value){
                    $scope.animations[$scope.sides[j]][$scope.fastEffects[i]].value = true;
                }
            }
        }

        for(i=0; i<$scope.sides.length; i++){
            if ($scope.corner[$scope.sides[i]].acceptedDamage){
                $scope.animations[$scope.sides[i]]['blood'].value = true;
            }
        }

    };

    $scope.activeDamageTooltip = function (damage, side){
        if ($scope.animations[side][damage].timer < 1){
            $scope.deactivateTooltip(damage+side);
            return 1;
        } else {
            $scope.activateTooltip(damage+side);
            return 1;
        }
    };


    $scope.activeEffectTooltip = function (effect, side){
        if ($scope.animations[side][effect].timer < 1){
            $scope.deactivateTooltip(effect+side);
            return 1;
        } else {
            $scope.activateTooltip(effect+side);
            return 1;
        }
    };


    $scope.activateTooltip = function (tag){
        var tagName = "#"+tag;

        $(tagName).tooltip('show');
        return 1;
    };


    $scope.activateClassTooltip = function (tag){
        var tagName = "."+tag;
        $(tagName).tooltip('show');
        return 1;
    };


    $scope.deactivateTooltip = function (tag){
        var tagName = "#"+tag;
        $(tagName).tooltip('hide');
        return 1;
    };


    $scope.selectTech = function(tech){
        var index = $scope.getIndexOf($scope.techniques, 'id', tech); 

        $scope.selectedTech = $scope.techniques[index];
    };


    $scope.endAnimations = function (){
        for (var i=0; i<$scope.sides.length; i++){
            for (var j=0; j<$scope.fastEffects.length; j++){
                $scope.animations[$scope.sides[i]][$scope.fastEffects[j]].value = false;
            }

            for ( j=0; j<$scope.techAnimations.length; j++){
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]].value = false;
            }

            $scope.animations[$scope.sides[i]]['blood'].value = false;
        }
        $scope.fightLoop();
    };

    //record onto the fight transcript
    $scope.record = function(msg){
        $scope.transcript[$scope.transIndex] = msg;
        $scope.transIndex++;

    };


    $scope.showAllSkills = function (side){
        $scope.show[side].skills = true;
        return;
    };

    $scope.hideAllSkills = function (side){
        $scope.show[side].skills = false;
        return;
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
/**--------------------------------- Dynamic UI END--------------------------------- **/

/**--------------------------------- API  --------------------------------- **/

    $scope.getAssetImg = function (art) {
        return gameAPIservice.assetPrefix() + "/img2/" + art + ".png";
    };

/**--------------------------------- API END--------------------------------- **/

/** End of functions**/



});
