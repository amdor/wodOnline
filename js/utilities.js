/**
 * Created by Zsolt Deák 2016.04
 */


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
 *Appends a responsive image to the given element
 */
function appendImage( imagePath, elementSelect) {
   var $downloadingImage = $("<img>");
   var $image = $("<img class=\"responsive\">");
   $downloadingImage.load(function(){
      $image.attr("src", $(this).attr("src"));
   });
   $downloadingImage.attr( "src", imagePath );
   $(elementSelect).append( $image );
}