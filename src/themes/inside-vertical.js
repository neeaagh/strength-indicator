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
