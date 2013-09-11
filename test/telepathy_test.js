var Telepathy = require('telepathy');

describe('Telepathy', function() {
	describe('#password', function() {
		it('should work with no args', function() {
			expect(new Telepathy().password()).toBe('jWEepHLxI5');
		});

		it('accepts an alphabet option', function() {
			expect(new Telepathy().password({ alphabet: Telepathy.alphabet.base16 })).toBe('1b7852b855');
		});

		it('accepts a length option', function() {
			expect(new Telepathy().password({ length: 5 })).toBe('HLxI5');
		});
	});
});
