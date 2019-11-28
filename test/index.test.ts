import CleanReact from '../src/index';

describe('main test', () => {
	it('should not brake', () => {
		expect(typeof CleanReact).toBe('function');
	});
});
