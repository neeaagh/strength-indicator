/*! strength-indicator - v1.0.0 - */
(function (jQuery) {
$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 40,
    ui: {
      theme: 'default'
    },
    power: 1.4
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

    rules = new RuleEngine(options);
    ui = new UIEngine(self, options.ui.theme);
    if (typeof options.onLoad === 'function'){
        options.onLoad();
      }
  };

  var getSecurityScore = function(password) {
    score = rules.percentageScore(password);
    ui.update(score);
  };

  this.on('input propertychange', function() {
    getSecurityScore(self.val());
    if (typeof options.onChange === 'function'){
        options.onChange(self, score);
      }
  });

  init();
  return this; 
};

var RuleEngine = function(options) {
  var self = this;

  this.init = function() {
    this.options = options;
    this.updateScore();
    this.updateActive();
    this.addRule();
    this.passingScore = this.options.passingScore;
  };

  this.addRule = function() {
    if ($.isArray(this.options.addRule)){
      $.each(this.options.addRule, function(idx, newRule){
        newRule.active = true;
        self.rules.push(newRule);
      });
    }
  }

  this.updateActive = function() {
    if ($.isArray(this.options.updateActive)) {
      $.each(this.options.updateActive, function(idx, updatedRule) {
        $.each(self.rules, function(index, defaultRule) {
          if (defaultRule.name === updatedRule.name) {
            defaultRule.active = updatedRule.active;
          }
        });
      });
    }
  };

  this.updateScore = function() {
    if ($.isArray(this.options.updateScore)) {
      $.each(this.options.updateScore, function(idx, updatedRule) {
        $.each(self.rules, function(index, defaultRule) {
          if (defaultRule.name === updatedRule.name) {
            defaultRule.score = updatedRule.score;
          }
        });
      });
    }
  };

  this.percentageScore = function(password) {
    return (this.getScore(password) / this.passingScore) * 100;
  };

  this.getScore = function(password) {
    var score = 0;

    $.each(this.rules, function(index, rule) {
      if (rule.active === true) {
        var funcStr = rule.handler;
        if (typeof rule.handler === "function") {
          if (rule.handler(password)) {
            score += rule.score;
            if (score < 0) { score = 0; }
          }
        }
      }
    });
    return this.lengthPower(password, score);
  };

  this.lengthPower = function(password, score) {
    var trueLength = password.replace(/(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g, '').length;
    var power = this.options.power;
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
    if (/(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g.test(password)) {
      return true;
    }
  };

  this.containsEmail = function(password) {
    var emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;
    if (emailRegex.test(password)) {
      return true;
    }
  };

  this.rules = [
    { handler: this.minLength, name: 'minLength', score: 10, active: true },
    { handler: this.containsCaps, name: 'containsCaps', score: 2, active: true },
    { handler: this.containsWeakPatterns, name: 'containsWeakPatterns', score: -5, active: true },
    { handler: this.containsEmail, name: 'containsEmail', score: -3, active: true },
    { handler: this.containsNumber, name: 'containsNumber', score: 3.5, active: true },
    { handler: this.containsSpecialChar, name: 'containsSpecialChar', score: 3.5, active: true }
  ];


  this.init();
};


var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = new HorizontalBar(this.target);
      break;
    case 'inside-horizontal':
      this.theme = new InsideHorizontalBar(this.target);
      break;
    case 'inside-vertical':
      this.theme = new InsideVerticalBar(this.target);
      break;
    case 'inline-text':
      this.theme = new InlineText(this.target);
      break;
    case 'none':
      this.theme = new NullTheme();
      break;
    default:
      this.theme = new DefaultTheme(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};

var DefaultTheme = function(target) {
  this.target = target;

  if (this.target.parent().attr('class') == 'input-group') {
    $('<div class="si-pass-strength si-pass-strength-default"><div class="si-progress"></div></div>').insertAfter(this.target.parent());
  } else {
    $('<div class="si-pass-strength si-pass-strength-default"><div class="si-progress"></div></div>').insertAfter(this.target);
  }
  this.target.next().width(this.target.outerWidth());

  this.update = function(score) {
    var progressBarColor = 'si-invalid';
    if (score >= 25) {
      progressBarColor = 'si-weak';
    }
    if (score >= 50) {
      progressBarColor = 'si-normal';
    }
    if (score >= 75) {
      progressBarColor = 'si-strong';
    }
    if (score >= 100) {
      progressBarColor = 'si-very-strong';
    }

    this.target.next().find('.si-progress').css('width', score + '%');
    this.target.next().find('.si-progress').attr('class', 'si-progress');
    this.target.next().find('.si-progress').addClass(progressBarColor);
  };
};

var HorizontalBar = function (target) {
  this.target = target;

  $('<div class="si-pass-strength si-pass-strength-horibars"></div>').insertAfter(this.target);
  for (var i = 0; i < 4; i++){
    this.target.next().append('<div class="si-default"></div>');
  }
  this.target.next().width(this.target.outerWidth());

  this.update = function(score){
    var highlighted = 0;
    var progressBarColor = 'si-invalid';

    if (score >= 25) {
      highlighted = 1;
      progressBarColor = 'si-weak';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = 'si-normal';
    }
    if (score >= 75) {
      highlighted = 3;
      progressBarColor = 'si-strong';
    }
    if (score >= 100) {
      highlighted = 4;
      progressBarColor = 'si-very-strong';
    }

    this.target.next().children().attr('class', 'si-default');
    this.target.next().children().slice(0, highlighted).addClass(progressBarColor);
  };
};

var InlineText = function(target) {
  this.target = target;

  $('<div class="si-pass-strength"></div>').insertAfter(this.target);
  this.target.next().width(this.target.outerWidth());

  this.update = function(score) {
    var progressBarColor = 'si-text-invalid';
    var description = 'Invalid';
    if (score >= 25) {
      progressBarColor = 'si-text-weak';
      description = 'Weak';
    }
    if (score >= 50) {
      progressBarColor = 'si-text-normal';
      description = 'Normal';
    }
    if (score >= 75) {
      progressBarColor = 'si-text-strong';
      description = 'Strong';
    }
    if (score >= 100) {
      progressBarColor = 'si-text-very-strong';
      description = 'Very Strong';
    }
    this.target.next().html(description);
    this.target.next().attr('class', 'si-text-default');
    this.target.next().addClass(progressBarColor);
  };
};

var InsideHorizontalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside"></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().append('<div class="si-default"></div>');
  }
  this.target.next().width(this.target.outerWidth() - 4);

  this.update = function(score) {
    var highlighted = 0;
    var progressBarColor = 'si-invalid';

    if (score >= 25) {
      highlighted = 1;
      progressBarColor = 'si-weak';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = 'si-normal';
    }
    if (score >= 75) {
      highlighted = 3;
      progressBarColor = 'si-strong';
    }
    if (score >= 100) {
      highlighted = 4;
      progressBarColor = 'si-very-strong';
    }

    var indicators = this.target.next().children();
    indicators.attr('class', 'si-default');
    indicators.slice(0, highlighted).addClass(progressBarColor);
  };
};

var InsideVerticalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-right-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside-vert"><div class="si-vert-container"></div></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().find('.si-vert-container').append('<div id='+i+' class="si-default"></div>');
  }
  this.target.parent().width(this.target.outerWidth() - 4);
  this.target.parent().height(this.target.outerHeight() - 4);

  this.update = function(score) {
    var highlighted = 4;
    var progressBarColor = 'si-invalid';

    if (score >= 25) {
      highlighted = 3;
      progressBarColor = 'si-weak';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = 'si-normal';
    }
    if (score >= 75) {
      highlighted = 1;
      progressBarColor = 'si-strong';
    }
    if (score >= 100) {
      highlighted = 0;
      progressBarColor = 'si-very-strong';
    }

    var indicators = this.target.next().children().children();
    indicators.attr('class', 'si-default');
    indicators.slice(highlighted).addClass(progressBarColor);
  };
};

var NullTheme = function() {

  this.update = function(score) {
    return null;
  };
};
}(jQuery));