var module = angular.module("storyModule");

module.controller("NavBarController", ['$scope', function($scope){

    $scope.newGameClicked = function() {
       var button = $("<button>",
                      {"class": "btn btn-primary",
                      "id": "modal_confirm_button",
                      "text": "Confirm" } ).on("click", newGameConfirmed);
       var modal = $(".modal");
       modal.find( "#modal_confirm_button" ).remove();
       modal.find(".modal-title").text("New Game");
       modal.find(".modal-body")
           .html("<p>By clicking on confirm " +
                 "the game restarts, all saved data will be lost.</p>");
       modal.find(".modal-footer")
                .append( button );
       modal.modal("show");
    }

    $scope.loadGameClicked = function() {
        if( typeof(Storage) !== undefined ) {
            episode = Number(localStorage.episode);
            character = loadCharacter(localStorage);
            loadStory(episode);
            indexStoryState();
            refreshCharacterData();
        } else {
            showAlert("Your browser does not support Storage, sorry");
        }
    }

    $scope.saveGameClicked = function(){
        if( typeof(Storage) !== undefined ) {
            saveCharacter(localStorage, character);
            showInfo("Saved");
        } else {
            showAlert("Your browser does not support Storage, sorry");
        }
    }
}]);