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
          getAnswer( episode, "A" );
       } else if (event.target.id === "answerB") {
          getAnswer( episode, "B" );
       }  else if (event.target.id === "answerC") {
          getAnswer( episode, "C" );
       }  else if (event.target.id === "answerD") {
          getAnswer( episode, "D" );
       }
       indexAnsweredState();

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
    //TODO:these need enhancements :(
    function loadStory( ep ) {
        $.get("proxy.php", {"story": ep}, function(data, statusText, xhr){
            var response = JSON.parse( xhr.responseText );
            $scope.$apply(function() {
                $scope.chapterTitle = response.Title;
                $scope.chapterText = response.Content;
                for(var i = 0; i < response.Answers.length; i++) {
                    $scope.chapterText += '\r\n\r\n'+response.Answers[i].text;
                }
            });
        })
        .fail(function(xhr){
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


    /**
     * Gets the corresponding answer's results from the database
     */
    function getAnswer( ep, answer ) {
       var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
             handleAnswerResponse( JSON.parse( xhttp.responseText ) );
          } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
             showAlert("Request resulted in error");
          }
       };
       xhttp.open("GET", "proxy.php?answer=" + ep + "&answerLetter=" + answer, true);
       xhttp.send();
    }

    function handleAnswerResponse( answerResponse ) {
       var xpGain = 0;
       answerResponse.storyText += "\n";
       if ( answerResponse.outcome === "fail" ) {
          xpGain = character.fail();
          $scope.contentDiv.textContent = answerResponse.storyText;
          $scope.contentDiv.textContent += "Hasn't saved the world today. \n Gained " +
                         xpGain + " experience";
        } else if ( answerResponse.outcome === "reward" ) {
          xpGain = character.reward();
          $scope.contentDiv.textContent = answerResponse.storyText;
          $scope.contentDiv.textContent += "The well-deserved reward is " +
                         xpGain + " experience";
        } else {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
             if (xhttp.readyState == 4 && xhttp.status == 200) {
                var npc = JSON.parse( xhttp.responseText );
                xpGain = character.fight( npc );
                if (xpGain > 0) {
                   $scope.contentDiv.textContent = answerResponse.storyText;
                   $scope.contentDiv.textContent += "The well-deserved reward is " +
                         xpGain + " experience";
                } else if ( episode > 1 ) { //greater than 1 === lost but alive, cos resets on death
                   $scope.contentDiv.textContent = "Rhonin's opponent proved to be much more powerful than him " +
                       "luckily he could escape before got killed, as he realized the differences.\n"
                       + "He lost " + this.healthPoint + " health points.";
                }
             } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                showAlert("Request resulted in error");
             }
          };
          xhttp.open("GET", "proxy.php?npc=" + answerResponse.outcome, true);
          xhttp.send();

        }

        //next chapter
        episode = (answerResponse.next == undefined) ? episode + 1 : answerResponse.next;
    }
}]);