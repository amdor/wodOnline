/**
 * Created by Zsolt Deák 2016.03
 *
 * Character logics
 */

var module = angular.module("storyModule");

module.factory('characterUtils', ['notifications', function(){

    const STORAGE_KEY = "character";

    var character = {
        "attackPower": null,
        "defensePower": null,
        "healthPoint": null,
        "maxHP": null,
        "experience": null,
        "level": null,
        "episode": null
    };

    function Character() {
        character.attackPower = 10;
        character.defensePower = 8;
        character.healthPoint = 120;
        character.maxHP = character.healthPoint;
        character.experience = 0;
        character.level = 1;
        character.episode = 1;
        return character;
    }

    function levelUp() {
        character.attackPower += 2;
        character.defensePower += 1;
        character.maxHP += 20;
        character.healthPoint = character.maxHP;
        character.experience = 0;
        character.level++;
    }

    function levelUpIfNeeded() {
        if( ( character.experience - nextLevelXP() ) >= 0 ){
            character.experience -= nextLevelXP();
            levelUp();
        }
    }


    /**
    *   ACTIONS
    */

    function fail() {
        var gain = character.level + 5;
        finalizeAction(gain);
        return gain;
    }

    function reward() {
        var gain = ( character.level * 4 ) + 45;
        finalizeAction(gain);
        return gain;
    }

    /**
     * Makes the fight: decreases life if needed, gives xp, levels up
     * @param actEnemy the enemy to fight with
     * @param completionHandler the handler to be called after the fight finished
     * @returns xp gained by the fight: 0 if lost of course (in completion handler)
     */
    function fight( actEnemy, completionHandler ) {
        $.get("/fight", {enemy: JSON.stringify(actEnemy), character: JSON.stringify(character)})
        .then(
        function(response) {
            var data = JSON.parse(response);
            character = data.character;
            finalizeAction(data.xpGain);
            completionHandler( data.xpGain, data.fightText );
        },
        function( jqXHR, textStatus, errorThrown){
           $scope.$apply(function() {showAlert("Request resulted in error");});
        });
    }


    /**
     *UTILITIES
    */

    function saveCharacter(object, storage) {
        if(storage == null){
            storage = sessionStorage;
        }
        if(object == null){
            object = character;
        }
        storage.setItem(STORAGE_KEY, JSON.stringify(object));
    }

    function loadCharacter(storage) {
        if(storage == null){
            storage = sessionStorage;
        }
        var tmp = JSON.parse(storage.getItem(STORAGE_KEY));
        if(tmp == null) {
            Character();
        }
        else {
            character = tmp;
        }
        return character;

    }

    /**
     * Returns xp amount needed for the next level
     */
    function nextLevelXP() {
        if( character.level < 11 ) {
            return ( 40 * character.level * character.level ) + ( 360 * character.level );
        }
        if( character.level >= 11 ) {
            return ( 0.4 * character.level * character.level * character.level )
                        + ( 40 * character.level * character.level )
                        + ( 396 * character.level );
        }
    }

    function finalizeAction(xpGain) {
        character.experience += xpGain;
        levelUpIfNeeded();
        saveCharacter();
    }

    return {
        "character" : loadCharacter(),
        "newCharacter" : Character,
        "fail" : fail,
        "reward" : reward,
        "fight" : fight,
        "saveCharacter" : saveCharacter,
        "loadCharacter" : loadCharacter,
        "nextLevelXP" : nextLevelXP
    };
}]);
