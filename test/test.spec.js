import { inject, singleton, invoke } from '../lib/index';

const chai = require('chai');
const expect = chai.expect;
//const should = chai.should;
//const assert = chai.assert;

// Class as singleton.
@singleton
class One {
	constructor() {
		// As classess are invoked
		// we add its name to this
		// property. If all class
		// names present after last
		// is loaded. Then this class
		// is a singleton.
		this.loaded = ['One'];
	}
}

// Class with dependency injected.
@inject(One)
class Two {
	constructor(one) {
		this.one = one;
		this.one.loaded.push('Two');
	}
}

@inject(One)
class Three {
	constructor(one) {
		this.one = one;
		this.one.loaded.push('Three');
	}
}

// Invoke the classes injecting
// dependencies.
let two = invoke(Two);
let three = invoke(Three);

describe('Dekorator', () => {

	it('expect property "one" in class "Two" to be instance of "One"', () => {
		expect(two.one).to.be.instanceof(One);
	});

	it('expect "loaded" from "One" to equal all three loaded class names', () => {
		expect(three.one.loaded).to.deep.equal([ 'One', 'Two', 'Three' ]);
	});

});
