$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 15
  };
  var options = {};
  var score = 0;

  var init = function () {
    /* merge default to options */
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }
    console.log(options);
    /* render the view */
    initView();
  };

  var initView = function() {
    $('<div class="si-strength-score"></div>').insertAfter(self);
    updateView();
  };

  var getSecurityScore = function(password) {
    score = ruleEngine.getScore(password);
    updateView();
  };

  var updateView = function() {
    $('.si-strength-score').html(score);
    if (score > options.passingScore) {
      $('.si-strength-score').css('color','#bada55');
    } else {
      $('.si-strength-score').css('color', '#000');
    }
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
  });

  init();
  return this; /* allow jquery chaining */
};

