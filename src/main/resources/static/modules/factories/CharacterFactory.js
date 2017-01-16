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
     * @returns xp gained by the fight: 0 if lost of course
     */
    function fight( actEnemy ) {
        var xpGain = 0;
        var fightText = "";
        //enemy is too strong
        if(actEnemy.defensePower >= character.attackPower){
            character.healthPoint -= character.healthPoint/2;
        //opposit
        }else if(character.defensePower >= actEnemy.attackPower){
            xpGain = npcXpGain(actEnemy);
        }
        //others
        else {
            var playerDmg = character.attackPower - actEnemy.defensePower;
            var oppDmg = actEnemy.attackPower - character.defensePower;
            var rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 0.8)); //damage * [0.8..1.5]
            var rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 0.8));
            fightText = "";
            while( ( ( actEnemy.healthPoint -= rndPlayerDmg ) > 0 )
                  && ( ( character.healthPoint -= rndOppDmg ) > 0 ) ) {
                rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 1));
                rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 1));
                fightText += "His opponent damaged him: -"  + rndOppDmg
                        + " health point. Remained " + character.healthPoint;
                fightText += (rndOppDmg > oppDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
                fightText += "Rhonin attacked: " + rndPlayerDmg + " damages. "
                        + actEnemy.healthPoint + " health remained.";
                fightText += (rndPlayerDmg > playerDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
            }
            //player died
            if(character.healthPoint <= 0){
                Character();
            //player survived
            }else{
                xpGain = npcXpGain(actEnemy);
            }

        }
        finalizeAction(xpGain);
        return {"xpGain": xpGain, "fightText": fightText };
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


    function npcXpGain( actEnemy ){
        var gain = character.level * 5 + 45;
        if( character.level < actEnemy.level ){
            gain = gain * (actEnemy.level - character.level);
        }
        return gain;
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
