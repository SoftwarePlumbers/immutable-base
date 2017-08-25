const Immutable = require('../immutable');
const chai = require('chai');

const expect = chai.expect;

describe('Immutable', () => {

	it('Can create a new class', () => {

		const TestClass = Immutable.create({ attr1: 1, attr3: undefined }, [ "attr2"]);

		let instance = new TestClass({attr2: 2});

		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);
	});

	it('Constructor assigns values in declared order', () => {
		const TestClass = Immutable.create({attr1: 1, attr2: 2});
		let instance = new TestClass(3,4);
		expect(instance.attr1).to.equal(3);
		expect(instance.attr2).to.equal(4);		
	});

	it('No-arg constructor maintains defaults', () => {
		const TestClass = Immutable.create({attr1: 1, attr2: 2});
		let instance = new TestClass();
		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);		
	});

	it('Instance has a merge method', () => {
		const TestClass = Immutable.create({attr1: 1, attr2: 2});
		let instance = new TestClass();
		let instance2 = instance.merge({attr2: 3});
		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);		
		expect(instance2.attr1).to.equal(1);
		expect(instance2.attr2).to.equal(3);
		expect(instance).to.be.an.instanceof(TestClass);
		expect(instance2).to.be.an.instanceof(TestClass);		
	});

	it('Instance has setter methods', () => {
		const TestClass = Immutable.create({attr1: 1, attr2: 2});
		let instance = new TestClass();
		let instance2 = instance.setAttr2(3);
		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);		
		expect(instance2.attr1).to.equal(1);
		expect(instance2.attr2).to.equal(3);	
		instance3 = instance.setAttr1(3);
		expect(instance3.attr1).to.equal(3);
		expect(instance3.attr2).to.equal(2);	
	});
});