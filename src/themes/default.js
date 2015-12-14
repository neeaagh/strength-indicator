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
