$(document).ready(function () {

	// SCROLL CHECK
	var scrollPos = 0;

	function throttle(fn, wait) {
		var time = Date.now();
		return function () {
			if ((time + wait - Date.now()) < 0) {
				fn();
				time = Date.now();
			}
		}
	}

	window.addEventListener('scroll', throttle(scrollCheck, 50));

	// CHANGE NAV ON SCROLL
	function scrollCheck() {
		scrollPos = $(window).scrollTop();

		if (scrollPos >= 50) {
			$('.navbar').addClass('change');
		} else {
			$('.navbar').removeClass('change');
		}
		if (scrollPos >= 40) {
			$('.boxitBar').addClass('fixed');
			$('.separatetopfixed').show();
		} else {
			$('.boxitBar').removeClass('fixed');
			$('.separatetopfixed').hide();

		}
		//console.log('scrollPos',scrollPos);


	}

	// NAV TOGGLE
	/*
	$('.navbar-toggle').click(function() {
		$('#navbar').toggleClass('nav-open');
		$(this).toggleClass('collapsed');
	});
	*/
	$('.navbarlink').click(function () {
		$('#navbar').toggleClass('nav-open');
		$(this).toggleClass('collapsed');
		goTopPage();
		console.log('navbarlink click');
	});
	function goTopPage() {
		var target = $('body');
		$('html,body').animate({
			scrollTop: (target.offset().top - 1)
		}, 1000);
	}
	// MOVE STORE BTN TO RIGHT NAV IF < 992
	var winWidth = $(window).width();

	if (winWidth < 992) {
		$('#navbar a.btn-store').closest('li').prependTo('.navbar-right');
		$('#navbar a.btn-primary').closest('li').insertBefore('#navbar a.btn-secondary');
	}

	// INLINE SVG
	$('img.svg').each(function () {
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		jQuery.get(imgURL, function (data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');

			// Add replaced image's ID to the new SVG
			if (typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if (typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass + ' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
			if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
				$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
			}

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');
	});
	//document.getElementById('myvideo').play();
	/*var playPromise = document.getElementById('myvideo').play();
	if (playPromise !== undefined) {
		playPromise.then(_ => {
			console.log('play');
		})
			.catch(error => {
				console.log('error', error);
				document.getElementById('myvideo').play();
			});
	}*/

	//$('.navbarlink').click(function () {
		//console.log('navbartoggle commented');
		//navbartoggle();
	//});
	
});
function navbartoggle() {
	$('#navbar').toggleClass('nav-open');
	$('.navbar-toggle').toggleClass('collapsed');
	console.log('.nav-open');
}