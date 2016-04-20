/**
 * Created by Zsolt Deák 2016.03
 *
 * Constructs the navigation bar
 * @returns new div
 */
function createNavbar () {
    var outmostContainer = document.createElement("DIV");
    outmostContainer.className = "navbarContainerDiv container-fluid";
    outmostContainer.id = "navbarContainerID";
    
    var navElement = document.createElement("NAV");
    navElement.className = "navbar navbar-default navbar-fixed-top";
    
    var navBarContainer = document.createElement("DIV");
    navBarContainer.className = "container";
    
    var headerDiv = document.createElement("DIV");
    headerDiv.className = "navbar-header";
    
    var collapseButton = document.createElement("BUTTON");
    collapseButton.type = "button";
    collapseButton.className = "navbar-toggle";
    collapseButton.setAttribute( "data-toggle", "collapse" );
    collapseButton.setAttribute( "data-target", "#comparatorNavbar" );
    
    var iconSpan = document.createElement("SPAN");
    iconSpan.className = "icon-bar";
    
    var brandElement = document.createElement("A");
    brandElement.className = "navbar-brand";
    brandElement.href = "home.html";
    brandElement.innerHTML = "WoD";
    
    var navListContainer = document.createElement("DIV");
    navListContainer.className = "collapse navbar-collapse";
    navListContainer.id = "comparatorNavbar";
    
    var gameFunctionsNavList = document.createElement("UL");
    gameFunctionsNavList.className = "nav navbar-nav navbar-right";
    
    var playListElement = document.createElement("LI");
    
    var newGameAnchor = document.createElement("A");
    newGameAnchor.href = "#";
    newGameAnchor.innerHTML = "New game";
    addEvent( newGameAnchor, "click", function(event){
        episode = 1;
        character = new Character();
        loadStory(episode);
        indexStoryState();
    });
    
    var loadListElement = document.createElement("LI");
    
    var loadListAnchor = document.createElement("A");
    loadListAnchor.href = "#";//todo
    loadListAnchor.innerHTML = "Load";
    addEvent( loadListAnchor, "click", function(event){
        if( typeof(Storage) !== undefined ) {
            episode = localStorage.episode;
            character = loadCharacter(localStorage);
            loadStory(episode);
            indexStoryState();
        } else {
            showAlert("Your browser does not support Storage, sorry");
        }
    });
    
    var saveListElement = document.createElement("LI");
    
    var saveListAnchor = document.createElement("A");
    saveListAnchor.href = "#";//todo
    saveListAnchor.innerHTML = "Save";
    addEvent( saveListAnchor, "click", function(event){
        if( typeof(Storage) !== undefined ) {
            if ( localStorage.episode + 5 <= episode || localStorage.episode >= episode ) {
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
    
    //info navlist buttons
    var infoNavList = document.createElement("UL");
    infoNavList.className = "nav navbar-nav";
    
    var npcBookListElement = document.createElement("LI");
    
    var npcBookAnchor = document.createElement("A");
    npcBookAnchor.innerHTML = "NPC Book";
    npcBookAnchor.href = "#";
    
    //Making the containment
    loadListElement.appendChild(loadListAnchor);
    playListElement.appendChild(newGameAnchor);
    saveListElement.appendChild(saveListAnchor);
    gameFunctionsNavList.appendChild(playListElement);
    gameFunctionsNavList.appendChild(loadListElement);
    gameFunctionsNavList.appendChild(saveListElement);
    navListContainer.appendChild(gameFunctionsNavList);
    
    npcBookListElement.appendChild(npcBookAnchor);
    infoNavList.appendChild(npcBookListElement);
    navListContainer.appendChild(infoNavList);
    
    collapseButton.appendChild(iconSpan);
    collapseButton.appendChild(iconSpan.cloneNode());
    collapseButton.appendChild(iconSpan.cloneNode());
    
    headerDiv.appendChild(collapseButton);
    headerDiv.appendChild(brandElement);
    
    navBarContainer.appendChild(headerDiv);
    navBarContainer.appendChild(navListContainer);
    
    navElement.appendChild(navBarContainer);
    
    outmostContainer.appendChild(navElement);
    //fixed navbar hides content
    outmostContainer.style.paddingBottom = "70px";
    
    return outmostContainer;
}