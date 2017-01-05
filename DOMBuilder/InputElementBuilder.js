var textDivTopIndex = -1;

/**
 * Creates a div that contains a textfiled, a plus and a minus button
 * @param {String | undefined} textContent string to be added to the given new textField as value
 * @returns new div
 */
function createTextDiv( textContent ) {
   textDivTopIndex++;
   var newTextDiv = document.createElement("DIV");
   newTextDiv.className = "inputTextDiv form-group row";
   newTextDiv.id = "uriArray"+textDivTopIndex;
   newTextDiv.setAttribute("index", textDivTopIndex);
   //newTextDiv.innerHTML = "hasznaltauto.hu url:";
   
   //textfield that asks for a car uri and its align-responsible container
   var textField = document.createElement("INPUT");
   textField.id = uriInputFieldIdPrefix + textDivTopIndex;
   textField.type = "url";
   textField.name = "carUri"+textDivTopIndex;
   textField.className = "form-control";
   textField.placeholder = "hasznaltauto.hu url";
   textField.value = (textContent === undefined) ? "" : textContent;
   //all textfield has it, but there is to be 10 at maximum so the logic overhead would be greater(always the last one should have it) than this efficiency decrease
   addEvent( textField, "focus", addOnFocus);
   
   var textFieldAlignerDiv = document.createElement("DIV");
   textFieldAlignerDiv.className = "col-xs-10 col-sm-10 col-sm-10";
   textFieldAlignerDiv.appendChild(textField);
   
   //add a new input field, or remove current
   var inputButtonMinus = document.createElement("BUTTON");
   inputButtonMinus.className = "btn btn-default btn-sm col-xs-1 col-sm-1 col-md-1 form-control-static";
   inputButtonMinus.type = "button"; //avoid submit, which is default for buttons on forms   
   inputButtonMinus.innerHTML = "-";
   inputButtonMinus.id = "inputButtonMinus" + textDivTopIndex;
   
   newTextDiv.appendChild(textFieldAlignerDiv);
   newTextDiv.appendChild(inputButtonMinus);
   
   currentInputUriCount++;
   
   return newTextDiv
}

function addOnFocus(event) {
   if ( isLastField(event.target) && currentInputUriCount < 10 ) {
      var addedTextDiv = createTextDiv();
      formElement.insertBefore(addedTextDiv, sendButtonDiv);
      event.stopPropagation();
   }
}

function isLastField(field) {
    textDivTopIndex = 0;
    $(".inputTextDiv").each(function(index) {
        textDivTopIndex = ( $(this).attr("index") > textDivTopIndex ) ? $(this).attr("index") : textDivTopIndex;
    });
   return textDivTopIndex == field.parentElement.parentElement.getAttribute("index") || currentInputUriCount === 1;
}