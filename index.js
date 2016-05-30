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
   addEvent( document.getElementById("newGameNavElem"), "click", newGameClicked);
   //addEvent( document.getElementById("modal_view"), "show.bs.modal", newGameClicked );
   addEvent( document.getElementById("loadGameNavElem"), "click", function(event){
      if( typeof(Storage) !== undefined ) {
         episode = Number(localStorage.episode);
         character = loadCharacter(localStorage);
         loadStory(episode);
         indexStoryState();
         refreshCharacterData();
      } else {
          showAlert("Your browser does not support Storage, sorry");
      }
   });
   addEvent( document.getElementById("saveGameNavElem"), "click", function(event){
      if( typeof(Storage) !== undefined ) {
         saveCharacter(localStorage, character);
         showInfo("Saved");
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
   episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? Number(sessionStorage.episode) : 0) : 0;
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

////////////////
///EVENTS///////
////////////////
function answerClicked(event) {
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

function newGameClicked() {
   var button = $("<button>",
                  {"class": "btn btn-primary",
                  "id": "modal_confirm_button",
                  "text": "Confirm" } ).on("click", newGameConfirmed);
   var modal = $(".modal");
   modal.find( "#modal_confirm_button" ).remove();
   modal.find(".modal-title").text("New Game");
   modal.find(".modal-body")
       .html("<p>By clicking on confirm " + 
             "the game restarts, all saved data will be lost.</p>");
   modal.find(".modal-footer")
            .append( button );
   modal.modal("show");
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
   $(titleHead).empty();
   $(contentDiv).empty();
   
   $("#content_spinner").show();
   
   removeEvent( contentDiv.parentNode, "click", nextStoryLoad );
   addEvent(document.getElementById("answer_row"), "click", answerClicked);
   removeAnswerButtonsAttribute("disabled");
   refreshCharacterData();
}

function indexAnsweredState() {
   addEvent( contentDiv.parentNode, "click", nextStoryLoad );
   removeEvent(document.getElementById("answer_row"), "click", answerClicked);
   setAnswerButtonsAttribute("disabled", "disabled");
   refreshCharacterData();
}

function indexNewGameState() {
   episode = 1;
   removeEvent(document.getElementById("answer_row"), "click", answerClicked);
   setAnswerButtonsAttribute("disabled", "disabled");
   $("#content_spinner").hide();
   $(titleHead).empty();
   $(contentDiv).empty();
   $(characterStatDiv).empty();
   $("#xp_progress_container").hide();
   
   appendImage( "img/start.png", contentDiv );
   $("#story_container").on("click", function(){
      $("#story_container").off("click");
      $(contentDiv).children("img").remove();
      $("#xp_progress_container").show();
      nextStoryLoad();
   });
}

function refreshCharacterData() {
   characterStatDiv.textContent = "Attack power: " + character.attackPower + "\n" +
                    "Defense power: " + character.defensePower + "\n" +
                    "Health point: " + character.healthPoint + " / " + character.maxHP + "\n" +
                    "Level: " + character.level + "\n";
   var newVal = Math.round( character.experience * 100 / character.nextLevelXP() );
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
         contentDiv.textContent = response.Content;
         setAnswerButtonsAttribute("disabled", "disabled");
         $("#answer_row").children()
                        .slice(0, response.Answers.length).children().removeAttr("disabled");
         for(var i = 0; i < response.Answers.length; i++) {
            contentDiv.textContent += '\r\n\r\n'+response.Answers[i].text;
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
            xpGain = character.fight( npc );
            if (xpGain > 0) {
               contentDiv.textContent = answerResponse.storyText;
               contentDiv.textContent += "The well-deserved reward is " +  
                     xpGain + " experience";
            } else if ( episode > 1 ) { //greater than 1 === lost but alive, cos resets on death
               contentDiv.textContent = "Rhonin's opponent proved to be much more powerful than him " + 
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
