$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 40
  };
  var options = {};
  var score = 0;
  var ui = strengthIndicatorUI;

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
    ui.initView(self);
  };

  var getSecurityScore = function(password) {
    score = ruleEngine.getScore(password);
    ui.updateView(score);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
  });

  init();
  return this; /* allow jquery chaining */
};

