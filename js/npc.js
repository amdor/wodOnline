/**
 * Created by Zsolt Deák 2016.04
 */

/**
 * Gets npcs from the database
 */
function windowLoaded( ) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            fillTable(JSON.parse( xhttp.responseText ));
        } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
           showAlert("Request resulted in error");
        }
    };
    xhttp.open("GET", "proxy.php?npc", true);
    xhttp.send();
    addEvent(document.getElementById("content_container"), "click", toggleNav);
}

/**
 * Handle response, fill table
 */
function fillTable(npcs) {
    var table = document.getElementById("npcTable_body");

    for (var i = 0; i < npcs.length; i++) {
        var npc = npcs[i];

        /* insert row and cells on last position (-1)
           https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement.insertRow */
        var row = table.insertRow(-1);
        var cell_name = row.insertCell(-1);
        var cell_attack = row.insertCell(-1);
        var cell_def = row.insertCell(-1);
        var cell_health = row.insertCell(-1);
        var cell_level = row.insertCell(-1);

        /* $(element) makes it possible to call jQuery
           convenience methods on them like text() */
        $(cell_name).text(npc.Name);
        $(cell_attack).text(npc.attackPower);
        $(cell_def).text(npc.defensePower);
        $(cell_health).text(npc.healthPoint);
        $(cell_level).text(npc.level);
    }
}