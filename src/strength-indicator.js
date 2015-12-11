$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 40
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
    $('<div class="si-strength-score"><div class="si-progress"></div></div>').insertAfter(self);
    $('.si-strength-score').css('width', self.outerWidth());
    updateView();
  };

  var getSecurityScore = function(password) {
    score = ruleEngine.getScore(password);
    updateView();
  };

  var updateView = function() {
    var progressBarColor = '#969696';
    if (score >= 25) {
      progressBarColor = '#DA5555';
    }
    if (score >= 50) {
      progressBarColor = '#F7CB4D';
    }
    if (score >= 75) {
      progressBarColor = '#F7F24D';
    }
    if (score >= 100) {
      progressBarColor = '#72D24B';
    }
    $('.si-progress').css('width', score + '%');
    $('.si-progress').css('background', progressBarColor);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
  });

  init();
  return this; /* allow jquery chaining */
};

