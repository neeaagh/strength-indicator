var ruleEngine = {
  rules: [
    { handler: 'minLength', score: 10, active: true },
    { handler: 'containsCaps', score: 2, active: true },
    { handler: 'badPasswords', score: -5, active: true },
    { handler: 'emailMatch', score: -2, active: true },
    { handler: 'containsNumber', score: 4, active: true },
    { handler: 'containsSpecialChar', score: 4, active: true }
  ],

  weakPatterns: /(123456)|(12345678)|(password)|(abc123)|(abcdefg)|(qwerty)|(zxcvb)|(admin)/g,

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
    console.log(self);
    return score + ruleEngine.lengthPower(password);
  },

  lengthPower: function(password) {
    var trueLength = password.replace(ruleEngine.weakPatterns, '').length;
    var power = 1.4;
    return Math.pow(trueLength, power);
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
    if (ruleEngine.weakPatterns.test(password)) {
      console.log('pattern match');
      return true;
    }
  },

  emailMatch: function(password){
    var emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;
    if (emailRegex.test(password)) {
      return true;
    }
  }
};

