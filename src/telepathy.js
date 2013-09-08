(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto,
	    _ = require('underscore')._,
	    Telepathy = require('telepathy'),
	    telepathy = new Telepathy();

	// todo: show dialog prompt for default username and master password

	// google.com: u25YhZz44m
	$('#domain').on('keydown', _.debounce(function() {
		$('#password').text(telepathy.password({
			alphabet: $('#lax').attr('checked') ?
			            Telepathy.alphabet.base62 :
			            Telepathy.alphabet.base94,
			domain: this.value
		}));
	}));

	$('.modal-close').on('click', function() {
		$(this).parents('.modal').removeClass('open');
	});

	$('.modal-bg').on('click', function(event) {
		if ($('.modal.open').length && !$(event.target).parents('.modal').length) {
			event.preventDefault();
			event.stopPropagation();
			$('.modal.open').removeClass('open');
		}
	});

	$('#open-settings').on('click', function(event) {
		if (!$('.modal.open').length) {
			event.preventDefault();
			event.stopPropagation();
			$('#settings').addClass('open');
		}
	});

	// Disable scroll if iOS standalone is happening
	$(document).bind('touchmove', function(event) {
		if (!window.navigator.standalone)
			return;

		event.preventDefault();
		return false;
	});

	var UI = {
		settings: {
		},

		save: function() {
			localStorage.telepathyWeb = JSON.stringify({
				settings: this.settings
			});
		},

		load: function() {
			var data = JSON.parse(localStorage.telepathyWeb),
			    that = this;

			if (!data) return;

			if (typeof data.settings != 'object') {
				Object.keys(data.settings).forEach(function(key) {
					that.settings[key] = data.settings[key];
				});
			}
		}
	};

	UI.load();
})();
