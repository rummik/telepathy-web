(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto;
	var UI = require('./ui.js');

	$('#open-settings').on('click', function(event) {
		event.preventDefault();
		$('#settings').addClass('open');
	});

	$('#settings input, #settings select').each(function() {
		var $this = $(this);

		$this.on('change', function() {
			if (!$this.prop('name'))
				return;

			UI.settings[$this.prop('name')] = $this.val();
		});
	});

	$('.save-settings').on('click', function() {
		UI.save();
		UI.load();
	});

	$('.reset-settings').on('click', function() {
		UI.load();
	});

	if (!UI.settings['shared-secret'].length)
		$('#settings').addClass('open');
})();
