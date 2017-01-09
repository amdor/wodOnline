var module = angular.module("storyModule");

module.controller('AnswerController', ['$scope', '$state', '$stateParams', 'characterUtils', 'notifications',
                    function ($scope, $state, $stateParams, characterUtils, notifications){

    var episode = ($stateParams.episode != undefined) ? $stateParams.episode : Number(sessionStorage.getItem("episode"));
    var answer = $stateParams.answer;
    var showAlert = notifications.showAlert;
    $scope.answerText = "";

    $scope.$on('$viewContentLoaded', function(event){
        getAnswer();
    });

    $scope.loadNextStory = function(){
        $state.go('story', {episode: episode});
    }

    /**
     * Gets the corresponding answer's results from the database
     */
    function getAnswer() {
       $.get("proxy.php", {"answer": episode, "answerLetter": answer}, handleAnswerResponse)
        .fail(function(){
           $scope.$apply(function() {showAlert("Request resulted in error");});
        });
    }

    function handleAnswerResponse( data ) {
        var xpGain = 0;
        var answerResponse = JSON.parse(data);
        answerResponse.storyText += "\n";
        //next chapter
        episode = (answerResponse.next == undefined) ? episode + 1 : answerResponse.next;
        sessionStorage.setItem("episode", episode);

        if ( answerResponse.outcome === "fail" ) {
          xpGain = characterUtils.fail();
          $scope.$apply(function() {
              $scope.answerText = answerResponse.storyText;
              $scope.answerText += "Hasn't saved the world today. \n Gained " +
                             xpGain + " experience";
          });
        } else if ( answerResponse.outcome === "reward" ) {
          xpGain = characterUtils.reward();
          $scope.$apply(function() {
              $scope.answerText = answerResponse.storyText;
              $scope.answerText += "The well-deserved reward is " +
                             xpGain + " experience";
          });
        } else {
            $.get("proxy.php", {"npc": answerResponse.outcome},
            function(data) {
                $scope.$apply(function(){
                    var npc = JSON.parse( data );
                    var outcome = characterUtils.fight( npc );
                    xpGain = outcome.xpGain;
                    if (xpGain > 0) {
                       $scope.answerText = outcome.fightText;
                       $scope.answerText += answerResponse.storyText;
                       $scope.answerText += "The well-deserved reward is " +
                             xpGain + " experience";
                    } else if ( characterUtils.character.experience > 0 ) { //alive
                       $scope.answerText = "Rhonin's opponent proved to be much more powerful than he was. " +
                           "Luckily he could escape before got killed, as he realized the differences.\n"
                           + "He lost " + characterUtils.character.healthPoint + " health points.";
                    } else {
                        //showing a die modal
                        var body = "<pre>" + fightText + "</pre>" + "<p><b>Rhonin died, " +
                                                 "the game is lost. Upon continuing, the first episode will appear</p><b>"
                        showConfirm("Game Over", body, "Confirm", function() {
                            sessionStorage.setItem("episode", 0);
                            $state.go("story.newGame");
                        });
                    }
                });
            })
            .fail(function() {
                $scope.$apply(function(){
                    showAlert("Request resulted in error");
                });
            });
        }
    }
}]);