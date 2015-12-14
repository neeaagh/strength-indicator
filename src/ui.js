var UIEngine = function(target, themeName) {
  this.target = target;
  switch(themeName){
    case 'horizontal-bar':
      this.theme = new horizontalBar(this.target);
      break;
    case 'inside-horizontal':
      this.theme = new insideHorizontalBar(this.target);
      break;
    case 'inside-vertical':
      this.theme = new insideVerticalBar(this.target);
      break;
    case 'inline-text':
      this.theme = new inlineText(this.target);
      break;
    default:
      this.theme = new defaultTheme(this.target);
  }

  this.update = function(score) {
    this.theme.update(score);
  };
};
