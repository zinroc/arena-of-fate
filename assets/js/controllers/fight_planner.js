angular.module('App.controllers').controller('fightPlannerController', function ($scope, gameAPIservice, $timeout) {
    "use strict";

/**----------------------- INIT  -------------------**/
    
    /** CONSTANTS **/
    $scope.lowBloodReq = 5;
    $scope.highBloodReq = 10;
    /** CONSTANTS **/

    $scope.timers = {};
    $scope.timers.noInit = 0;

    $scope.techFumbles = {};
    $scope.activeTechniques = {};

    $scope.popoverTech = null;

    $scope.checklist = {};
    $scope.checklistItems = ['bloodiedDMGdone', 'bloodiedDMGtaken', 'blockedOnce', 'poison', 'holy', 'repeatInits',
                            'feintResolved', 'blocks', 'holyShield', 'holyTech'];
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

    $scope.activeTraits = {};

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
    $scope.modifiers = ['gassed', 'pinned', 'dazed', 'quit', 'unconscious', 'blood_lust_mod', 'blood_rage_mod', 
    'unstoppable_frenzy_mod', 'stunned', 'poisoned', 'poison_catalyst', 'mezmorized', 'blinded'];
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
    'jumping_strike', 'maul', 'burning_strike', 'suffication', 'venom_spit', 'cobra_strike', 'mezmorizing_gaze', 
    'prayer_of_fortitude', 'turtle', 'embarrass', 'overwhelm', 'brilliant_aura', 'evasive_strikes', 'taunt', 
    'advancing_wall', 'feint', 'divine_intervention', 'sewing_machine', 'divine_shield'];

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
            $scope.resetTechFumbles();

            $scope.movement();

            $scope.checkAnyTimeTechniques();
            $scope.checkPreInitTechniques();
            $scope.initiation();
            if ($scope.initiator){

                $scope.resolveInitiation();
                
                $scope.checkPostInitTechniques($scope.initiator, $scope.defender);
            } else if (!$scope.initiator){
                $scope.checkNoInitTechniques();
            }

            $scope.applyPoison();

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

            if($scope.popoverTech){
                $scope.updatePopover($scope.popoverTech.side, $scope.popoverTech.tech);
            }

            $timeout(function(){$scope.endAnimations();}, 1050);
        }
    };

    $scope.applyPoison = function (){
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];

            if ($scope.checklist[side].poison){
                var poison = parseInt($scope.checklist[side].poison);
                var damage = parseInt(poison/10);
                var oldDamage = damage;

                if ($scope.corner[side].poison_catalyst){
                    damage = 3*damage;
                    var msg = $scope.corner[side].name.toTitleCase() + "'s conscioussness loss due to poison increased from " + 
                    oldDamage + " to " + damage + " due to Poison Catalyst!";
                    $scope.record(msg);

                }

                $scope.vitals[side].consciousness -= damage;
                $scope.checklist[side].poison -= oldDamage;


                if ($scope.checklist[side].poison < 10){
                    $scope.checklist[side].poison = false;
                }
            }
        }
    };


    $scope.checkAnyTimeTechniques = function (){
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            $scope.checkTechTaunt(side);
            $scope.checkTechDivineIntervention(side);
        }
    };



    $scope.checkNoInitTechniques = function (){
        $scope.timers.noInit++;
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];

            $scope.checkTechPrayerOfFortitude($scope.sides[i]);
        }
    };
    $scope.checkPostInitTechniques = function (defender){

        $scope.checkTechSewingMachine(defender);

    };
    $scope.checkDuringInitTechniques = function (initiator, defender){
        //SKIP ABILITY Clause
        //If skipAbility, then technique has already been performed this cycle inside of checkTechFlying.
        var skipAbility = $scope.checkTechFlying(initiator);
        if (skipAbility!=='shield_smash'){
            $scope.checkTechShieldSmash(initiator);
        }
        if(skipAbility!=='jumping_strike'){
            $scope.checkTechJumpingStrike(initiator);
        }
        if(skipAbility!=='burning_strike'){
            $scope.checkTechBurningStrike(initiator);
        }
        if(skipAbility !=='venom_spit'){
            $scope.checkTechVenomSpit(initiator);
        }
        if(skipAbility !=='cobra_strike'){
            $scope.checkTechCobraStrike(initiator);
        }
        
        $scope.checkTechAdvancingWall(defender);
        
        $scope.checkTechMaul(initiator);

        $scope.checkTechSuffication(initiator);

        $scope.checkTechMezmorizingGaze(initiator);

        $scope.checkTechTurtle(defender);

        $scope.checkTechEmbarrass(initiator);

        $scope.checkTechOverwhelm(initiator);

        $scope.checkTechEvasiveStrikes(initiator);

        //check after all holy techniques
        $scope.checkTechBrilliantAura(initiator);

    };

    $scope.getConditionPercent = function (side, tech){
        var exp = parseInt(tech.exp);
        var bar = parseInt(parseInt(tech.technical_value)*33) + 33;
        var otherSide = $scope.otherSide(side);
        if (tech.name ==='mezmorizing_gaze'){
            bar += 33;
            var poisonMultiplier = $scope.poisonMultiplier($scope.checklist[otherSide].poison);
            if(poisonMultiplier > 1){
                exp += 33*poisonMultiplier;
            }
        }

        var percent = parseInt((exp/bar)*50);
        if(percent > 90){
            percent = 90;
        }
        return percent;
    };

    $scope.conditionCheck = function (side, tech, exp){
        var otherSide = $scope.otherSide(side);

        exp = parseInt(exp);
        var bar = parseInt(parseInt(tech.technical_value)*33*Math.random()) + 33*Math.random();

        var score = parseInt(Math.random()*exp);

        var msg ="";
        if (tech.name==='mezmorizing_gaze'){ // improve with poison

            bar += Math.random()*33;

            var multiplier = $scope.poisonMultiplier($scope.checklist[otherSide].poison);
            if (multiplier > 0){
                score += multiplier*33*Math.random();
                msg = "Poison makes " + $scope.corner[otherSide].name.toTitleCase() + 
                " more suseptable to Mezmorizing Gaze!";
                $scope.record(msg);
            }
        }

        if(score > bar){

            return true;
        } else if (tech.name !=='feint'){
            msg = $scope.corner[side].name.toTitleCase() + " fumbled attempting " + 
            tech.name.split('_').join(' ').toTitleCase();

            $scope.techFumbles[side][tech.name] = true;
            $scope.record(msg);
            return false;
        } else {
            $scope.techFumbles[side][tech.name] = true;

            console.log(score, bar, tech.name, side);
            return false;
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
    };

    $scope.checkTechAdvancingWall = function(side){
        var tech = $scope.checkTechActive(side, 'advancing_wall');

        if (tech){
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].advancing_wall = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].advancing_wall = false;
                return false;
            }
            //cardio check insinde @resolveAdvancingWall

            $scope.corner[side].advancing_wall = 2;

            return 'advancing_wall';
        } else {

            return false;
        }
    };

    $scope.checkTechBurningStrike = function(side){
        var tech = $scope.checkTechActive(side, 'burning_strike');

        if (tech){
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].burning_strike = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].burning_strike = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].jumping_strike = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }

            $scope.corner[side].burning_strike = 2;
            $scope.animations[side].burning_strike.value = true;

            $scope.checklist[side].holy++;
            $scope.checklist[side].holyShield++;
            $scope.checklist[side].holyTech = true;


            return 'burning_strike';
        } else {

            return false;
        }
    };


    $scope.checkTechMezmorizingGaze = function(side){
        var tech = $scope.checkTechActive(side, 'mezmorizing_gaze');
        var otherSide = $scope.otherSide(side);
        var msg = "";
        if (tech){
            
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].mezmorizing_gaze = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].mezmorizing_gaze = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].mezorizing_gaze = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }
            

            $scope.corner[side].mezmorizing_gaze = 15;
            $scope.corner[otherSide].mezmorized = true;
            $scope.animations[side].mezmorizing_gaze.value = true;
            msg = $scope.corner[otherSide].name.toTitleCase() + " is mezmorized!";
            $scope.record(msg);


            return 'mezmorizing_gaze';
        } else {

            return false;
        }
    };

    $scope.checkTechDivineIntervention = function(side){
        var tech = $scope.checkTechActive(side, 'divine_intervention');
        var msg = "";
        if (tech){
            //range check
            
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].divine_intervention = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].divine_intervention = false;
                return false;
            }
            //holy check
            if ($scope.checklist[side].holy < 10){
                $scope.corner[side].divine_intervention = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].divine_intervention = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }
            
            msg = "Divine Intervention restores " + $scope.corner[side].name.toTitleCase();
            $scope.record(msg);
            $scope.corner[side].divine_intervention = 2;
            $scope.animations[side].divine_intervention.value = true;

            $scope.checklist[side].holy = 0;
            $scope.checklist[side].holyTech = true;
            $scope.checklist[side].holyShield++;

            $scope.vitals[side].cardio = 1000;
            $scope.vitals[side].consciousness = 100;
            $scope.vitals[side].bloodied = 0;
            $scope.vitals[side].positioning = 30;
            //TODO get rid of injuries
            return 'divine_intervention';
        } else {
            return false;
        }
    };

    $scope.checkTechEmbarrass = function(side){
        var tech = $scope.checkTechActive(side, 'embarrass');
        var otherSide = $scope.otherSide(side);

        if(tech){
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].embarrass = false;
                return false;
            }
            //check if target pinned
            if (!$scope.corner[otherSide].pinned){
                $scope.corner[side].embarrass = false;
                return false;
            }
            //check you are not pinned
            if ($scope.corner[side].pinned){
                $scope.corner[side].embarrass = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].embarrass = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].embarrass = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }

            $scope.corner[side].embarrass = 2;
            $scope.animations[side].embarrass.value = true;

            return 'embarrass';
        } else {
            return false;
        }
    };

    $scope.checkTechShieldSmash = function(side){
        var tech = $scope.checkTechActive(side, 'shield_smash');

        if (tech){
            
            //range check
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].shield_smash = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].shield_smash = false;
                return false;
            }
            //cardio check done when resolved
            

            $scope.corner[side].shield_smash = 2;

            return 'shield_smash';
        } else {

            return false;
        }
    };


    $scope.checkTechBrilliantAura = function(side){
        var tech = $scope.checkTechActive(side, 'brilliant_aura');

        var otherSide = $scope.otherSide(side);
        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].brilliant_aura = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].brilliant_aura = false;
                return false;
            }
            //holy check
            if(!$scope.checklist[side].holyTech){
                $scope.corner[side].brilliant_aura = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].brilliant_aura = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;
            }
            var msg = "Brilliant Aura blinds " + $scope.corner[otherSide].name.toTitleCase() + 
            "!";
            $scope.record(msg);
            $scope.corner[side].brilliant_aura = 15;
            $scope.animations[side].brilliant_aura.value = true;

            $scope.corner[otherSide].blinded = true;

            $scope.checklist[side].holy++;
            $scope.checklist[side].holyShield++;
            return 'brilliant_aura';
        } else {
            return false;
        }

    };

    $scope.checkTechSewingMachine = function(side){
        var tech = $scope.checkTechActive(side, 'sewing_machine');

        if (tech){
            console.log(side, "SEWING MACHINE");
            
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].sewing_machine = false;
                return false;
            }

            //sufficient blocks check
            if ($scope.checklist[side].blocks < 3){
                $scope.corner[side].sewing_machine = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].sewing_machine = false;
                return false;
            }

            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].sewing_machine = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;
            }
            
            $scope.corner[side].sewing_machine = 2;

            $scope.resolveSewingMachine(side);

            return 'sewing_machine';
        } else {
            return false;
        }
    };

    $scope.resolveSewingMachine = function(side){
        var otherSide = $scope.otherSide(side);
        var msg = "";
        var time = "";
        $scope.initiator = side;
        $scope.defender = otherSide;
        for (var i=0; i<3; i++){
            $scope.animations[side].sewing_machine.value = true;
            $scope.animations[side].initiator.value = false;

            if (i===0){
                time = "1st";
            }
            if (i===1){
                time = "2nd";
            }
            if (i===2){
                time = "3rd";
            }
            msg = $scope.corner[side].name.toTitleCase() + " does the " + time + " strike of the Sewing Machine!";
            $scope.record(msg);
            $scope.resolveInitiation();
            $timeout(function(){$scope.endAnimationsGeneral();}, 1050);

        }
    };

    $scope.checkTechEvasiveStrikes = function(side){
        var tech = $scope.checkTechActive(side, 'evasive_strikes');

        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].evasive_strikes = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].evasive_strikes = false;
                return false;
            }
            //subsequently initiate 2 times
            if ($scope.checklist[side].repeatInits < 2){
                $scope.corner[side].evasive_strikes = false;
                return false;
            }
            //cardio check done in resolveEvasiveStrikes
            $scope.corner[side].evasive_strikes = 2;

            return 'evasive_strikes';
        } else {
            return false;
        }

    };

    $scope.checkTechOverwhelm = function(side){
        var tech = $scope.checkTechActive(side, 'overwhelm');

        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].overwhelm = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].overwhelm = false;
                return false;
            }
            //subsequently initiate 6 times
            if ($scope.checklist[side].repeatInits < 6){
                $scope.corner[side].overwhelm = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].overwhelm = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;
            }

            $scope.corner[side].overwhelm = 2;
            $scope.animations[side].overwhelm.value = true;

            return 'overwhelm';
        } else {
            return false;
        }

    };

    $scope.checkTechfeint = function(side){
        var tech = $scope.checkTechActive(side, 'feint');

        var otherSide = $scope.otherSide(side);
        var msg = "";
        if (tech){

            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].feint = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].feint = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].feint = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }

            $scope.corner[side].feint = 2;
            $scope.animations[side].feint.value = true;

            msg = $scope.corner[side].name.toTitleCase() + " feints ";
            $scope.record(msg);

            $scope.resolvefeint(side, otherSide);

            return 'feint';
        } else {
            return false;
        }

    };

    $scope.resolvefeint = function(feinter, feinted){
        var reflexScore = $scope.getReflexScore(feinted);
        var msg ="";
        var bar = 50*Math.random();
        if (reflexScore < bar){
            $scope.initiator = feinted;
            $scope.defender = feinter;
            msg = $scope.corner[feinted].name.toTitleCase() + " tried to counter the feint and initiated instead";
            $scope.record(msg);
            $scope.resolveInitiation();
            $scope.checklist[feinter].feintResolved = true;

            $timeout(function(){$scope.endAnimationsGeneral();}, 1050);
        }
    };

    $scope.checkTechTaunt = function(side){
        var tech = $scope.checkTechActive(side, 'taunt');

        var otherSide = $scope.otherSide(side);
        var msg = "";
        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].taunt = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].taunt = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].taunt = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }

            $scope.corner[side].taunt = 2;
            $scope.animations[side].taunt.value = true;

            msg = $scope.corner[side].name.toTitleCase() + " taunts " + $scope.corner[otherSide].name.toTitleCase();
            $scope.record(msg);

            return 'taunt';
        } else {
            return false;
        }

    };

    $scope.checkTechJumpingStrike = function(side){
        var tech = $scope.checkTechActive(side, 'jumping_strike');

        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].jumping_strike = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].jumping_strike = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].jumping_strike = false;
            } else {
                $scope.vitals[side].cardio -= tech.cardio_cost;

            }

            $scope.corner[side].jumping_strike = 2;
            $scope.animations[side].jumping_strike.value = true;
            $scope.animations[side].initiator.value = false;


            return 'jumping_strike';
        } else {
            return false;
        }

    };

    $scope.checkTechFlying = function(side){
        for(var i=0; i<$scope.allSlots.length; i++){
            var tech = $scope.getTech($scope.activeTechniques[side][$scope.allSlots[i]].id);
            if(tech.name==='flying'){
                tech.exp = $scope.activeTechniques[side][$scope.allSlots[i]].exp;
                //range check 
                
                if (!$scope.rangeCheck(tech)){
                    $scope.corner[side].flying = false;
                    return false;
                }
                //conditioning check
                if (!$scope.conditionCheck(side, tech, tech.exp)){
                    $scope.corner[side].flying = false;
                    return false;
                }
                //cardio check 
                if (!$scope.cardioCheck(side, tech.cardio_cost)){
                    $scope.corner[side].flying = false;
                } else {
                    $scope.vitals[side].cardio -= tech.cardio_cost;
                }
                
                $scope.animations[side].flying.value = true;

                $scope.corner[side].flying = 2;

                $scope.changeDistance(80);

                var ability = $scope.findFlyAbility(side);
                if(ability){
                    return ability;
                } else {
                    $scope.changeDistance(50);
                }
                ability = $scope.findFlyAbility(side);
                if(ability){
                    return ability;
                } else {
                    $scope.changeDistance(1);
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
    };

    $scope.findFlyAbility = function (side){
        var result = false;
        result = $scope.checkTechShieldSmash(side);

        if(!result){
            result = $scope.checkTechCobraStrike(side);
        }

        if (!result){
            result = $scope.checkTechJumpingStrike(side);
        }

        if (!result){
            result = $scope.checkTechBurningStrike(side);
        }

        if (!result){
            result = $scope.checkTechVenomSpit(side);
        }

        return result;
    };

    $scope.cardioCheck = function (side, cardio_cost){
        var cardioCost = parseInt(cardio_cost);

        cardioCost = 33*cardioCost;
        if ($scope.vitals[side].cardio < cardioCost){
            return false;
        } else {
            return true;
        }
    };

    $scope.rangeCheck = function (tech){
        var distance = $scope.distnaceBackConverter($scope.distance);
        var range = parseInt(tech.range);
        if (range===3 || range === distance){
            return true;
        } else {
            return false;
        }
    };

    $scope.checkListBloodiedDMGdoneLarge = function(side){
        if ($scope.checklist[side]['bloodiedDMGdone'] > $scope.highBloodReq) {
            return true;
        } else {
            return false;
        }
    };

    $scope.checkListBloodiedDMGtakenLarge = function(side){
        if ($scope.checklist[side]['bloodiedDMGtaken'] > $scope.highBloodReq) {
            return true;
        } else {
            return false;
        }
    };

    $scope.checkListBloodiedDMGdone = function(side){
        if ($scope.checklist[side]['bloodiedDMGdone'] > $scope.lowBloodReq) {
            return true;
        } else {
            return false;
        }
    };

    $scope.checkListBloodiedDMGtaken = function(side){
        if ($scope.checklist[side]['bloodiedDMGtaken'] > $scope.lowBloodReq) {
            return true;
        } else {
            return false;
        }
    };
    /**
    * target 'red' / 'blue' -> side taking damage
    */
    $scope.checkTechBloodLust = function (side, bloodiedDMG){
        //check if target () has applicable technique
        var tech = $scope.checkTechActive(side, 'blood_lust');

        if(tech){

            //check if significant bloodied damage
            if (!$scope.checkListBloodiedDMGdone(side)){
                $scope.corner[side].blood_lust = false;
                return;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].blood_lust = false;
                return;
            }


            $scope.animations[side].blood_lust.value = true;

            $scope.corner[side].blood_lust = 100; // bloodlust is reset when an attack is dodged
            $scope.corner[side].blood_lust_mod = true;
            var msg = $scope.corner[side].name.toTitleCase() + " enters Blood Lust!";
            $scope.record(msg);
        } else {
            return false;
        }

    };

    $scope.resolveUnstoppableFrenzy = function (side, bloodiedDMG){
        var tech = $scope.checkTechActive(side, 'unstoppable_frenzy');
        if (tech){
            var msg = "";
            var maxCardio = 0;
            var oldCardio = 0;
            
            //check if blood_rage or blood_lust is active
            if(!$scope.corner[side].blood_rage_mod && !$scope.corner[side].blood_lust_mod){
                return;
            }

            //check if significant bloodied damage
            if (bloodiedDMG < $scope.highBloodReq){
                return;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                return;
            }
            

            $scope.animations[side].unstoppable_frenzy.value = true;
            $scope.corner[side].unstoppable_frenzy = 20;
            $scope.corner[side].unstoppable_frenzy_mod = true;

            oldCardio = $scope.vitals[side].cardio;
            maxCardio = 100 + $scope.getSkill(side, 'endurance')*10;
            $scope.vitals[side].cardio = maxCardio;

            msg = $scope.corner[side].name.toTitleCase() + " recovers " + (maxCardio - oldCardio) + 
                " cardio and enters an Unstoppable Frenzy!";
            $scope.record(msg);
        }
    };

    $scope.checkTechUnstoppableFrenzy = function (target, targeter, bloodiedDMG){
        $scope.resolveUnstoppableFrenzy(target, bloodiedDMG);
        $scope.resolveUnstoppableFrenzy(targeter, bloodiedDMG);
        
    };

    /**
    * target 'red' / 'blue' -> side taking damage
    */
    $scope.checkTechBloodRage = function (side, bloodiedDMG){
        //check if target () has applicable technique
        var tech = $scope.checkTechActive(side, 'blood_rage');

        if(tech){
            //check if significant bloodied damage
            
            if (!$scope.checkListBloodiedDMGtaken(side)){
                $scope.corner[side].blood_rage = false;
                $scope.corner[side].blood_rage_mod = false;
                return;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].blood_rage = false;
                $scope.corner[side].blood_rage_mod = false;
                return;
            }
            

            $scope.animations[side].blood_rage.value = true;

            $scope.corner[side].blood_rage = 15;
            $scope.corner[side].blood_rage_mod = true;
            var msg = $scope.corner[side].name.toTitleCase() + " enters Blood Rage!";
            $scope.record(msg);
        } else {
            return false;
        }
    };

    $scope.vulnerableCheck = function (side){
        if ($scope.corner[side].stunned ||  $scope.corner[side].dazed || $scope.corner[side].pinned){
            return true;
        } else {
            return false;
        }
    };

    $scope.checkTechCobraStrike = function (side){
       var otherSide = $scope.otherSide(side);

        var tech = $scope.checkTechActive(side, 'cobra_strike');

        if (tech){
            
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].cobra_strike = false;
                return false;
            }
            //vulnerable check 
            if (!$scope.vulnerableCheck(otherSide)){
                $scope.corner[side].cobra_strike = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].cobra_strike = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].cobra_strike = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }
        
            $scope.animations[side].cobra_strike.value = true;
            $scope.corner[side].cobra_strike = 2;
            $scope.changeDistance(1);

            var msg = $scope.corner[side].name.toTitleCase() + " Cobra Strikes into close range!";
            $scope.record(msg);

            return 'cobra_strike'; //name STRING used inside  checkTechFlying
        } else {
            return false;
        }

    };

    $scope.checkTechPrayerOfFortitude = function (side){
        var tech = $scope.checkTechActive(side, 'prayer_of_fortitude');

        if (tech){
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].prayer_of_fortitude = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].prayer_of_fortitude = false;
                return false;
            }
            //no Init check 
            if ($scope.timers.noInit < 3){
                $scope.corner[side].prayer_of_fortitude = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].prayer_of_fortitude = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }
            $scope.animations[side].prayer_of_fortitude.value = true;
            $scope.corner[side].prayer_of_fortitude = 2;

            var healing = $scope.timers.noInit;

            $scope.vitals[side].consciousness = Math.min(100, ($scope.vitals[side].consciousness + healing));

            var msg = $scope.corner[side].name.toTitleCase() + "'s Prayer of Fortitude heals " + 
            healing + " consciousness";
            $scope.record(msg);

            $scope.checklist[side].holy++;
            $scope.checklist[side].holyTech = true;
            $scope.checklist[side].holyShield++;

            return 'prayer_of_fortitude'; //name STRING used inside  checkTechFlying
        }
    };

    $scope.checkTechVenomSpit = function (side){
       var otherSide = $scope.otherSide(side);

        var tech = $scope.checkTechActive(side, 'venom_spit');

        if (tech){
            
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].venom_spit = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].venom_spit = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].venom_spit = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }
            
            $scope.animations[side].venom_spit.value = true;
            $scope.corner[side].venom_spit = 2;

            return 'venom_spit'; //name STRING used inside  checkTechFlying
        } else {
            return false;
        }

    };

    $scope.checkTechSuffication = function (side){
       var otherSide = $scope.otherSide(side);

        var tech = $scope.checkTechActive(side, 'suffication');

        if (tech){
            //check pinned
            if (!$scope.corner[otherSide].pinned){
                $scope.corner[side].suffication = false;
                return false;
            }
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].suffication = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].suffication = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].suffication = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }
            $scope.animations[side].suffication.value = true;
            $scope.corner[side].suffication = 2;

            return 'suffication'; //name STRING used inside  checkTechFlying, NA here
        } else {
            return false;
        }

    };

    $scope.checkTechTurtle = function (side){
       var otherSide = $scope.otherSide(side);

        var tech = $scope.checkTechActive(side, 'turtle');

        if (tech){
            
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].turtle = false;
                return false;
            }
            //check gassed
            if (!$scope.corner[side].gassed){
                $scope.corner[side].turtle = false;
                return false;
            }

            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].turtle = false;
                return false;
            }
            
            $scope.animations[side].turtle.value = true;
            $scope.corner[side].turtle = 2;

            return 'turtle';
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
                return false;
            }
            //range check 
            if (!$scope.rangeCheck(tech)){
                $scope.corner[side].maul = false;
                return false;
            }
            //conditioning check
            if (!$scope.conditionCheck(side, tech, tech.exp)){
                $scope.corner[side].maul = false;
                return false;
            }
            //cardio check
            if (!$scope.cardioCheck(side, tech.cardio_cost)){
                $scope.corner[side].maul = false;
                return false;
            } else {
                $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
            }
            
            $scope.animations[side].maul.value = true;
            $scope.corner[side].maul = 2;


            return 'maul';
        } else {
            return false;
        }

    };

    $scope.resetTechFumbles = function (){
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];

            $scope.techFumbles[side] = {};

            for (var j=0; j<$scope.techniques.length; j++){
                var tech = $scope.techniques[j];

                $scope.techFumbles[side][tech.name] = false;

            }
        }
    };

    $scope.checkPreInitTechniques = function (){
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            $scope.checkTechfeint(side);
        }
    };

    $scope.resetTechniques = function (){
        for(var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            for (var j=0; j<$scope.allSlots.length; j++){
                var slot = $scope.allSlots[j];
                if($scope.corner[side][$scope.activeTechniques[side][slot].name] < 2 && 
                    $scope.corner[side][$scope.activeTechniques[side][slot].name]){
                    $scope.corner[side][$scope.activeTechniques[side][slot].name] = false;
                    if ($scope.activeTechniques[side][slot].name==='unstoppable_frenzy'){
                        var cardio = $scope.vitals[side].cardio;
                        $scope.vitals[side].cardio = 0;
                        var msg = $scope.corner[side].name.toTitleCase() + " loses " + cardio + 
                        " cardio when leaving an Unstoppable Frenzy";
                        $scope.record(msg);
                        $scope.corner[side].unstoppable_frenzy_mod = false;
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

        if($scope.corner[side].mezmorized){
            nextMovement = 0;
        }

        var injuryMod = $scope.getInjuryMod(side, 'legs') * $scope.getInjuryMod(side, 'feet');

        if ($scope.corner[side].stunned){
            nextMovement = 0;
        }

        return parseInt(nextMovement*injuryMod);

    };

    $scope.changeDistance = function (amount){
        $scope.distance = amount;
    };

    // fighter movement within a round
    $scope.movement = function (){
        for (var i=0; i<$scope.sides.length; i++){

            if(!$scope.corner[$scope.sides[i]].pinned) {
                $scope.corner[$scope.sides[i]].nextMovement = $scope.getMovement($scope.sides[i]);
            }
        }

        for (i=0; i<$scope.sides.length; i++){
            var newDistance = $scope.distance + $scope.corner[$scope.sides[i]].nextMovement;
            $scope.changeDistance(newDistance);
        }


    };

    // non-fight parameters that are set when a new round is started
    $scope.initializeRound = function (){
        $scope.distance = 100;
        for(var i=0; i<$scope.sides.length; i++){
            $scope.corner[$scope.sides[i]].status = 'art';
        }
    };


    $scope.resetChecklist = function (){
        for (var i=0; i<$scope.sides.length; i++){
            $scope.checklist[$scope.sides[i]] = {};
            for (var j=0; j<$scope.checklistItems.length; j++){
                $scope.checklist[$scope.sides[i]][$scope.checklistItems[j]] = false;
            }
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

        $scope.resetChecklist();
        $scope.resetTechFumbles();
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
            $scope.corner[$scope.sides[i]].poisoned = false;
            $scope.corner[$scope.sides[i]].quit = false;
            $scope.corner[$scope.sides[i]].unconscious = false;
            $scope.corner[$scope.sides[i]].poison_catalyst = false;
            $scope.corner[$scope.sides[i]].mezmorized = false;
            $scope.corner[$scope.sides[i]].blinded = false;
            $scope.corner[$scope.sides[i]].unstoppable_frenzy_mod = false;
            $scope.corner[$scope.sides[i]].blood_lust = false;
            $scope.corner[$scope.sides[i]].blood_rage = false;


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

            $scope.animations[$scope.sides[i]].blood = {};
            $scope.animations[$scope.sides[i]].blood.value = false;

            for( j=0; j<$scope.techAnimations.length; j++){
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]] = {};
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]].value = false;
            }

        }

        $scope.setBarValues();
    };

    //determine how much closer a fighter is to initiating this cycle in fightLoop
    $scope.initIncrease = function (side){

        var otherSide = $scope.otherSide(side);
        var optimalDistance = $scope.distanceConversion($scope.strat[side].range);
        var range = Math.abs(optimalDistance - $scope.distance);
        var rangeMod = (100-range)/(100);
        var tauntMod = 1;
        if ($scope.corner[otherSide].taunt){
            tauntMod = 1.5;
        }
        var barbMod = 1;
        if($scope.activeTraits[side].name ==='barbarian' && $scope.checklist[side].repeatInits > 0){
            barbMod += $scope.checklist[side].repeatInits/10;
            var msg = $scope.corner[side].name.toTitleCase() + " accelorates initiation rate by " + barbMod + "x!";
            $scope.record(msg);
        }


        var increase = parseInt(barbMod*tauntMod*rangeMod*$scope.heightConversion($scope.strat[side].initiation_frequency));
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

        if($scope.corner[side].blood_rage_mod){
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
        var msg ="";
        for (var i=0; i<$scope.sides.length; i++){
            var side = $scope.sides[i];
            $scope.updateStatuses($scope.sides[i]);
            if(!$scope.corner[$scope.sides[i]].gassed && !$scope.corner[$scope.sides[i]].pinned){
                $scope.corner[$scope.sides[i]].initiationScore += $scope.initIncrease($scope.sides[i]);
                $scope.vitals[$scope.sides[i]].cardio -= $scope.idleCardioPayment($scope.sides[i]);
            } else if($scope.corner[$scope.sides[i]].gassed) {
                $scope.stallForCardio($scope.sides[i]);

                if ($scope.activeTraits[side].name==='orcish' && $scope.vitals[side].positioning > 0){
                    $scope.corner[$scope.sides[i]].initiationScore += $scope.initIncrease(side);
                    $scope.vitals[side].positioning -= 5;
                    msg = $scope.corner[side].name.toTitleCase() + " compromises positioning to initiate!";
                    $scope.record(msg);
                }
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
            msg = $scope.corner[$scope.initiator].name + " initiates";
            $scope.record(msg);
            $scope.checklist[$scope.initiator].repeatInits++;
            $scope.checklist[$scope.defender].repeatInits = 0;

            $scope.corner[$scope.initiator].feint = false;
            $scope.animations[$scope.initiator].feint.value = false;
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
        var msg ="";
        var oldBase = null;
        //tech Blood Lust
        if($scope.corner[side].blood_lust_mod){
            var oldStrength = strength;
            strength = parseInt(strength*1.5);

            msg = $scope.corner[side].name.toTitleCase() + " gains " + (strength - oldStrength) + 
            " bonus strength under the effect of Blood Lust!";
            $scope.record(msg);

        }


        var base = parseInt((strength + speed) / 2);

        //tech Flying
        if ($scope.corner[side].flying){
            oldBase = base;

            base = parseInt(base*1.4);

            msg = $scope.corner[side].name.toTitleCase() + " gains " + (base - oldBase) + 
            " bonus power under the effect of Flying!";
            $scope.record(msg);
        }

        if ($scope.corner[side].maul){
            oldBase = base;

            base = parseInt(base*1.2);

            msg = $scope.corner[side].name.toTitleCase() + " gains " + (base - oldBase) + 
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

        if($scope.corner[side].blinded){
            base -=50;
        }

        if(base < 5){
            base = 5;
        }

        var injuryMod = $scope.getInjuryMod(side, 'eyes');

        return parseInt(base*Math.random()*injuryMod);
    };

    $scope.getEvasionScore = function (side){
        var base = $scope.getSkill(side, 'evasion');

        var otherSide = $scope.otherSide(side);

        if($scope.corner[side].gassed){
            base -= 90;
        }

        if($scope.corner[side].mezmorized){
            base -=50;
        }

        if(base < 5){
            base = 5;
        }

        if ($scope.corner[otherSide].overwhelm){
            base = 0;
        }

        return parseInt(base*Math.random());
    };

    $scope.getReflexScore = function (side){
        var otherSide = $scope.otherSide(side);
        var base = $scope.getSkill(side, 'reflex');
        var msg = "";
        if($scope.corner[side].gassed){
            //tech turtle
            if($scope.corner[side].turtle){
                base +=10;
                msg = $scope.corner[side].name.toTitleCase() + " turtles while gassed increasing block chance";
                $scope.record(msg);
            } else {
                base -= 90;
            }

        }

        if ($scope.corner[side].feint && !$scope.checklist[side].feintResolved){
            base += 25;
            msg = $scope.corner[side].name.toTitleCase() + " gain "+ 25 +" reflex";

        }

        if($scope.corner[side].blinded){
            base -=50;
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

        if ($scope.corner[otherSide].overwhelm){
            base = 0;
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

        $scope.timers.noInit = 0;
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
        if ($scope.corner[$scope.initiator].overwhelm){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " is overwhelmed and cannot block or dodge!";
            $scope.record(msg);
        }

        if($scope.corner[$scope.defender].gassed){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " looks gassed";
            $scope.record(msg);
        }

        if (accuracyScore < evasionScore){


            msg = $scope.corner[$scope.defender].name.toTitleCase() + " dodges attack";

            var arrayOfDodges = $scope.turnOffDodgeableTechniques();
            for (var i=0; i<arrayOfDodges.length; i++){
                msg += " and " + arrayOfDodges[i].split('_').join(' ').toTitleCase();
            }
            $scope.record(msg);
            $scope.corner[$scope.defender].dodged = true;



        } else if ($scope.corner[$scope.initiator].jumping_strike){
            $scope.resolveJumpingStrike($scope.initiator);
        } else if ($scope.corner[$scope.initiator].suffication){
            $scope.resolveSuffication($scope.initiator, powerScore);
        }

        if (speedScore < reflexScore){
            msg = $scope.corner[$scope.defender].name + " manages to react";
            $scope.record(msg);
            $scope.corner[$scope.defender].blocked = true;
            $scope.checklist[$scope.defender].blocks++;
            //tech shield_smash
            if($scope.corner[$scope.initiator].shield_smash){

                $scope.resolveShieldSmash($scope.initiator);
            }
        } else {
            $scope.checklist[$scope.defender].blocks = 0;
        }


        if ($scope.corner[$scope.defender].dodged && $scope.corner[$scope.defender].blocked){
            if ($scope.corner[$scope.initiator].sewing_machine){
                //check counter block
                var counterReflexScore = $scope.getReflexScore($scope.initiator);
                var counterSpeedScore = $scope.getSpeedScore($scope.defender);
                if(counterReflexScore > counterSpeedScore){
                    $scope.checklist[$scope.initiator].blocks++;
                    msg = $scope.corner[$scope.initiator].name.toTitleCase() + " blocks the counter attack to the Sewing Machine!";
                    $scope.record(msg);
                } else {
                    $scope.evaluateCounter($scope.defender, reflexScore, speedScore);
                }
            } else {
                $scope.evaluateCounter($scope.defender, reflexScore, speedScore);
            }
        } else if ($scope.corner[$scope.defender].dodged){
            $scope.evaluateDodge($scope.defender);
        } else if ($scope.corner[$scope.defender].blocked){
            $scope.evaluateBlock($scope.defender, reflexScore, speedScore, powerScore);
        } else {
            $scope.dealDamage($scope.defender, powerScore);
        }


        return;
    };

    $scope.turnOffBlockableTechniques = function (side){
        var result = [];
        if ($scope.corner[side].blood_lust){
            $scope.corner[$scope.initiator].blood_lust = false;
            $scope.corner[$scope.initiator].blood_lust_mod = false;

        }
        if ($scope.corner[side].burning_strike){
            $scope.corner[$scope.initiator].burning_strike = false;
            result.push('burning_strike');
        }
        if ($scope.corner[side].venom_spit){
            $scope.corner[$scope.initiator].venom_spit = false;
            result.push('venom_spit');
        }
        if ($scope.corner[side].cobra_strike){
            $scope.corner[$scope.initiator].cobra_strike = false;
            result.push('cobra_strike');
        }
        return result;
    };

    $scope.turnOffDodgeableTechniques = function (){
        var result = [];
        if ($scope.corner[$scope.initiator].blood_lust){
            $scope.corner[$scope.initiator].blood_lust = false;
            $scope.corner[$scope.initiator].blood_lust_mod = false;

        }
        if ($scope.corner[$scope.initiator].jumping_strike){
            $scope.corner[$scope.initiator].jumping_strike = false;
            result.push('jumping_strike');
        }
        if ($scope.corner[$scope.initiator].maul){
            $scope.corner[$scope.initiator].maul = false;
            result.push('maul');
        }
        if ($scope.corner[$scope.initiator].burning_strike){
            $scope.corner[$scope.initiator].burning_strike = false;
            result.push('burning_strike');
        }
        if ($scope.corner[$scope.initiator].suffication){
            $scope.corner[$scope.initiator].suffication = false;
            result.push('suffication');
        }
        if ($scope.corner[$scope.initiator].venom_spit){
            $scope.corner[$scope.initiator].venom_spit = false;
            result.push('venom_spit');
        }
        if ($scope.corner[$scope.initiator].cobra_strike){
            $scope.corner[$scope.initiator].cobra_strike = false;
            result.push('cobra_strike');
        }

        return result;
    };

    $scope.resolveCobraStrike = function (side, blood){
        var otherSide = $scope.otherSide(side);
        var msg = "";
        //pin
        if($scope.vitals[otherSide].positioning > -10 || !$scope.corner[otherSide].pinned){
            msg += "  Cobra Strike pins " + $scope.corner[otherSide].name.toTitleCase();
            $scope.vitals[otherSide].positioning = -10;
            $scope.corner[otherSide].pinned = true;
        } 
        if (blood < 1){
            msg += $scope.corner[side].name.toTitleCase() + " but the poison catalyst does not enter the blood stream";
        } else {
            $scope.corner[otherSide].poison_catalyst = true;
            msg += " and releases a poison catalyst  " + $scope.corner[otherSide].name.toTitleCase() + 
            "'s blood stream increasing poison damage 3x!";
        }
        $scope.record(msg);


        return;
    };



    $scope.resolveVenomSpit = function (side, blood){
        var otherSide = $scope.otherSide(side);
        var msg = "";
        var currentPoison = $scope.checklist[otherSide].poison;
        if (blood < 1){
            msg = $scope.corner[side].name.toTitleCase() + "'s venom spit did not enter the blood stream";
            $scope.record(msg);
        } else {
            var poison = 20;

            if (currentPoison){
                var vulnerability =  $scope.poisonMultiplier(currentPoison);
                poison = parseInt(poison*(vulnerability+1));
                msg = $scope.corner[otherSide].name.toTitleCase() + " is already vulnerable to poison inceasing its effect by " +
                 (vulnerability+1) + "x! ";
                // do not record yet.

                $scope.checklist[otherSide].poison += poison;
            } else {
                msg = $scope.corner[otherSide].name.toTitleCase() + "'s poison vulnerability increases! ";
                //do not record yet
                $scope.checklist[otherSide].poison = poison;
            }
            $scope.corner[otherSide].poisoned = true;
            msg += $scope.corner[side].name.toTitleCase() + "'s Venom Spit deals " + poison + " poison damage!";
            $scope.record(msg);
            //damage is evaluated over time.
        }
        return;
    };

    $scope.poisonMultiplier = function (poison){
        if(!poison){
            return 0;
        }
        poison = parseInt(poison);
        return Math.floor(poison/10);
    };

    $scope.resolveEvasiveStrikes = function(side){
        var msg = $scope.corner[side].name.toTitleCase() + " evades the counter strike!";
        $scope.record(msg);
        $scope.animations[side].evasive_strikes.value = true;
        //cardio check
        if (!$scope.cardioCheck(side, tech.cardio_cost)){
            $scope.corner[side].evasive_strikes = false;
            return false;
        } else {
            $scope.vitals[side].cardio -= tech.cardio_cost;
        }

        return true;
    };

    $scope.resolveSuffication = function(side, power){
        var otherSide = $scope.otherSide(side);

        var damage = parseInt(power);

        var msg = "";
        if($scope.checklist[otherSide].poison){
            //increase damage.
            var vulnerability = $scope.poisonMultiplier($scope.checklist[otherSide].poison);
            damage = damage*vulnerability;

            msg += $scope.corner[otherSide].name.toTitleCase() + " is poisoned increasing damage by " + vulnerability + "x! ";
        }
        $scope.vitals[otherSide].cardio -= damage;

        msg += $scope.corner[side].name.toTitleCase() + "'s suffication does " + damage + " cardio damage!";
        $scope.record(msg);
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

        var msg = $scope.corner[side].name.toTitleCase() + " stuns with "+ abilityName +" Strike";
        $scope.record(msg);
    };

    $scope.resolveShieldSmash = function(side){

        var otherSide = $scope.otherSide(side);

        $scope.checklist[otherSide].blockedOnce = true;

        if (!$scope.cardioCheck(side, 1)){
            $scope.corner[side].shield_smash = false;
        } else {
            $scope.vitals[side].cardio -= 33;

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
        }

        return;
    };

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


        var msg = "";
        var blockScore = parseInt($scope.getPowerScore(blocker)*windowSize);
        if (blockScore < power){
            if ($scope.activeTechniques[blocker].name==='holy' && $scope.checklist[blocker].holyShield > 0){
                var difference = power - blockScore;
                var reduction = Math.min(difference, $scope.checklist[blocker].holyShield*10);

                $scope.checklist[blocker].holyShield -= reduction/10;

                blockScore += reduction;
                msg = $scope.corner[side].name.toTitleCase() + "'s divine shield adsorbes " + reduction + 
                " damage";
                $scope.record(msg);
                $scope.animations[blocker].divine_shield = true;
           }
        }
        if (blockScore > power){
            msg = $scope.corner[$scope.defender].name.toTitleCase() + " fully blocks the attack";

            var arrayOfBlocks = $scope.turnOffBlockableTechniques(attacker);
            for (var i=0; i<arrayOfBlocks.length; i++){
                msg += " and " + arrayOfBlocks[i].split('_').join(' ').toTitleCase();
            }

            if($scope.corner[blocker].advancing_wall){
                $scope.resolveAdvancingWall(blocker);
            }

            $scope.record(msg);


        } else {
            msg = $scope.corner[blocker].name.toTitleCase() + " blocks " + (power-blockScore) + " damage.";
            $scope.record(msg);
            $scope.dealDamage($scope.defender, power-blockScore);
        }

        $scope.evaluateCounter(blocker, reflex, speed);

    };

    $scope.resolveAdvancingWall = function (side){
        var msg = "";
        var otherSide = $scope.otherSide(side);
        if (!$scope.cardioCheck(side, tech.cardio_cost)){
            $scope.corner[side].advancing_wall = false;
            return false;
        } else {
            $scope.vitals[side].cardio -= parseInt(33*tech.cardio_cost);
        }
        var positioningDMG = parseInt(Math.random()*20 + 10); 
        $scope.vitals[otherSide].positioning -= positioningDMG;

        msg = $scope.corner[side].name.toTitleCase() + " blocks and advances to close range dealing " +
        positioningDMG + " positioning damage!";

        $scope.animations[side].advancing_wall.value = true;
        $scope.animations[side].block.value = false;
        $scope.changeDistance(1);

        $scope.record(msg);

        return;

    };

    //dodging negates all damage
    $scope.evaluateDodge = function (dodger){
        return;
    };
    //counter may happen after block
    $scope.evaluateCounter = function(counterer, reflex, speed){
        var otherSide = $scope.otherSide(counterer);
        var msg ="";


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

            if ($scope.activeTraits[counterer].name==='diciplined'){
                var multiplier = 1 + ($scope.checklist[counterer].blocks/10);
                counterDMG = parseInt(counterDMG*multiplier);
                if (multiplier > 1){
                    msg = $scope.corner[counterer].name.toTitleCase() + "'s diciplined blocks increases counter damage by " + 
                    multiplier + "x";
                    $scope.record(msg);
                }
            }

            if (counterDMG > 0){
                $scope.corner[counterer].counter = true;
                $scope.corner[counterer].feint = false;
                $scope.animations[counterer].feint.value = false
            }

            if($scope.corner[otherSide].evasive_strikes){
                if ($scope.resolveEvasiveStrikes(otherSide)){
                    return;
                }
            }

            var damage = $scope.dealDamage($scope.initiator, counterDMG);
            $scope.vitals[counterer].cardio -= parseInt($scope.idleCardioPayment(counterer)/2);

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
            $scope.checklist[$scope.sides[i]].bloodiedDMGtaken = false;
            $scope.checklist[$scope.sides[i]].bloodiedDMGdone = false;
            $scope.checklist[$scope.sides[i]].blockedOnce = false;
            
            if (!$scope.corner[otherSide].jumping_strike){
                $scope.corner[$scope.sides[i]].stunned = false;
            }
            if (!$scope.checklist[$scope.sides[i]].poison){
                $scope.corner[$scope.sides[i]].poisoned = false;
            }
            if (!$scope.corner[$scope.sides[i]].pinned){
                $scope.corner[$scope.sides[i]].poison_catalyst = false;
            }
            if (!$scope.corner[otherSide].mezmorizing_gaze){
                $scope.corner[$scope.sides[i]].mezmorized = false;
            }
            if(!$scope.corner[otherSide].brilliant_aura){
                $scope.corner[$scope.sides[i]].blinded = false;
            }

            $scope.fumble[$scope.sides[i]] = false;
            $scope.predict[$scope.sides[i]] = false;

            //TODO only do active techniques
            for (var j=0; j<$scope.techniques.length; j++){
                $scope.techFumbles[$scope.sides[i]][$scope.techniques[j].name] = false;
            }
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

        if($scope.corner[side].blood_rage_mod){
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

        var skillMod = (attackerSkill * Math.random())/80;
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
            var msg = "";
            if($scope.corner[target].unstoppable_frenzy_mod){
                msg = $scope.corner[target].name.toTitleCase() + 
                " has consciousness damage reduced to 0 due to being in an Unstoppable Frenzy";
                $scope.record(msg);
                consciousnessDMG = 0;
            }

            if ($scope.activeTraits[targeter].name === 'naga' && $scope.checklist[target].poison){
                var multiplier = 1 + $scope.checklist[target].poison/100;
                consciousnessDMG = parseInt(consciousnessDMG*multiplier);
            
                msg = $scope.corner[target].name.toTitleCase() + " is poisoned and  " + multiplier + 
                "x more vulnerable to Naga attacks!";
                $scope.record(msg);
            }

            var totalDMG = consciousnessDMG + positioningDMG + bloodiedDMG;



            if($scope.corner[targeter].burning_strike){
                $scope.resolveBurningStrike(targeter, totalDMG);
            }
            if ($scope.corner[targeter].venom_spit){
                $scope.resolveVenomSpit(targeter, bloodiedDMG);
            }
            if ($scope.corner[targeter].cobra_strike){
                $scope.resolveCobraStrike(targeter, bloodiedDMG);
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

                if ($scope.corner[targeter].sewing_machine){
                    msg +=" from " + $scope.corner[targeter].name.toTitleCase() + "'s sewing machine attack";
                }

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


            $scope.checklist[target]['bloodiedDMGtaken'] = bloodiedDMG;
            $scope.checklist[targeter]['bloodiedDMGdone'] = bloodiedDMG;
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
            msg = $scope.corner[targeter].name.toTitleCase() + "'s burning strike burns into wounds dealing " +
            (conDMG+burnDMG) + " conscioussness damage! ";
            $scope.record(msg);
        } else {
            msg = $scope.corner[target].name.toTitleCase() + " is not wounded and imune to burning strike";
            $scope.record(msg);
        }
    };

    $scope.checkPostDamageTech = function(target, targeter, bloodiedDMG){
        $scope.checkTechUnstoppableFrenzy(target, targeter, bloodiedDMG);
        //unstoppable frenzy comes first so it cant be activated on same turn as lust/rage
        $scope.checkTechBloodLust(targeter, bloodiedDMG);
        $scope.checkTechBloodRage(target, bloodiedDMG);
    };

    //fighters may submit in bad situations before going unconscious
    $scope.checkQuit = function (target){
        var targeter = $scope.otherSide(target);

        if($scope.corner[target].unstoppable_frenzy_mod){
            return;
        }
        var msg = "";
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

            if ($scope.corner[targeter].embarrass){
                base +=5;
                 msg = $scope.corner[target].name.toTitleCase() + "'s chance to quit increases due to being embarrassed while grappling";
                $scope.record(msg);
            }

            if($scope.corner[targeter].maul){
                 msg = "Mauling increases " + $scope.corner[target].name.toTitleCase() + "'s chance to quit";
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
            $scope.corner[side].suffication = false;
            $scope.corner[side].venom_spit = false;
            $scope.corner[side].cobra_strike = false;
            $scope.corner[side].mezmorizing_gaze = false;
            $scope.corner[side].prayer_of_fortitude = false;
            $scope.corner[side].turtle = false;
            $scope.corner[side].embarrass = false;
            $scope.corner[side].overwhelm = false;
            $scope.corner[side].brilliant_aura = false;
            $scope.corner[side].evasive_strikes = false;
            $scope.corner[side].taunt = false;
            $scope.corner[side].advancing_wall = false;
            $scope.corner[side].feint = false;
            $scope.corner[side].divine_intervention = false;
            $scope.corner[side].sewing_machine = false;
    };

    // reset to do a new fight
    $scope.reset = function(){
        $scope.selectedFighter = null;

        $scope.resetChecklist();
        $scope.resetTechFumbles();

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
                            $scope.initializeTraits(side);
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

    $scope.initializeTraits = function (side){
        $scope.activeTraits[side] = $scope.traits[$scope.corner[side].trait];

        return;
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
            $scope.activeTechniques[side][$scope.allSlots[k]].range = tech.range;
            $scope.activeTechniques[side][$scope.allSlots[k]].cardio_cost = tech.cardio_cost;
            $scope.activeTechniques[side][$scope.allSlots[k]].technical_value = tech.technical_value;
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
                $scope.animations[$scope.sides[i]].blood.value = true;
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

    $scope.getPopoverContent = function (side, tech){
        var msg = "";
        msg += "<h5>" + tech.name.split('_').join(' ').toTitleCase() + " </h5>";
        var checks = $scope.doTechChecks(side, tech);
        msg += checks;
        return msg;
    };

    $scope.doTechChecks = function (side, tech){
        var otherSide = $scope.otherSide(side);
        //range check
        var msg = "";
        var passed = true;
        var reqBlood = null;
        var bloodCheck = null;
        if(tech.range !=='3'){
            var reqRange = $scope.distanceConverter(tech.range);

            var rangeCheck = $scope.rangeCheck(tech);
            if(rangeCheck) {
                msg += "<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg += "<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Inside " + reqRange + " range <br>";
        }
        //cardio check
        if(tech.cardio_cost!=='0' && tech.name!=='turtle') {
            var reqCardio = $scope.heightConverter(tech.cardio_cost);

            var cardioCheck = $scope.cardioCheck(side, tech.cardio_cost);
            if(cardioCheck){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += reqCardio.toTitleCase() + " cardio available <br>";
        }

        //sufficient bloodDMGdone
        if(tech.name ==='blood_lust'){
            reqBlood = $scope.lowBloodReq;

            bloodCheck = $scope.checkListBloodiedDMGdone(side);
            if(bloodCheck){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg+= reqBlood + " bloodied damage delt <br>";
        }

        //sufficient bloodDMGtaken
        if(tech.name ==='blood_rage'){
            reqBlood = $scope.lowBloodReq;

            bloodCheck = $scope.checkListBloodiedDMGtaken(side);
            if(bloodCheck){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg+= reqBlood + " bloodied damage taken <br>";
        }
        //sufficient bloodDMGtaken or bloodDMGdone
        if(tech.name ==='unstoppable_frenzy'){
            reqBlood = $scope.highBloodReq;

            var bloodCheckTaken = $scope.checkListBloodiedDMGtakenLarge(side);
            var bloodCheckDone = $scope.checkListBloodiedDMGdoneLarge(side);
            if(bloodCheckTaken || bloodCheckDone){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg+= reqBlood + " bloodied damage taken or delt <br>";
        }

        //blood_lust active or blood_rage active
        if (tech.name==='unstoppable_frenzy'){
            if ($scope.corner[side].blood_lust_mod || $scope.corner[side].blood_rage_mod){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Blood Rage or Blood Lust active <br>";
        }

        //target pinned
        if (tech.name==='maul' || tech.name==='suffication' || tech.name==='embarrass'){
            if ($scope.corner[otherSide].pinned){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg +="Opponent is pinned <br>";
        }
        //you are not pinned
        if (tech.name==='embarrass'){
            if (!$scope.corner[side].pinned){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg +="You are not pinned <br>";
        }
        //target vulnerable 
        if(tech.name==='cobra_strike'){
            if($scope.vulnerableCheck(otherSide)){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg +="Opponent is vulnerable <br>";
        }
        //attack blocked
        if (tech.name==='shield_smash'){
            if ($scope.checklist[otherSide].blockedOnce){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Opponent blocks initiation <br>";
        }
        //blocked
        if (tech.name==='advancing_wall'){
            if ($scope.corner[side].blocked){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Block an attack <br>";
        }
        //attack countered
        if(tech.name==='evasive_strikes'){
            if ($scope.checklist[otherSide].counter){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Opponent counter strikes <br>";
        }
        // No init timer
        if (tech.name==='prayer_of_fortitude'){
            if ($scope.timers.noInit > 2){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "No initiations for 3 turns <br>";
        }
        // gassed
        if(tech.name==='turtle'){
            if ($scope.corner[side].gassed){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "gassed <br>";
        }
        // with Holy
        if (tech.name==='brilliant_aura'){
            if ($scope.checklist[side].holyTech){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Use a holy technique <br>";
        }
        //10 holy techniques
        if (tech.name==='divine_intervention'){
            if ($scope.checklist[side].holy > 9){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            var techLeft = (10-$scope.checklist[side].holy);
            if (techLeft < 0){
                techLeft = 0;
            }
            msg += "Use " + techLeft + " more holy technique <br>";
        }
        // subsequent initiations > 5
        if (tech.name==='overwhelm'){
            if ($scope.checklist[side].repeatInits > 5){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            var initiationsLeft = (6-$scope.checklist[side].repeatInits);
            if (initiationsLeft < 0){
                initiationsLeft = 0;
            }
            msg += "Need " + initiationsLeft + " more subsequent initiations <br>";
        }
        // subsequent initiations > 1
        if (tech.name==='evasive_strikes'){
            if ($scope.checklist[side].repeatInits > 1){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "2 or more subsequent initiations <br>";
        }
        //subsequent blocks >2 
        if (tech.name==='sewing_machine'){
            if ($scope.checklist[side].blocks > 2){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "3 or more subsequent blocks <br>";
        }
        //initiator
        if(tech.name!=='unstoppable_frenzy' && tech.name !=='blood_rage' && tech.name!=='blood_lust' &&
            tech.name!=='prayer_of_fortitude' && tech.name!=='turtle' && tech.name!=='advancing_wall' &&
            tech.name!=='feint' && tech.name!=='divine_intervention' && tech.name!=='sewing_machine'){
            if($scope.initiator === side){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Initiating <br>";
        }
        //defender
        if(tech.name==='turtle' || tech.name==='advancing_wall' || tech.name==='sewing_machine'){
            if($scope.defender===side){
                msg +="<i class='glyphicon glyphicon-ok' style='color: green'></i> ";
            } else {
                msg +="<i class='glyphicon glyphicon-remove' style='color: red'></i> ";
                passed = false;
            }
            msg += "Defending <br>";
        }
        //condition check? %?
        msg +="Conditioning Test " + $scope.getConditionPercent(side, tech) + "% ";
        if(passed){
            if ($scope.techFumbles[side][tech.name]){
                msg += "<b style='color: red'> Failed </b>";
                passed = false;
            } else {
                msg += "<b style='color: green'> Passed </b>";
            }
        }

        // SHIELD SMASH CLAUSE
        //Add techniques to here that corner[side][tech.name] can be on without them being active
        //(i.e. on, but opponent doesn't block)
        if (tech.name !=='shield_smash' && tech.name !=='evasive_strikes' && tech.name!=='advancing_wall'){
            if ($scope.corner[side][tech.name]){
                passed = true;
            }
        }

        msg += "<br>";
        //TECH ACTIVE!
        if ($scope.corner[side][tech.name] && passed ){
            msg += " <b style='color: green'> ACTIVE </b>";
        }  else if (passed) {
            msg += " <b style='color: orange'> NEGATED </b>";
        } else {
            msg += "<b style='color: red'> INACTIVE </b>";
        }
        return msg;
    };

    $scope.updatePopover = function(side, tech){
        var tagName = "."+tech.name+side;
        $(tagName).popover({content: 'FU'});
        $(tagName).popover('show');
    };

    $scope.activatePopover = function (side, tech){
        $scope.popoverTech = {};
        $scope.popoverTech.side = side;
        $scope.popoverTech.tech = tech;
        var tagName = "."+tech.name+side;
        $(tagName).popover({html: true});
        $(tagName).popover('show');

        return 1;
    };

    $scope.deactivatePopover = function (side, tech){
        $scope.popoverTech = null;
        var tagName = "."+tech.name+side;

        $(tagName).popover('hide');
        return 1;
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


    $scope.endAnimationsGeneral = function (){
        for (var i=0; i<$scope.sides.length; i++){
            for (var j=0; j<$scope.fastEffects.length; j++){
                $scope.animations[$scope.sides[i]][$scope.fastEffects[j]].value = false;
            }

            for ( j=0; j<$scope.techAnimations.length; j++){
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]].value = false;
            }

            $scope.animations[$scope.sides[i]].blood.value = false;
        }
    };

    $scope.endAnimations = function (){
        for (var i=0; i<$scope.sides.length; i++){
            for (var j=0; j<$scope.fastEffects.length; j++){
                $scope.animations[$scope.sides[i]][$scope.fastEffects[j]].value = false;
            }

            for ( j=0; j<$scope.techAnimations.length; j++){
                $scope.animations[$scope.sides[i]][$scope.techAnimations[j]].value = false;
            }

            $scope.animations[$scope.sides[i]].blood.value = false;
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
