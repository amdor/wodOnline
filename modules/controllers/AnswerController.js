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
        var episode = (answerResponse.next == undefined) ? episode + 1 : answerResponse.next;
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
            function() {
                $scope.apply(function(){
                    var npc = JSON.parse( xhttp.responseText );
                    var outcome = characterUtils.fight( npc );
                    xpGain = outcome.xpGain;
                    if (xpGain > 0) {
                       $scope.answerText = outcome.fightText;
                       $scope.answerText += answerResponse.storyText;
                       $scope.answerText += "The well-deserved reward is " +
                             xpGain + " experience";
                    } else if ( 1 < Number(sessionStorage.getItem("episode")) ) { //greater than 1 === lost but alive, cos resets on death
                       $scope.answerText = "Rhonin's opponent proved to be much more powerful than him " +
                           "luckily he could escape before got killed, as he realized the differences.\n"
                           + "He lost " + this.healthPoint + " health points.";
                    }
                });
            })
            .fail(function() {
                $scope.apply(function(){
                    showAlert("Request resulted in error");
                });
            });
        }
    }
}]);