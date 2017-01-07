var module = angular.module("storyModule");

module.controller("NavBarController", ['$scope', '$state', 'notifications', 'characterUtils',
                function($scope, $state, notifications, characterUtils) {
    var showAlert = notifications.showAlert;
    var showInfo = notifications.showInfo;

    $scope.newGameClicked = function() {
       var button = $("<button>",
                      {"class": "btn btn-primary",
                      "id": "modal_confirm_button",
                      "text": "Confirm",
                       "data-dismiss":"modal"} ).on("click", newGameConfirmed);
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
            character = characterUtils.loadCharacter(localStorage);
//            loadStory(episode);
            $state.go('story', {episode: episode})
//            refreshCharacterData();
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

    $scope.closeModal = function() {
        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }


    function newGameConfirmed() {
       $(".modal #modal_confirm_button").remove();
       $scope.closeModal();
       sessionStorage.clear();
       localStorage.clear();
       $state.go('story.newGame');
    }

}]);