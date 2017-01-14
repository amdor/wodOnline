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

//////////////////////
//////API/////////////
//////////////////////

    function showAlert( msg ) {
        show(msg, MessageLevel.ALERT);
    }

    function showInfo( msg ) {
       show(msg, MessageLevel.INFO);
    }

    function closeModal() {
        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    function showConfirm(title, body, confirmButtonText, onConfirm) {
        var button = $("<button>",
                      {"class": "btn btn-primary",
                      "id": "modal_confirm_button",
                      "text": confirmButtonText,
                       "data-dismiss":"modal"} ).on("click", onConfirm);
        button.on("click", function() {
            closeModal();
        });
        var modal = $(".modal");
        $("#modalTitle").html(title);
        $("#modalBody").html(body);
        $(".modal #modal_confirm_button").remove(); //remove if there were same button(s)
        modal.find(".modal-footer")
                .append( button );
        modal.modal("show");
    }


//////////////////////
///////HELPERS////////
//////////////////////

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
        "showAlert": showAlert,
        "closeModal": closeModal,
        "showConfirm": showConfirm
    };

});