var module = angular.module("storyModule");

module.controller('StoryController', ['$scope', '$state', 'characterUtils',
                    function ($scope, $state, characterUtils){

    var episode = $state.current.data.episode;
    var character = characterUtils.character;
    $scope.chapterTitle = "";
    $scope.chapterText = "";
    $scope.characterStats = refreshCharacterData();
    $scope.showSpinner = true;

    refreshXPBar();

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

    function newGameConfirmed() {
       $(".modal #modal_confirm_button").remove();
       $(".modal").modal("hide");
       episode = 0;
       character = new Character();
       sessionStorage.clear();
       localStorage.clear();
       indexNewGameState();
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
       var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
             var response = JSON.parse( xhttp.responseText );
             titleHead.textContent = response.Title;
             $scope.contentDiv.textContent = response.Content;
             setAnswerButtonsAttribute("disabled", "disabled");
             $("#answer_row").children()
                            .slice(0, response.Answers.length).children().removeAttr("disabled");
             for(var i = 0; i < response.Answers.length; i++) {
                $scope.contentDiv.textContent += '\r\n\r\n'+response.Answers[i].text;
             }
          } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
             showAlert("Request resulted in error");
          }
          if (xhttp.readyState == 4 ) {
             $("#content_spinner").hide();
          }
       };
       xhttp.open("GET", "proxy.php?story=" + ep, true);
       xhttp.send();
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

    ////////////////////////////////
    ////User notifications//////////
    ////////////////////////////////
    function showAlert( msg ) {
       var notificationAlert = document.createElement("DIV");
       notificationAlert.className = "alert alert-danger fade in temp_Alert";
       notificationAlert.role = "alert";
       notificationAlert.innerHTML = msg;
       $("#content_container").prepend(notificationAlert);
       $(".temp_Alert").delay(4000).fadeOut(800, function() {
          $(this).alert('close');
       });
    }

    function showInfo( msg ) {
       var infoAlert = document.createElement("DIV");
       infoAlert.className = "alert alert-info fade in text-center";
       infoAlert.role = "alert";
       infoAlert.id = "temp_Info";
       infoAlert.innerHTML = msg;
       $("#content_container").prepend(infoAlert);
       $("#temp_Info").delay(4000).fadeOut(800, function(){
          $("#temp_Info").alert('close');
       });
    }
}]);