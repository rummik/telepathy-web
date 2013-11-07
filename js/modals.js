(function() {
	'use strict';

	var $ = require('zepto-browserify').Zepto;

	$('.modal-close').on('click', function() {
		$(this).parents('.modal').removeClass('open');
	});
})();
