(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto;
	var _ = require('underscore')._;
	var Telepathy = require('telepathy');
	var telepathy = new Telepathy();
	var UI = require('./ui.js');

	require('./modals');
	require('./settings');
	require('./ios-standalone');

	$('#domain').on('keydown', _.debounce(function() {
		var domain = this.value.replace(/^\s+|\s+$/g, '');

		if (!domain.length) {
			$('#password').val('');
			return;
		}

		$('#password').val(telepathy.password({
			domain: domain,
			algorithm: UI.settings['algorithm'],
			user: UI.settings['default-username'],
			secret: UI.settings['shared-secret'],
			length: (+$('#length').val()) || UI.settings['default-length'],
			index: (+$('#index').val()) || UI.settings['default-index'],

			alphabet: $('input[name=lax]:checked').val() == 'yes' ?
			            Telepathy.alphabet.base62 :
			            Telepathy.alphabet.base94,
		}));
	}));

	$('#password').on('focus click', _.debounce(function() {
		this.select();
	}));

	$('.modal-close, input[name=lax], #index, #length').on('click change keydown', function() {
		$('#domain').trigger('keydown');
	});

	$(window).on('keydown', function(event) {
		if (event.keyCode != 27) // escape key
			return;

		$('#domain, #password').val('');
		$('#domain').focus();
	});

	$(window).on('blur', function() {
		$('#domain, #password').val('');
	});
})();
