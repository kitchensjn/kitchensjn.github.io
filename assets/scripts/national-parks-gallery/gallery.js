$('.slick-slider').lazy();
$('.embeddedYoutube').lazy();

$(".slick-slider")
  .slick({
      dots: false,
      infinite: true,
      centerMode: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      autoplay: true,
      arrows: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      draggable: false,
      initialSlide: 0,
      lazyLoad: 'ondemand',
      useTransform: false,
  });

$(".slick-slider").each(function() {
  $(this).magnificPopup({
    delegate: 'a', //:not(.slick-cloned)',
		type: 'image',
		showCloseBtn: false,
		tLoading: '', //Loading image #%curr%...
		mainClass: 'mfp-img-mobile',
		gallery: {
		  arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
			enabled: true,
			navigateByImgClick: true,
			tCounter: '<span class="mfp-counter"></span>',
			preload: 0 // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
		},
		callbacks: {
		  beforeOpen: function() {
        $('.slick-slider').slick('slickPause');
      },
      afterClose: function() {
        $('.slick-slider').slick('slickPlay');
      },
			change: function() {
				console.log(this.items.length);
        $('.slick-slider').slick('slickGoTo', (this.index-2)%((this.items.length-2)/2));
      }
		}
  });
});