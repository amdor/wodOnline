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
//Navbar events
   addEvent( document.getElementById("newGameNavElem"), "click", function(event){
      episode = 0;
      character = new Character();
      sessionStorage.clear();
      localStorage.clear();
      //loadStory(episode);
      indexNewGameState();
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
   
   //creating dynamic content containers
   titleHead = $("<h3>", {id: "title_Div"});
   contentDiv = $("<div>", {id: "content_Div"});
   var storyContainer = $("#story_container");
   storyContainer.css({"cursor": "default"});
   storyContainer.prepend(titleHead, contentDiv);
   
   //as for the rest of the code need to be simple element
   titleHead = document.getElementById("title_Div");
   contentDiv = document.getElementById("content_Div");
   
   characterStatDiv = document.getElementById( "character_stat" );
   
   //loading data, and showing it
   episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? sessionStorage.episode : 0) : 0;
   character =  (typeof(Storage) !== undefined) ?
                     (sessionStorage.character !== undefined) ?
                        loadCharacter(sessionStorage) : new Character()
                     : new Character();
   if (episode > 0) {
      indexStoryState();
      loadStory(episode);
   } else {
      indexNewGameState();
   }
 
   addEvent(document.getElementById("answer_row"), "click", answerClicked);
   addEvent(document.getElementById("story_container"), "click", toggleNav);
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
   indexStoryState();
   loadStory( episode );
   character.healthPoint = (character.healthPoint <= character.maxHP - 20) ? character.healthPoint + 20 : character.maxHP;
}

///////////////////
///STATE CHANGE///
/////////////////
function indexStoryState() {
   $(titleHead).empty();
   $(contentDiv).empty();
   $("#story_container").children("img").remove();
   
   $("#content_spinner").show();
   
   removeEvent( contentDiv.parentNode, "click", nextStoryLoad );
   addEvent(document.getElementById("answer_row"), "click", answerClicked);
   removeAnswerButtonsAttribute("disabled");
   character.refreshDiv( characterStatDiv );
}

function indexAnsweredState() {
   addEvent( contentDiv.parentNode, "click", nextStoryLoad );
   removeEvent(document.getElementById("answer_row"), "click", answerClicked);
   setAnswerButtonsAttribute("disabled", "disabled");
   character.refreshDiv( characterStatDiv );
}

function indexNewGameState() {
   episode = 1;
   indexAnsweredState();
   $(titleHead).empty();
   $(contentDiv).empty();
   $(characterStatDiv).empty();
   appendImage( "img/start.png", contentDiv );
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
      contentDiv.textContent = answerResponse.storyText;
      contentDiv.textContent += "Hasn't saved the world today. \n Gained " + 
                     xpGain + " experience";
    } else if ( answerResponse.outcome === "reward" ) {
      xpGain = character.reward();
      contentDiv.textContent = answerResponse.storyText;
      contentDiv.textContent += "The well-deserved reward is " +  
                     xpGain + " experience";
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
         if (xhttp.readyState == 4 && xhttp.status == 200) {
            var npc = JSON.parse( xhttp.responseText );
            character.fight( npc );
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
