/*! strength-indicator - v1.0.0 - */
(function (jQuery) {
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
    
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }
    
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
  return this; 
};

var ruleEngine = {
  rules: [
    { handler: 'minLength', score: 10, active: true },
    { handler: 'containsCaps', score: 2, active: true },
    { handler: 'containsWeakPatterns', score: -5, active: true },
    { handler: 'containsEmail', score: -3, active: true },
    { handler: 'containsNumber', score: 3.5, active: true },
    { handler: 'containsSpecialChar', score: 3.5, active: true }
  ],

  weakPatterns: /(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g,

  getScore: function(password) {
    var score = 0;

    $.each(this.rules, function(index, rule) {
      if (rule.active === true) {
        var funcStr = rule.handler;
        var func = ruleEngine[funcStr];
        if (typeof func === "function") {
          if (func(password)) {
            score += rule.score;
          }
        }
      }
    });
    return ruleEngine.lengthPower(password, score);
  },

  lengthPower: function(password, score) {
    var trueLength = password.replace(ruleEngine.weakPatterns, '').length;
    var power = 1.4;
    return Math.pow(trueLength + score, power);
  },

  minLength: function(password) {
    if (password.length >= 8) {
      return true;
    }
  },

  containsCaps: function(password) {
    var regex = /[A-Z]/;
    if (regex.test(password)) {
      return true;
    }
  },

  containsSpecialChar: function(password) {
    var regex = /[!,@,#,$,%,\^,&,*,?,_,~]/;
    if (regex.test(password)) {
      return true;
    }
  },

  containsNumber: function(password) {
    var regex = /[0-9]/;
    if (regex.test(password)) {
      return true;
    }
  },

  containsWeakPatterns: function(password) {
    if (ruleEngine.weakPatterns.test(password)) {
      console.log('pattern match');
      return true;
    }
  },

  containsEmail: function(password) {
    var emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;
    if (emailRegex.test(password)) {
      return true;
    }
  }
};


var UIEngine = {
  target: null,
  theme: null,

  init: function(target, themeName) {
    this.target = target;
    this.setThemeClass(themeName);
    this.theme.init(target);
  },

  setThemeClass: function(themeName) {
    var themeClass = defaultTheme;
    if (themeName === 'horizontal-bar') {
      themeClass = horizontalBarTheme;
    }
    this.theme = themeClass;
  },

  update: function(score) {
    this.theme.update(score);
  }
};

var defaultTheme = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength si-pass-strength-default"><div class="si-progress"></div></div>').insertAfter(target);
    //  TODO: make selector from target chain.
    $('.si-pass-strength').width(this.target.outerWidth());
  },

  update: function(score) {
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
  }
};

var horizontalBarTheme = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength"></div>').insertAfter(target);
    for (var i = 0; i < 4; i++){
      $('.si-pass-strength').append('<div class="si-bars"></div>');
    }
      $('.si-pass-strength').width(this.target.outerWidth());
  },

  update: function(score) {
    var highlighted = 0;
    var progressBarColor = '#969696';

    if (score >= 25) {
      highlighted = 1;
      progressBarColor = '#DA5555';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = '#F7CB4D';
    }
    if (score >= 75) {
      highlighted = 3;
      progressBarColor = '#F7F24D';
    }
    if (score >= 100) {
      highlighted = 4;
      progressBarColor = '#72D24B';
    }

    console.log($(this.target).next().children());
    $(this.target).next().children().slice(highlighted, 4).css('background', '#ddd');
    $(this.target).next().children().slice(0, highlighted).css('background', progressBarColor);
  }
};
}(jQuery));