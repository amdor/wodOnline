var module = angular.module("storyModule");

module.controller('StoryController', ['$scope', '$state', 'characterUtils', 'notifications',
                    function ($scope, $state, characterUtils, notifications){

    var showAlert = notifications.showAlert;

    var character = characterUtils.loadCharacter();
    var episode = character.episode;
    character.healthPoint = (character.healthPoint < character.maxHP - 20) ? character.healthPoint + 20 : character.maxHP;
    $scope.chapterTitle = "";
    $scope.chapterText = "";
    $scope.characterStats = "";
    $scope.showSpinner = true;


    $scope.$on('$viewContentLoaded', function(event){
        $scope.characterStats = refreshCharacterData();
        refreshXPBar();
        loadStory(episode);
    });

    ////////////////
    ///EVENTS///////
    ////////////////
    $scope.answerClicked = function(event) {
       var answer = "";
       if (event.target.id === "answerA") {
          answer = "A";
       } else if (event.target.id === "answerB") {
          answer = "B";
       }  else if (event.target.id === "answerC") {
          answer = "C";
       }  else if (event.target.id === "answerD") {
          answer = "D";
       }
       $state.go("story.answered", {answer: answer });

    }

    ///////////////////
    ///STATE CHANGE///
    /////////////////
    function refreshCharacterData() {
       var characterText = "Attack power: " + character.attackPower + "\n" +
                        "Defense power: " + character.defensePower + "\n" +
                        "Health point: " + character.healthPoint + " / " + character.maxHP + "\n" +
                        "Level: " + character.level + "\n";
       return characterText
    }

    function refreshXPBar() {
        var newVal = Math.round( character.experience * 100 / characterUtils.nextLevelXP() );
        $("#xp_progress_bar").width( newVal + "%" )
                    .attr( 'aria-valuenow', newVal );
    }

    ///////////////////////////////////
    ////Server communications//////////
    ///////////////////////////////////
    function loadStory( ep ) {
        $.get("/story", {"story": ep}, function(data){
            var response = data;
            $scope.$apply(function() {
                $scope.chapterTitle = response.title;
                $scope.chapterText = response.content;
                for(var i = 0; i < response.answers.length; i++) {
                    $scope.chapterText += '\r\n\r\n'+response.answers[i].text;
                }
            });
        })
        .fail(function(){
            $scope.$apply(function() {
                showAlert("Request resulted in error");
            });
        })
        .always(function() {
            $scope.$apply(function() {
                $scope.showSpinner = false;
            });
        });
    }
}]);