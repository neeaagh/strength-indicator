/*! strength-indicator - v1.0.0 - */
(function (jQuery) {
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
  return this; 
};

var RuleEngine = function(options) {
  this.power = options.power;
  console.log(this.options);

  this.getScore = function(password) {
    var score = 0;

    $.each(this.rules, function(index, rule) {
      if (rule.active === true) {
        var funcStr = rule.handler;
        if (typeof rule.handler === "function") {
          if (rule.handler(password)) {
            score += rule.score;
          }
        }
      }
    });
    return this.lengthPower(password, score);
  };

  this.lengthPower = function(password, score) {
    var trueLength = password.replace(/(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g, '').length;
    var power = this.power;
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

  this.activeStatus = function(ruleSet) {
    $.each(ruleSet, function(index, arg) {
      $.each(this.rules, function(idx, rule) {
        if (typeof arg.status !== 'boolean') { return; }
        if ('this.' + arg.ruleName == rule.handler.toString){
          rule.active = arg.status;
        }
      });
    });
  };

  this.rules = [
    { handler: this.minLength, score: 10, active: true },
    { handler: this.containsCaps, score: 2, active: true },
    { handler: this.containsWeakPatterns, score: -5, active: true },
    { handler: this.containsEmail, score: -3, active: true },
    { handler: this.containsNumber, score: 3.5, active: true },
    { handler: this.containsSpecialChar, score: 3.5, active: true }
  ];
};


var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = new horizontalBar(this.target);
      break;
    case 'inside-horizontal':
      this.theme = new insideHorizontalBar(this.target);
      break;
    case 'inside-vertical':
      this.theme = new insideVerticalBar(this.target);
      break;
    case 'inline-text':
      this.theme = new inlineText(this.target);
      break;
    default:
      this.theme = new defaultTheme(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};

var defaultTheme = function(target) {
  this.target = target;

  $('<div class="si-pass-strength si-pass-strength-default"><div class="si-progress"></div></div>').insertAfter(this.target);
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

var horizontalBar = function (target) {
  this.target = target;

  $('<div class="si-pass-strength si-pass-strength-horibars"></div>').insertAfter(this.target);
  for (var i = 0; i < 4; i++){
    this.target.next().append('<div class="si-default"></div>');
  };
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

var inlineText = function(target) {
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

var insideHorizontalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside"></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().append('<div class="si-default"></div>');
  };
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

var insideVerticalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-right-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside-vert"><div class="si-vert-container"></div></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().find('.si-vert-container').append('<div id='+i+' class="si-default"></div>');
  };
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
}(jQuery));