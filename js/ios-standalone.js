(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto;

	// Disable scroll if iOS standalone is happening
	if (window.navigator.standalone) {
		$(document).on('touchmove', function(event) {
			if ($('.modal').hasClass('open'))
				return;

			event.preventDefault();
			return false;
		});
	}
})();
