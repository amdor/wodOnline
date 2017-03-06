var module = angular.module("storyModule");

module.controller('StoryController', ['$scope', '$state', 'characterUtils', 'notifications', '$http',
                    function ($scope, $state, characterUtils, notifications, $http ){

    var showAlert = notifications.showAlert;

    $scope.character;
    characterUtils.getPlayer( function( loadedCharacter ) {
        $scope.character = loadedCharacter;
    });
    $scope.chapterTitle = "";
    $scope.chapterText = "";
    $scope.characterStats = "";
    $scope.showSpinner = true;
    $scope.numberOfAnswers = 0;
    $scope.answerLetters = ['A', 'B', 'C', 'D'];


    $scope.$watch('character', function(newVal, oldVal) {
        if(newVal == null) {return;}
        $scope.characterStats = refreshCharacterData();
        refreshXPBar();
        loadStory($scope.character.episode);
    });

    $scope.range = function(n) {
        return new Array(n);
    };

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
        var characterText = "Attack power: " + $scope.character.attackPower + "\n" +
                        "Defense power: " + $scope.character.defensePower + "\n" +
                        "Health point: " + $scope.character.healthPoint + " / " + $scope.character.maxHP + "\n" +
                        "Level: " + $scope.character.level + "\n";
        return characterText
    }

    function refreshXPBar() {
        var newVal = Math.round( $scope.character.experience * 100 / characterUtils.nextLevelXP() );
        $("#xp_progress_bar").width( newVal + "%" )
                    .attr( 'aria-valuenow', newVal );
    }

    ///////////////////////////////////
    ////Server communications//////////
    ///////////////////////////////////
    function loadStory( ep ) {
        $http.get("/story", {params:{"story": ep}})
        .then(
            function(data) {
                var response = data.data;
                    $scope.chapterTitle = response.title;
                    $scope.chapterText = response.content;
                    $scope.numberOfAnswers = response.answers.length;
                    for(var i = 0; i < response.answers.length; i++) {
                        $scope.chapterText += '\r\n\r\n'+response.answers[i].text;
                    }
                    $scope.showSpinner = false;
            }
            ,function(){
                $scope.$apply(function() {
                    $scope.showSpinner = false;
                    showAlert("Request resulted in error");
                });
            }
        );
    }
}]);