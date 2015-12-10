/*! strength-indicator - v1.0.0 - */
(function (jQuery) {
$.fn.strengthIndicator = function(userOptions) {
  var self = this;
  var defaults = {
    passingScore: 15
  };
  var options = {};
  var score = 0;

  var init = function () {
    
    if (typeof userOptions === 'object') {
      options = $.extend(defaults, userOptions);
    }
    else {
      options = defaults;
    }
    console.log(options);
    
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
  return this; 
};


var ruleEngine = {
  rules: [
    { handler: 'minLength', score: 10, active: true },
    { handler: 'containsCaps', score: 2, active: true },
    { handler: 'badPasswords', score: -5, active: true },
    { handler: 'emailMatch', score: -2, active: true },
    { handler: 'containsNumber', score: 4, active: true },
    { handler: 'containsSpecialChar', score: 4, active: true }
  ],

  validtion: {},

  getScore: function(password) {
    var score = 0;

    $.each(this.rules, function(index, rule) {
      if (rule.active == true) {
        var funcStr = rule.handler;
        var func = ruleEngine[funcStr];
        if (typeof func === "function") {
          if (func(password)) {
            score += rule.score;
          }
        }
      }
    });
    return score;
  },

  minLength: function(password) {
    if (password.length >= 5){
      return true;
    }
  },

  containsCaps: function(password) {
    var regex = /[A-Z]/;
    if (regex.test(password)){
      return true;
    }
  },

  containsSpecialChar: function(password){
    var regex = /[!,@,#,$,%,\^,&,*,?,_,~]/;
    if (regex.test(password)){
      return true;
    }
  },

  containsNumber: function(password){
    var regex = /[0-9]/;
    if (regex.test(password)){
      return true;
    }
  },

  badPasswords: function(password){
    var pw = /(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/;
    if (pw.test(password)) {
      return true;
    }
  },

  emailMatch: function(password){
    var emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;
    if (emailRegex.test(password)) {
      console.log('has email');
      return true;
    }
  }
};

}(jQuery));