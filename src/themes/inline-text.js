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
