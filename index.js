/**
 * Created by Zsolt Deák 2016.03
 */

//Static vars (used by other js too)
var episode           //TODO load from cookie

/**
 * addEvent function for crossplatform add event capability
 * STATIC USE
 * http://stackoverflow.com/questions/6927637/addeventlistener-in-internet-explorer
 */
function addEvent(elem, type, handler) {
   if (elem.addEventListener) { // W3C DOM
      elem.addEventListener(type,handler,false);
   } else if (elem.attachEvent) { // IE DOM
      elem.attachEvent("on"+type, handler);
   } else { // No much to do
      elem["on" + type] = handler;
   }
}

//STATIC USE
//http://stackoverflow.com/questions/12949590/how-to-detach-event-in-ie-6-7-8-9-using-javascript
function removeEvent(elem, type, handler) {
   if (elem.removeEventListener) {
       elem.removeEventListener(type, handler, false);
   } else if (elem.detachEvent) {
       elem.detachEvent("on" + type, handler);
   } else {
       elem["on" + type] = null;
   }
}


/**
 * Saves important user data to sessionStorage before leaving the page
 */
function beforeWindowUnload(event) {
   sessionStorage.inputUriCount = currentInputUriCount;
   var uriArray = new Array();
   for(var i = 0; i < currentInputUriCount; i++) {
      var textFieldHolder = document.getElementById(uriInputFieldIdPrefix + i);
      uriArray.push( (textFieldHolder && textFieldHolder.value) ? textFieldHolder.value : "" );
   }
   sessionStorage.inputUriTextContent = JSON.stringify(uriArray);
}
/**
 * Initialize page's dynamic contents
 */
function windowLoaded(event) {
   //Make navbar
   document.body.insertBefore( createNavbar(), document.body.firstChild );
   
   episode = 1;
   loadStory(episode);
   
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
    
}

function loadStory( ep ) {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         var response = JSON.parse( xhttp.responseText );
         var titleHead = document.createElement("h3");
         titleHead.id = "title_Div";
         titleHead.textContent = response.Title;
         var contentDiv = document.createElement("DIV");
         contentDiv.id = "content_Div";
         contentDiv.textContent = response.Content;
         for(var i = 0; i < response.Answers.length; i++) {
            contentDiv.textContent += '\r\n'+response.Answers[i].text;
         }
         var storyContainer = document.getElementById("story_container");
         storyContainer.insertBefore(contentDiv, storyContainer.firstChild);
         storyContainer.insertBefore(titleHead, contentDiv);
      } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
         showRequestAlert();
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
         document.getElementById("output_container").innerHTML = xhttp.responseText;
      } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
         showRequestAlert();
      }
   };
   xhttp.open("GET", "proxy.php?answer=" + ep + "&answerLetter=" + answer, true);
   xhttp.send();
}

function showRequestAlert() {
   var notificationAlert = document.createElement("DIV");
   notificationAlert.className = "col-md-10 alert alert-danger fade in";
   notificationAlert.role = "alert";
   notificationAlert.id = "request_Alert";
   notificationAlert.innerHTML = "Request resulted in error";
   document.getElementById("output_container").appendChild(notificationAlert);
   $("#request_Alert").delay(4000).fadeOut(800, function() {
      $(this).alert('close');
   });
}
