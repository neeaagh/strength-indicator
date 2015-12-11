$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 40,
    ui: {
      theme: 'default'
    }
  };
  var options = {};
  var score = 0;
  var ui = UIEngine;

  var init = function () {
    /* merge default to options */
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }
    /* render the view */
    ui.init(self, options.ui.theme);
  };

  var getSecurityScore = function(password) {
    score = ruleEngine.getScore(password);
    ui.update(score);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
  });

  init();
  return this; /* allow jquery chaining */
};
