var module = angular.module("storyModule");

module.controller('AnswerController', ['$scope', '$state', '$stateParams', 'characterUtils', 'notifications',
                    function ($scope, $state, $stateParams, characterUtils, notifications){

    var episode = characterUtils.loadCharacter().episode;
    var answer = $stateParams.answer;
    var showAlert = notifications.showAlert;
    $scope.answerText = "";

    $scope.$on('$viewContentLoaded', function(event){
        getAnswer();
    });

    $scope.loadNextStory = function(){
        $state.go('story');
    }

    /**
     * Gets the corresponding answer's results from the database
     */
    function getAnswer() {
       $.get("/answer", {"answer": episode, "answerLetter": answer}, handleAnswerResponse)
        .fail(function(){
           $scope.$apply(function() {showAlert("Request resulted in error");});
        });
    }

    function handleAnswerResponse( data ) {
        var xpGain = 0;
        var answerResponse = data;
        answerResponse.storyText += "\n";
        //next chapter
        var character = characterUtils.loadCharacter();
        episode = (answerResponse.next == 0) ? episode + 1 : answerResponse.next;
        character.episode = episode;
        characterUtils.saveCharacter(character);

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
            $.get("/npc", {"npc": answerResponse.outcome},
            function(data) {
                $scope.$apply(function(){
                    var npc = data;
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
                        $state.go("story.newGame");
                        //showing a die modal
                        var body = "<pre>" + outcome.fightText + "</pre>" + "<p><b>Rhonin died, " +
                                                 "the game is lost. Upon continuing, the first episode will appear</p><b>";
                        notifications.showConfirm("Game Over", body, "Confirm", function() {
                            //noop
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