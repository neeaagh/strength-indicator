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
