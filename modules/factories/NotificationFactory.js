/**
 * Created by Zsolt Deák 2017.01
 *
 * Notifications
 */

//TODO: better notification service
var module = angular.module("storyModule");

module.factory('notifications', function(){

    var MessageLevel = {
        INFO: "alert-info",
        ALERT: "alert-danger"
    };

    function showAlert( msg ) {
        show(msg, MessageLevel.ALERT);
    }

    function showInfo( msg ) {
       show(msg, MessageLevel.INFO);
    }

    function show( msg, level) {
        var alert = $("<div></div>",{
                        "class": "alert " + level + " fade in text-center",
                        "role": "alert",
                        "id": "temp_alert"
                    });
        alert.html(msg);
        $("#content_container").prepend(alert);
        alert.delay(4000).fadeOut(800, function(){
          $(this).alert('close');
        });
    }

    return {
        "showInfo": showInfo,
        "showAlert": showAlert
    };

});