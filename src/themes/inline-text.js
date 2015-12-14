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
