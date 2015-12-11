var UIEngine = {
  target: null,
  theme: null,

  init: function(target, themeName) {
    this.target = target;
    this.setThemeClass(themeName);
    this.theme.init(target);
  },

  setThemeClass: function(themeName) {
    switch(themeName){
    case 'horizontal-bar':
      this.theme = horizontalBar;
      break;
    case 'inside-horizontal':
      this.theme = insideHorizontalBar;
      break;
    default:
      this.theme = defaultTheme;
    }
  },

  update: function(score) {
    this.theme.update(score);
  }
};
