var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = horizontalBar.init(this.target);
      break;
    case 'inside-horizontal':
      this.theme = insideHorizontalBar.init(this.target);
      break;
    case 'inside-vertical':
      this.theme = insideVerticalBar.init(this.target);
      break;
    case 'inline-text':
      this.theme = inlineText.init(this.target);
      break;
    default:
      this.theme = defaultTheme.init(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};
