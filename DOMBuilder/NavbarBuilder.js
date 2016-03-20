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
    brandElement.innerHTML = "AutoComparator";
    
    var navListContainer = document.createElement("DIV");
    navListContainer.className = "collapse navbar-collapse";
    navListContainer.id = "comparatorNavbar";
    
    var navList = document.createElement("UL");
    navList.className = "nav navbar-nav";
    
    var homepageListElement = document.createElement("LI");
    homepageListElement.className = "active";
    
    var homepageAnchor = document.createElement("A");
    homepageAnchor.href = "home.html";
    homepageAnchor.innerHTML = "Autók";
    
    var resultListListElement = document.createElement("LI");
    
    var resultListAnchor = document.createElement("A");
    resultListAnchor.href = "#";
    resultListAnchor.innerHTML = "Találati lista";
    
    var advancedSearchListElement = document.createElement("LI");
    
    var advancedSearchAnchor = document.createElement("A");
    advancedSearchAnchor.href = "#";
    advancedSearchAnchor.innerHTML = "Bővebb keresés";
    
    //Making the containment
    advancedSearchListElement.appendChild(advancedSearchAnchor);
    resultListListElement.appendChild(resultListAnchor);
    homepageListElement.appendChild(homepageAnchor);
    navList.appendChild(homepageListElement);
    navList.appendChild(resultListListElement);
    navList.appendChild(advancedSearchListElement);
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