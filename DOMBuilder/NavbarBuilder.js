/**
 * Constructs the navigation bar
 * @returns new div
 */
function createNavbar () {
    var outmostContainer = document.createElement("DIV");
    outmostContainer.className = "navbarContainerDiv container-fluid";
    outmostContainer.id = "navbarContainerID";
    
    var navElement = document.createElement("NAV");
    navElement.className = "navbar navbar-default";
    
    var navBarContainer = document.createElement("DIV");
    navBarContainer.className = "container-fluid";
    
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
    
    var navList = document.createElement("UL");
    navList.className = "nav navbar-nav";
    
    var playListElement = document.createElement("LI");
    playListElement.className = "active";
    
    var playAnchor = document.createElement("A");
    playAnchor.href = "#";//todo
    playAnchor.innerHTML = "Play";
    
    var loadListElement = document.createElement("LI");
    
    var loadListAnchor = document.createElement("A");
    loadListAnchor.href = "#";//todo
    loadListAnchor.innerHTML = "Load";
    
    //Making the containment
    loadListElement.appendChild(loadListAnchor);
    playListElement.appendChild(playAnchor);
    navList.appendChild(playListElement);
    navList.appendChild(loadListElement);
    navListContainer.appendChild(navList);
    
    collapseButton.appendChild(iconSpan);
    collapseButton.appendChild(iconSpan.cloneNode());
    collapseButton.appendChild(iconSpan.cloneNode());
    
    headerDiv.appendChild(collapseButton);
    headerDiv.appendChild(brandElement);
    
    navBarContainer.appendChild(headerDiv);
    navBarContainer.appendChild(navListContainer);
    
    navElement.appendChild(navBarContainer);
    
    outmostContainer.appendChild(navElement);
    
    return outmostContainer;
}