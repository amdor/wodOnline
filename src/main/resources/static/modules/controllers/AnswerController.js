var module = angular.module("storyModule");

module.controller('AnswerController', ['$scope', '$state', '$stateParams', 'characterUtils', 'notifications', '$http',
                    function ($scope, $state, $stateParams, characterUtils, notifications, $http){

    var episode = 0;
    characterUtils.getPlayer( function( loadedCharacter ) {
        episode = loadedCharacter.episode;
        getAnswer();
    });
    var answer = $stateParams.answer;
    var showAlert = notifications.showAlert;
    $scope.answerText = "";

    $scope.loadNextStory = function() {
        $state.go('story');
    }

    /**
     * Gets the corresponding answer's results from the database
     */
    function getAnswer() {
       $http.get("/answer",
            {
                params : { "answer": episode, "answerLetter": answer },
                transformResponse: []
            }
       ).then(
            handleAnswerResponse,
            function() {
               showAlert("Request resulted in error");
            }
       );
    }

    function handleAnswerResponse( response ) {
        $scope.answerText = response.data;
        characterUtils.getPlayer( function(loadedCharacter) {
            if(loadedCharacter.experience == 0) {
                $state.go("story.newGame");
                //showing a die modal
                var body = "<pre>" + $scope.answerText + "</pre>" + "<p><b>Rhonin died, " +
                                         "the game is lost. Upon continuing, the first episode will appear</p><b>";
                notifications.showConfirm("Game Over", body, "Confirm", function() {
                    //noop
                });
            }
        });
    }
}]);