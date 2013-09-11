var $ = require('zepto-browserify').Zepto,
    _ = require('underscore')._,
    should = require('should');

describe('index.html', function() {
	before(function(done) {
		document.body.innerHTML = (__html__['www/index.html'] || __html__['tmp/index.html']).replace(/(v\d+\.\d+\.\d+-\d+\.\d+\.\d+\/)/g, 'http://localhost:8000/$1');

		var script = document.createElement('script');
		script.src = 'http://localhost:8000/build/js/telepathy.js';
		script.onload = function() {
			$('#default-username').val('test').trigger('change');
			$('#shared-secret').val('test').trigger('change');
			$('.save-settings').click();
			done();
		};
		document.body.appendChild(script);
	});

	describe('#domain.keydown', function() {
		it('should create a password', function(done) {
			$('#domain').val('example.com').trigger('keydown');

			_.defer(function() {
				$('#password').text().should.equal('z<u9N_[c"R');
				done();
			});
		});
	});
});
