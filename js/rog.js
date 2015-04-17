$(function(){
	// Count down
	$('#countdown').timeTo(new Date('Thu May 07 2015 00:00:00 GMT+0800 (Taipei Standard Time)'));

	$(document).on('click', '.btn-menu-buy, .btn-menu-pro', function(event) {
		event.preventDefault();
		$('body').animate({
			scrollTop: 5547},
			200, function() {
			/* stuff to do after animation is complete */
		});
	});

	$(document).on('click', '.btn-buy', function(event) {
		event.preventDefault();
		$('.lightbox').show();
	});

	$(document).on('click', '.lightbox .close', function(event) {
		event.preventDefault();
		$('.lightbox').hide();
	});

	// resize
	$(window).resize(function() {
	  if ( $(window).width() < 1024 ) {
	  	$('body').addClass('mobile');
	  } else {
	  	$('body').removeClass('mobile');
	  }
	});
});