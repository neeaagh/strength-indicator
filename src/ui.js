var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = new HorizontalBar(this.target);
      break;
    case 'inside-horizontal':
      this.theme = new InsideHorizontalBar(this.target);
      break;
    case 'inside-vertical':
      this.theme = new InsideVerticalBar(this.target);
      break;
    case 'inline-text':
      this.theme = new InlineText(this.target);
      break;
    case 'none':
      this.theme = new NullTheme();
      break;
    default:
      this.theme = new DefaultTheme(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};
