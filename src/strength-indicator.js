$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 40,
    ui: {
      theme: 'default'
    },
    rules: {
      power: 1.4
    }
  };
  var options = {};
  var score = 0;
  var ui = null;
  var rules = null;

  var init = function () {
    /* merge default to options */
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }

    rules = new RuleEngine(options.rules);
    ui = new UIEngine(self, options.ui.theme);
    if (typeof options.onLoad === 'function'){
        options.onLoad();
      }
  };

  var getSecurityScore = function(password) {
    score = rules.getScore(password);
    ui.update(score);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
    if (typeof options.onChange === 'function'){
        options.onChange(self, score);
      }
  });

  init();
  return this; /* allow jquery chaining */
};
