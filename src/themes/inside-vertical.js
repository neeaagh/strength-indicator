var insideVerticalBar = {
  target: null,

  init: function(target) {
    this.target = target;
    target.addClass('si-inner-right-padding');
    target.wrap( "<div class='si-pass-wrap'></div>");
    $('<div class="si-pass-strength si-pass-strength-inside-vert"><div class="si-vert-container"></div></div>').insertAfter(target);
    // TODO :target reference
    for (var i = 0; i < 4; i++){
      target.next().find('.si-vert-container').append('<div id='+i+'></div>');
    }
    target.parent().width(this.target.outerWidth() - 4);
    target.parent().height(this.target.outerHeight() - 4);
    return this;
  },

  update: function(score) {
    var highlighted = 4;
    var progressBarColor = '#969696';

    if (score >= 25) {
      highlighted = 3;
      progressBarColor = '#DA5555';
    }
    if (score >= 50) {
      highlighted = 2;
      progressBarColor = '#F7CB4D';
    }
    if (score >= 75) {
      highlighted = 1;
      progressBarColor = '#F7F24D';
    }
    if (score >= 100) {
      highlighted = 0;
      progressBarColor = '#72D24B';
    }

    var indicators = this.target.next().children().children();
    indicators.slice(0, highlighted).css('background', '#ddd');
    indicators.slice(highlighted).css('background', progressBarColor);
  }
};
