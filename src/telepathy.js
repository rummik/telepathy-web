(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto,
	    _ = require('underscore')._,
	    Telepathy = require('telepathy'),
	    telepathy = new Telepathy();

	// todo: show dialog prompt for default username and master password

	$('#domain').on('keydown', function() {
		_.defer(function(that) {
			$('#password').text(telepathy.password(that.value));
		}, this);
	});

	$('.modal-close').on('click', function() {
		$(this).parents('.modal').removeClass('open');
	});

	$('#open-settings').on('click', function(event) {
		if (!$('.modal.open').length) {
			event.preventDefault();
			event.stopPropagation();
			$('#settings').addClass('open');
		}
	});

	$(window).on('click', function(event) {
		if ($('.modal.open').length && !$(event.target).parents('.modal').length) {
			event.preventDefault();
			event.stopPropagation();
			$('.modal.open').removeClass('open');
		}
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
