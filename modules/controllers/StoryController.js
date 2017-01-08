var module = angular.module("storyModule");

module.controller('StoryController', ['$scope', '$state', '$stateParams', 'characterUtils', 'notifications',
                    function ($scope, $state, $stateParams, characterUtils, notifications){

    var showAlert = notifications.showAlert;

    var episode = $stateParams.episode ? $stateParams.episode : Number(JSON.parse(sessionStorage.getItem("episode")));
    var character = characterUtils.loadCharacter();
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
       $state.go("story.answered", {episode: episode, answer: answer });

    }

    function nextStoryLoad() {
       indexStoryState();
       loadStory( episode );
       character.healthPoint = (character.healthPoint <= character.maxHP - 20) ? character.healthPoint + 20 : character.maxHP;
    }

    ///////////////////
    ///STATE CHANGE///
    /////////////////
    function indexStoryState() {


       refreshCharacterData();
    }

    function indexAnsweredState() {
       addEvent( $scope.contentDiv.parentNode, "click", nextStoryLoad );
       removeEvent(document.getElementById("answer_row"), "click", answerClicked);
       setAnswerButtonsAttribute("disabled", "disabled");
       refreshCharacterData();
    }

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
    ////Enable/disable answer buttons//
    ///////////////////////////////////
    function setAnswerButtonsAttribute(name, value) {
       document.getElementById("answerA").setAttribute(name, value);
       document.getElementById("answerB").setAttribute(name, value);
       document.getElementById("answerC").setAttribute(name, value);
       document.getElementById("answerD").setAttribute(name, value);
    }

    function removeAnswerButtonsAttribute(name) {
       document.getElementById("answerA").removeAttribute(name);
       document.getElementById("answerB").removeAttribute(name);
       document.getElementById("answerC").removeAttribute(name);
       document.getElementById("answerD").removeAttribute(name);
    }

    ///////////////////////////////////
    ////Server communications//////////
    ///////////////////////////////////
    function loadStory( ep ) {
        $.get("proxy.php", {"story": ep}, function(data){
            var response = JSON.parse( data );
            $scope.$apply(function() {
                $scope.chapterTitle = response.Title;
                $scope.chapterText = response.Content;
                for(var i = 0; i < response.Answers.length; i++) {
                    $scope.chapterText += '\r\n\r\n'+response.Answers[i].text;
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