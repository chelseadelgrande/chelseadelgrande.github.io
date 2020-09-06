// Navbar icon cross on click and menu covers whole page.
$('.menu-icon').click(function(){
  $('ul').slideToggle(400);
  $('.menu-icon').toggleClass('change');
});
