$('#info-link').hover(function () {
  console.log('hovered');
  $('#info-tip').css('display', 'block');
}, function () {
  $('#info-tip').css('display', 'none');
});
