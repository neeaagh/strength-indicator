var DefaultTheme = function(target) {
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
