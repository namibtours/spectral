/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	function handleLangSwitch(lang) {
		localStorage.setItem('lang', lang);

		var routes = {
			home: {
				en: '',
				de: ''
			},
			tours: {
				en: 'guided-tours/',
				de: 'geführte-rundreisen/'
			},
			about: {
				en: 'about-me/',
				de: 'über-mich/'
			},
			namibia: {
				en: 'namibia/',
				de: 'namibia/'
			},
			contact: {
				en: 'contact/',
				de: 'kontakt/'
			}
		}
		var page = $metaPage[0].getAttribute('content');
		var host = window.location.hostname;

		if (page) {
			// HOME
			if (['home-EN', 'home-DE'].includes(page)) {
				window.location = `https://${host}/${lang === 'en' ? 'en/' : ''}${routes.home[lang]}`;
				return;
			}
			// GUIDED TOURS
			if (['tours-EN', 'tours-DE'].includes(page)) {
				window.location = `https://${host}/${lang === 'en' ? 'en/' : ''}${routes.tours[lang]}`;
				return;
			}
			// ABOUT ME
			if (['about-EN', 'about-DE'].includes(page)) {
				window.location = `https://${host}/${lang === 'en' ? 'en/' : ''}${routes.about[lang]}`;
				return;
			}
			// NAMIBIA
			if (['namibia-EN', 'namibia-DE'].includes(page)) {
				window.location = `https://${host}/${lang === 'en' ? 'en/' : ''}${routes.namibia[lang]}`;
				return;
			}
			// CONTACT
			if (['contact-EN', 'contact-DE'].includes(page)) {
				window.location = `https://${host}/${lang === 'en' ? 'en/' : ''}${routes.contact[lang]}`;
				return;
			}
		}
	}

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header'),
		$langSwitches = $('#langSwitch > button'),
		$metaPage = $('meta[name="page"]');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);

		// Handle browser detected language
		var lang = navigator.language || navigator.userLanguage;
		var activeLang = $('#langSwitch > button.active').data('lang');
		var storageLang = localStorage.getItem('lang');
		if (storageLang && ['en', 'de'].includes(storageLang) && (storageLang !== activeLang)) {
			handleLangSwitch(storageLang);
		} else if (!storageLang) {
			if (lang.split('-')[0] != activeLang) {
				handleLangSwitch(lang.split('-')[0])
			}
		}

	});

	// Mobile?
	if (browser.mobile)
		$body.addClass('is-mobile');
	else {

		breakpoints.on('>medium', function () {
			$body.removeClass('is-mobile');
		});

		breakpoints.on('<=medium', function () {
			$body.addClass('is-mobile');
		});

	}

	// Scrolly.
	$('.scrolly')
		.scrolly({
			speed: 1500,
			offset: $header.outerHeight()
		});

	// Menu.
	$('#menu')
		.append('<a href="#menu" class="close"></a>')
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-menu-visible'
		});

	// Header.
	if ($banner.length > 0
		&& $header.hasClass('alt')) {

		$window.on('resize', function () { $window.trigger('scroll'); });

		$banner.scrollex({
			bottom: $header.outerHeight() + 1,
			terminate: function () { $header.removeClass('alt'); },
			enter: function () { $header.addClass('alt'); },
			leave: function () { $header.removeClass('alt'); }
		});

	}

	// Lang switch.
	if ($langSwitches && $langSwitches.length > 0) {
		$langSwitches.on('click', function () {
			var lang = $(this).data('lang');
			var activeLang = $('#langSwitch > button.active').data('lang');
			if (lang !== activeLang) {
				handleLangSwitch(lang);
			}
		});
	}

})(jQuery);