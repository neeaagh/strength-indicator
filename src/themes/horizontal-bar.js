var horizontalBarTheme = {
  target: null,

  init: function(target) {
    this.target = target;
    $('<div class="si-strength-score"><div class="si-progress"></div></div>').insertAfter(target);
  },

  update: function(score) {
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
    $('.si-progress').css('width', score + '%');
    $('.si-progress').css('background', progressBarColor);
  }
};
