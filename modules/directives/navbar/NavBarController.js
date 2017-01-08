var module = angular.module("storyModule");

module.controller("NavBarController", ['$scope', '$state', 'characterUtils', 'notifications',
                function($scope, $state, characterUtils, notifications) {
    var showInfo = notifications.showInfo;
    var showAlert = notifications.showAlert;
    $scope.modalTitle = "";
    $scope.modalBody = "";

//    shows modal and resets storages if confirmed
    $scope.newGameClicked = function() {
        var body = "By clicking on confirm " +
                    "the game restarts, ALL saved data will be LOST."
        showConfirm("New Game", body, "Confirm", newGameConfirmed );
    }

//    shows modal and loads episode if there
    $scope.loadGameClicked = function() {
        var body = "By clicking on Load, the last saved state will be loaded, and current unsaved progress will be lost!";
        showConfirm("Load game", body, "Load", function() {
            sessionStorage.clear();
            var episode = Number(localStorage.episode);
            if(Number.isNaN(episode)) { //new game with no saves yet
                showAlert("There is no saved game state yet.");
                return;
            }
            sessionStorage.setItem("episode", episode);
            character = characterUtils.loadCharacter(localStorage);
            characterUtils.saveCharacter(); //to sessionstorage by default
            $state.go('story', {episode: episode})
        });
    }

    $scope.saveGameClicked = function(){
        characterUtils.saveCharacter(characterUtils.character, localStorage);
        localStorage.setItem("episode", sessionStorage.getItem("episode"))
        showInfo("Saved");
    }

    $scope.closeModal = function() {
        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    function showConfirm(title, body, confirmButtonText, onConfirm) {
        var button = $("<button>",
                      {"class": "btn btn-primary",
                      "id": "modal_confirm_button",
                      "text": confirmButtonText,
                       "data-dismiss":"modal"} ).on("click", onConfirm);
        button.on("click", function() {
            $scope.closeModal();
        });
        var modal = $(".modal");
        $scope.modalTitle = title;
        $scope.modalBody = body;
        $(".modal #modal_confirm_button").remove(); //remove if there were same button(s)
        modal.find(".modal-footer")
                .append( button );
        modal.modal("show");
    }

    function newGameConfirmed() {
       sessionStorage.clear();
       localStorage.clear();
       $state.go('story.newGame');
    }

}]);