/*! strength-indicator - v1.0.0 - */
(function ( $ ) {
  $.fn.strengthIndicator = function() {

    this.on('input propertychange', function() {
      console.log("fired!");
    });

    return this; 
  };
}( jQuery )); 

