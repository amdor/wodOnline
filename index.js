/**
 * Created by Zsolt Deák 2016.03
 */

//Static vars (used by other js too)
var episode;
var character;
var contentDiv;
var titleHead;
var characterStatDiv;


/**
 * Saves important user data to sessionStorage before leaving the page
 */
function beforeWindowUnload(event) {
   if( typeof(Storage) !== undefined ) {
      sessionStorage.episode = episode;
      saveCharacter(sessionStorage, character);
   }
}
/**
 * Initialize page's dynamic contents
 */
function windowLoaded(event) {
   //Make navbar
   //document.body.insertBefore( createNavbar(), document.body.firstChild );
   addEvent( document.getElementById("newGameNavElem"), "click", function(event){
      episode = 1;
      character = new Character();
      sessionStorage.clear();
      loadStory(episode);
      indexStoryState();
      character.refreshDiv( characterStatDiv );
   });
   addEvent( document.getElementById("loadGameNavElem"), "click", function(event){
      if( typeof(Storage) !== undefined ) {
         episode = localStorage.episode;
         character = loadCharacter(localStorage);
         loadStory(episode);
         indexStoryState();
         character.refreshDiv( characterStatDiv );
      } else {
          showAlert("Your browser does not support Storage, sorry");
      }
   });
   addEvent( document.getElementById("saveGameNavElem"), "click", function(event){
      if( typeof(Storage) !== undefined ) {
          if ( !(localStorage.episode > 0)
               || localStorage.episode + 5 <= episode
               || localStorage.episode > episode ) {
              localStorage.episode = episode;
              saveCharacter(localStorage, character);
              showInfo("Saved");
          } else {
              showAlert("Sorry, but 1 save in 5 episodes at maximum.");
          }
      } else {
          showAlert("Your browser does not support Storage, sorry");
      }
   });
   
   titleHead = document.createElement("h3");
   titleHead.id = "title_Div";
   contentDiv = document.createElement("DIV");
   contentDiv.id = "content_Div";
   var storyContainer = document.getElementById("story_container");
   storyContainer.style.cursor = "default";
   storyContainer.insertBefore(contentDiv, storyContainer.firstChild);
   storyContainer.insertBefore(titleHead, contentDiv);
   
   episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? sessionStorage.episode : 1) : 1;
   loadStory(episode);
   
   character =  (typeof(Storage) !== undefined) ? (sessionStorage.character !== undefined) ? loadCharacter(sessionStorage) : new Character() : new Character();
   
   characterStatDiv = document.getElementById( "character_stat" );
   character.refreshDiv( characterStatDiv );
   
   addEvent(document.getElementById("answer_row"), "click", answerClicked);
}

function answerClicked(event) {
   var answer = "";
   if (event.target.id === "answerA") {
      getAnswer( episode, "A" );
   } else if (event.target.id === "answerB") {
      getAnswer( episode, "B" );
   }  else if (event.target.id === "answerC") {
      getAnswer( episode, "C" );
   }  else if (event.target.id === "answerD") {
      getAnswer( episode, "C" );
   }
   indexAnsweredState();
    
}


function nextStoryLoad() {
   loadStory( episode );
   character.healthPoint = (character.healthPoint <= maxHP - 20) ? character.healthPoint + 20 : maxHP;
   indexStoryState();
}

///////////////////
///STATE CHANGE///
/////////////////
function indexStoryState() {
   removeEvent( contentDiv.parentNode, "click", nextStoryLoad );
   addEvent(document.getElementById("answer_row"), "click", answerClicked);
   removeAnswerButtonsAttribute("disabled");
}

function indexAnsweredState() {
   addEvent( contentDiv.parentNode, "click", nextStoryLoad );
   removeEvent(document.getElementById("answer_row"), "click", answerClicked);
   setAnswerButtonsAttribute("disabled", "disabled");
}

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

function loadStory( ep ) {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         var response = JSON.parse( xhttp.responseText );
         titleHead.textContent = response.Title;
         contentDiv.textContent = response.Content;
         for(var i = 0; i < response.Answers.length; i++) {
            contentDiv.textContent += '\r\n'+response.Answers[i].text;
         }
      } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
         showAlert("Request resulted in error");
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
         handleAnswerResponse( xhttp.responseText );
      } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
         showAlert("Request resulted in error");
      }
   };
   xhttp.open("GET", "proxy.php?answer=" + ep + "&answerLetter=" + answer, true);
   xhttp.send();
}

function handleAnswerResponse( answerResponse ) {
   var xpGain = 0;
   if ( answerResponse === "fail" ) {
      xpGain = character.fail();
      episode++;
      contentDiv.textContent = "Hasn't saved the world today. \n Gained " + 
                     xpGain + " experience";
    } else if ( answerResponse === "reward" ) {
      xpGain = character.reward();
      episode++;
      contentDiv.textContent = "The well-deserved reward is " +  
                     xpGain + " experience";
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
         if (xhttp.readyState == 4 && xhttp.status == 200) {
            episode++;
            var npc = JSON.parse( xhttp.responseText );
            character.fight( npc );
         } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
            showAlert("Request resulted in error");
         }
      };
      xhttp.open("GET", "proxy.php?npc=" + answerResponse, true);
      xhttp.send();     

    }
}

function showAlert( msg ) {
   var notificationAlert = document.createElement("DIV");
   notificationAlert.className = "col-md-10 alert alert-danger fade in";
   notificationAlert.role = "alert";
   notificationAlert.id = "temp_Alert";
   notificationAlert.innerHTML = msg;
   contentDiv.parentNode.appendChild(notificationAlert);
   $("#temp_Alert").delay(4000).fadeOut(800, function() {
      $(this).alert('close');
   });
}

function showInfo( msg ) {
    var infoAlert = document.createElement("DIV");
    infoAlert.className = "alert alert-info fade in text-center";
    infoAlert.role = "alert";
    infoAlert.id = "temp_Info";
    infoAlert.innerHTML = msg;
    var storyContainer = $("#content_container");
    storyContainer.prepend(infoAlert);
    $("#temp_Info").delay(4000).fadeOut(800, function(){
         $(this).alert('close');
    });
}
