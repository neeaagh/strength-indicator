/*! strength-indicator - v1.0.0 - */
(function ( $ ) {
  $.fn.strengthIndicator = function(userOptions) {
    var self = this;
    var defaults = {
      score: 0
    };
    var options = {};
    var score = 0;

    var init = function () {
      
      if (typeof userOptions === 'object') {
        options = $.extend(defaults, userOptions);
      }
      else {
        options = defaults;
      }
      console.log(options);
      
      initView();
    };

    var initView = function() {
      $('<div class="si-strength-score"></div>').insertAfter(self);
      updateView();
    };

    var getSecurityScore = function(password) {
      this.score =  Math.random() * 100 + 1;
      updateView();
    };

    var updateView = function() {
      $('.si-strength-score').html(this.score);
    };

    this.on('input propertychange', function() {
      getSecurityScore(self.val());
    });

    init();
    return this; 
  };
}( jQuery )); 

