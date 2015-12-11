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
  var ui = null;
  var rules = null;

  var init = function () {
    
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }

    rules = new RuleEngine();
    ui = new UIEngine(self, options.ui.theme);
  };

  var getSecurityScore = function(password) {
    score = rules.getScore(password);
    ui.update(score);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
  });

  init();
  return this; 
};

var RuleEngine = function() {

  this.rules = [
    { handler: 'minLength', score: 10, active: true },
    { handler: 'containsCaps', score: 2, active: true },
    { handler: 'containsWeakPatterns', score: -5, active: true },
    { handler: 'containsEmail', score: -3, active: true },
    { handler: 'containsNumber', score: 3.5, active: true },
    { handler: 'containsSpecialChar', score: 3.5, active: true }
  ];

  thisweakPatterns = /(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g;

  this.getScore = function(password) {
    var score = 0;

    $.each(this.rules, function(index, rule) {
      if (rule.active === true) {
        var funcStr = rule.handler;
        var func = this[funcStr];
        if (typeof func === "function") {
          if (func(password)) {
            score += rule.score;
          }
        }
      }
    });
    return this.lengthPower(password, score);
  };

  this.lengthPower = function(password, score) {
    var trueLength = password.replace(this.weakPatterns, '').length;
    var power = 1.4;
    return Math.pow(trueLength + score, power);
  };

  this.minLength = function(password) {
    if (password.length >= 8) {
      return true;
    }
  };

  this.containsCaps = function(password) {
    var regex = /[A-Z]/;
    if (regex.test(password)) {
      return true;
    }
  };

  this.containsSpecialChar = function(password) {
    var regex = /[!,@,#,$,%,\^,&,*,?,_,~]/;
    if (regex.test(password)) {
      return true;
    }
  };

  this.containsNumber = function(password) {
    var regex = /[0-9]/;
    if (regex.test(password)) {
      return true;
    }
  };

  this.containsWeakPatterns = function(password) {
    if (this.weakPatterns.test(password)) {
      console.log('pattern match');
      return true;
    }
  };

  this.containsEmail = function(password) {
    var emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;
    if (emailRegex.test(password)) {
      return true;
    }
  };
};


var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = horizontalBar.init(this.target);
      break;
    case 'inside-horizontal':
      this.theme = insideHorizontalBar.init(this.target);
      break;
    case 'inside-vertical':
      this.theme = insideVerticalBar.init(this.target);
      break;
    case 'inline-text':
      this.theme = inlineText.init(this.target);
      break;
    default:
      this.theme = defaultTheme.init(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};

var defaultTheme = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength si-pass-strength-default"><div class="si-progress"></div></div>').insertAfter(target);
    target.next().width(this.target.outerWidth());
    return this;
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

    $(this.target).next().find('.si-progress').css('width', score + '%');
    $(this.target).next().find('.si-progress').css('background', progressBarColor);
  }
};

var horizontalBar = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength si-pass-strength-horibars"></div>').insertAfter(target);
    for (var i = 0; i < 4; i++){
      target.next().append('<div></div>');
    }
    target.next().width(this.target.outerWidth());
    return this;
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

    this.target.next().children().slice(highlighted, 4).css('background', '#ddd');
    this.target.next().children().slice(0, highlighted).css('background', progressBarColor);
  }
};

var inlineText = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength"></div>').insertAfter(target);
    target.next().width(this.target.outerWidth());
    return this;
  },

  update: function(score) {
    var progressBarColor = '#969696';
    var description = 'Invalid';
    if (score >= 25) {
      progressBarColor = '#DA5555';
      description = 'Weak';
    }
    if (score >= 50) {
      progressBarColor = '#F7CB4D';
      description = 'Normal';
    }
    if (score >= 75) {
      progressBarColor = '#F7F24D';
      description = 'Strong';
    }
    if (score >= 100) {
      progressBarColor = '#72D24B';
      description = 'Very Strong';
    }
    $(this.target).next().html(description);
    $(this.target).next().css('color', progressBarColor);
  }
};

var insideHorizontalBar = {
  target: null,

  init: function(target) {
    this.target = target;
    target.addClass('si-inner-padding');
    target.wrap( "<div class='si-pass-wrap'></div>");
    $('<div class="si-pass-strength si-pass-strength-inside"></div>').insertAfter(target);
    // TODO: use target handle
    for (var i = 0; i < 4; i++){
      $('.si-pass-strength').append('<div></div>');
    }
    $('.si-pass-strength').width(this.target.outerWidth() - 4);
    return this;
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

    $(this.target).next().children().slice(highlighted, 4).css('background', '#ddd');
    $(this.target).next().children().slice(0, highlighted).css('background', progressBarColor);
  }
};

var insideVerticalBar = {
  target: null,

  init: function(target) {
    this.target = target;
    target.addClass('si-inner-right-padding');
    target.wrap( "<div class='si-pass-wrap'></div>");
    $('<div class="si-pass-strength si-pass-strength-inside-vert"><div class="si-vert-container"></div></div>').insertAfter(target);
    for (var i = 0; i < 4; i++){
      $('.si-vert-container').append('<div></div>');
    }
    $('.si-pass-wrap').width(this.target.outerWidth() - 4);
    $('.si-pass-wrap').height(this.target.outerHeight() - 4);
    return this;
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

    console.log($(this.target).next().children().next().length);

    // $(this.target).next().first().children().slice(highlighted, 4).css('background', '#ddd');
    // $(this.target).next().first().children().slice(0, highlighted).css('background', progressBarColor);
  }
};
}(jQuery));