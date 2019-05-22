var textArea = document.querySelector('.form__textarea');

textArea.addEventListener('keyup', function (event, lineHeight, minLineCount) {
  lineHeight = 15;
  minLineCount = 2;

  var minLineHeight = minLineCount * lineHeight;
  var obj = event.target;
  var div = document.querySelector('.form__textarea-div');
  div.innerHTML = obj.value;
  var objHeight = div.offsetHeight;
  if (event.keyCode === 13) {
    objHeight += lineHeight;
  }
  else if (objHeight < minLineHeight) {
    objHeight = minLineHeight;
  }
  obj.style.height = objHeight/1.5 + 'px';
});
