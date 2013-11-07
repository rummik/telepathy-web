(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto;
	var _ = require('underscore')._;

	// Populate values for index/length select boxes
	var i;
	for (i=4; i<=100; i+=(i<30?1:(i<50?5:10)))
		$('#length,#default-length').append('<option value="' + i +'">' + i + '</option>');

	for (i=0; i<=50; i++)
		$('#index,#default-index').append('<option value="' + i + '">' + i + '</option>');

	var UI = {
		settings: {},

		_settings: {
			'default-username': '',
			'shared-secret': '',
			'save-secret': 'no',
			'algorithm': 'SHA256',
			'default-length': 10,
			'default-index': 0
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

			$('#index').val(this.settings['default-index']);
			$('#length').val(this.settings['default-length']);
		}
	};

	UI.load();

	module.exports = UI;
})();
