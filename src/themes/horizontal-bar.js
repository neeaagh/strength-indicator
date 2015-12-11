var horizontalBar = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-pass-strength si-pass-strength-horibars"></div>').insertAfter(target);
    for (var i = 0; i < 4; i++){
      target.next().append('<div></div>');
    }
    target.next().width(this.target.outerWidth());
    return this;
  },

  update: function(score) {
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

    this.target.next().children().slice(highlighted, 4).css('background', '#ddd');
    this.target.next().children().slice(0, highlighted).css('background', progressBarColor);
  }
};
