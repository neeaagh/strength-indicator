/* ensure $ is meant for jquery */
(function ( $ ) {
  $.fn.strengthIndicator = function() {

    this.on('input propertychange', function() {
      console.log("fired!");
    });

    return this; /* allow jquery chaining */
  };
}( jQuery )); /* ensure $ is meant for jquery */

