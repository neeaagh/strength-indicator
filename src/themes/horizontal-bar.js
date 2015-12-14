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
