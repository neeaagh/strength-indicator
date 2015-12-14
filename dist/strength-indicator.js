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

    this.target.next().find('.si-progress').css('width', score + '%');
    this.target.next().find('.si-progress').css('background', progressBarColor);
  };
};

var horizontalBar = function (target) {
  this.target = target;

  $('<div class="si-pass-strength si-pass-strength-horibars"></div>').insertAfter(this.target);
  for (var i = 0; i < 4; i++){
    this.target.next().append('<div></div>');
  };
  this.target.next().width(this.target.outerWidth());

  this.update = function(score){
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
  };
};

var inlineText = function(target) {
  this.target = target;

  $('<div class="si-pass-strength"></div>').insertAfter(this.target);
  this.target.next().width(this.target.outerWidth());

  this.update = function(score) {
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
    this.target.next().html(description);
    this.target.next().css('color', progressBarColor);
  };
};

var insideHorizontalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside"></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().append('<div></div>');
  };
  this.target.next().width(this.target.outerWidth() - 4);

  this.update = function(score) {
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

    var indicators = this.target.next().children();
    indicators.slice(highlighted, 4).css('background', '#ddd');
    indicators.slice(0, highlighted).css('background', progressBarColor);
  };
};

var insideVerticalBar = function(target) {
  this.target = target;

  this.target.addClass('si-inner-right-padding');
  this.target.wrap( "<div class='si-pass-wrap'></div>");
  $('<div class="si-pass-strength si-pass-strength-inside-vert"><div class="si-vert-container"></div></div>').insertAfter(this.target);

  for (var i = 0; i < 4; i++){
    this.target.next().find('.si-vert-container').append('<div id='+i+'></div>');
  };
  this.target.parent().width(this.target.outerWidth() - 4);
  this.target.parent().height(this.target.outerHeight() - 4);

  this.update = function(score) {
    var highlighted = 4;
    var progressBarColor = '#969696';

    if (score >= 25) {
      highlighted = 3;
      progressBarColor = '#DA5555';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = '#F7CB4D';
    }
    if (score >= 75) {
      highlighted = 1;
      progressBarColor = '#F7F24D';
    }
    if (score >= 100) {
      highlighted = 0;
      progressBarColor = '#72D24B';
    }

    var indicators = this.target.next().children().children();
    indicators.slice(0, highlighted).css('background', '#ddd');
    indicators.slice(highlighted).css('background', progressBarColor);
  };
};
}(jQuery));