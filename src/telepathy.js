(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto,
	    _ = require('underscore')._,
	    pack      = require('../package.json'),
	    Telepathy = require('telepathy'),
	    telepathy = new Telepathy();

	$('.version').text('v' + pack.version);

	$('#domain').on('keydown', _.debounce(function() {
		var domain = this.value.replace(/^\s+|\s+$/g, '');

		if (!domain.length) {
			$('#password').html('&nbsp;');
			return;
		}

		$('#password').text(telepathy.password({
			domain: domain,
			algorithm: UI.settings['algorithm'],
			user: UI.settings['default-username'],
			secret: UI.settings['shared-secret'],

			alphabet: $('input[name=lax]:checked').val() == 'yes' ?
			            Telepathy.alphabet.base62 :
			            Telepathy.alphabet.base94
		}));
	}));

	$('.modal-close').on('click', function() {
		$(this).parents('.modal').removeClass('open');
	});

	$('.modal-close, input[name=lax]').on('click change', function() {
		$('#domain').trigger('keydown');
	});

	$('#open-settings').on('click', function(event) {
		event.preventDefault();
		$('#settings').addClass('open');
	});

	// Disable scroll if iOS standalone is happening
	if (window.navigator.standalone) {
		$(document).on('touchmove', function(event) {
			event.preventDefault();
			return false;
		});
	}

	$('#settings input, #settings option').each(function() {
		var $this = $(this);

		$this.on('change', function() {
			if (!$this.prop('name'))
				return;

			UI.settings[$this.prop('name')] = $(this).val();
		});
	});

	$('.save-settings').on('click', function() {
		UI.save();
	});

	$('.reset-settings').on('click', function() {
		UI.load();
	});

	var UI = {
		settings: {
		},

		_settings: {
			'default-username': '',
			'shared-secret': '',
			'save-secret': 'no',
			'algorithm': 'SHA256'
		},

		save: function() {
			var omit = this.settings['save-secret'] == 'no' ? 'shared-secret' : '',
			    settings = _.omit(this.settings, omit);

			localStorage.telepathyWeb = JSON.stringify({
				settings: settings
			});

			this._settings = this.settings;
		},

		load: function() {
			var data = JSON.parse(localStorage.telepathyWeb || '{}'),
			    that = this;

			if (!data) return;

			_.each(_.keys(that._settings), function(key) {
				if (data.settings && _.has(data.settings, key))
					that._settings[key] = data.settings[key];

				that.settings[key] = that._settings[key];

				var $option = $('#settings [name=' + key + ']');

				switch ($option.prop('type')) {
					case 'radio':
						$option.each(function() {
							var $this = $(this);
							$this.prop('checked', $this.val() == that.settings[key]);
						});
						break;

					default:
						$option.val(that.settings[key]);
						break;
				}
			});
		}
	};

	UI.load();

	if (!UI.settings['shared-secret'].length)
		$('#settings').addClass('open');
})();
