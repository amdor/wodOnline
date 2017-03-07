var module = angular.module("storyModule");

module.controller("NavBarController", ['$scope', '$state', 'characterUtils', 'notifications', 'AuthService',
                function( $scope, $state, characterUtils, notifications, AuthService ) {
    var showInfo = notifications.showInfo;
    var showAlert = notifications.showAlert;
    var showConfirm = notifications.showConfirm;
    $scope.modalTitle = "";
    $scope.modalBody = "";
    $scope.closeModal = notifications.closeModal;

//    shows modal and resets storages if confirmed
    $scope.newGameClicked = function() {
        var body = "By clicking on confirm " +
                    "the game restarts, ALL saved data will be LOST."
        showConfirm("New Game", body, "Confirm", newGameConfirmed );
    }

//    shows modal and loads episode if there
    $scope.loadGameClicked = function() {
        var body = "By clicking on Load, the last saved state will be loaded, and current unsaved progress will be lost!";
        showConfirm("Load game", body, "Load", function(){
            characterUtils.loadCharacter(
                function(character){
                    var episode = Number(character.episode);
                    if(Number.isNaN(episode) || episode == null ) { //new game with no saves yet
                        showAlert("There is no saved game state yet.");
                        return;
                    }
                    $state.reload();
                }
            )
        }
        );
    }

    $scope.saveGameClicked = function(){
        characterUtils.saveCharacter();
        showInfo("Saved");
    }

    $scope.logoutClicked = function() {
        AuthService.logout(
            function(response) {
                showInfo("Successfully logged out!")
            },
            function( response ) {
                showAlert("Logout failed");
            }
        );
    }

    $scope.npcState = function() {
        $state.go("npc");
    }

    $scope.storyState = function() {
        $state.go("story");
    }

    $scope.toggleNav = function() {
       var navbarControl = $('.navbar-toggle');
       if ( navbarControl.attr("aria-expanded") === 'true' ) {
          $("#toggleNavbar").collapse('hide');
       }
    }

    function newGameConfirmed() {
        characterUtils.newGame( function() {
            $state.go('story.newGame');
        });
    }

}]);