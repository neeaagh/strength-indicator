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

