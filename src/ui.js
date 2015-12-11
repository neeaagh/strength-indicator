var UIEngine = {
  target: null,
  theme: null,

  init: function(target, themeName) {
    this.target = target;
    this.setThemeClass(themeName);
    this.theme.init(target);
  },

  setThemeClass: function(themeName) {
    var themeClass = defaultTheme;
    if (themeName === 'horizontal-bar') {
      themeClass = horizontalBarTheme;
    }
    this.theme = themeClass;
  },

  update: function(score) {
    this.theme.update(score);
  }
};
