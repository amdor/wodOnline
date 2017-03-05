/**
 * Character logics
 */

var module = angular.module("storyModule");

module.factory('characterUtils', ['$http', 'notifications', function( $http, notifications ) {

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

    function Character( copyObject ) {
        character = {
            "attackPower": copyObject.attackPower,
            "defensePower": copyObject.defensePower,
            "healthPoint": copyObject.healthPoint,
            "maxHP": copyObject.maxHP,
            "experience": copyObject.experience,
            "level": copyObject.level,
            "episode": copyObject.episode
        };
        return character;
    }

    /**
     *UTILITIES
    */

    function saveCharacter(object) {
        if(object == null){
            object = character;
        }
        $http.post("/save", object).then(
        function(response) {
            notifications.showInfo("Character saved");
        },
        function(response) {
            notifications.showAlert("Save failed");
        }
        );
    }

    function loadCharacter( success ) {
        $http.get("/player").then(
        function(response) {
            Character( response.data );
            success( character );
        },
        function( jqXHR, textStatus, errorThrown){
           notifications.showAlert("Request resulted in error");
        });
    }

    function newGame( success ) {
        $http.get("/newGame").then(
        function(response) {
           Character( response.data );
           notifications.showInfo("New game loaded");
           success();
        },
        function( jqXHR, textStatus, errorThrown){
           notifications.showAlert("Request resulted in error");
        });
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

    return {
        "character" : function(){return character},
        "saveCharacter" : saveCharacter,
        "loadCharacter" : loadCharacter,
        "newGame" : newGame,
        "nextLevelXP" : nextLevelXP
    };
}]);
