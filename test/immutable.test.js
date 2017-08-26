'use strict'

const Immutable = require('../immutable');
const chai = require('chai');

const expect = chai.expect;

describe('Immutable', () => {

	it('Can create a new class', () => {

		const TestClass = Immutable({ attr1: 1, attr2: undefined, attr3: undefined });

		let instance = new TestClass({attr2: 2});

		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);
	});

	it('Constructor assigns values in declared order', () => {
		const TestClass = Immutable({attr1: 1, attr2: 2});
		let instance = new TestClass(3,4);
		expect(instance.attr1).to.equal(3);
		expect(instance.attr2).to.equal(4);		
	});

	it('No-arg constructor maintains defaults', () => {
		const TestClass = Immutable({attr1: 1, attr2: 2});
		let instance = new TestClass();
		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);		
	});

	it('Instance has a merge method', () => {
		const TestClass = Immutable({attr1: 1, attr2: 2});
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
		const TestClass = Immutable({attr1: 1, attr2: 2});
		let instance = new TestClass();
		let instance2 = instance.setAttr2(3);
		expect(instance.attr1).to.equal(1);
		expect(instance.attr2).to.equal(2);		
		expect(instance2.attr1).to.equal(1);
		expect(instance2.attr2).to.equal(3);	
		let instance3 = instance.setAttr1(3);
		expect(instance3.attr1).to.equal(3);
		expect(instance3.attr2).to.equal(2);	
	});

	it('Won\'t let you set instance proprties directly', () => {
		const TestClass = Immutable({attr1: 1, attr2: 2});
		let instance = new TestClass();
		try {
			instance.attr1 = 33;
			expect(instance.attr1).to.equal(1); // in non-strict mode an exception will not be thrown.
		} catch (err) {
			if (!err instanceof TypeError) throw err; // assigning to readonly should throw a TypeError in strict mode
		}
	});

	it('allows inheritance of generated class', () => {
		class newclass extends Immutable( {attr1: 1, attr2: 3} ) {
			constructor() { super(...arguments); this.transient = 77; }

		};

		let i = new newclass(2);

		expect(i.attr1).to.equal(2);
		expect(i.attr2).to.equal(3);
		expect(i.transient).to.equal(77);

		let j = i.setAttr1(4);

		expect(j).to.be.an.instanceof(newclass);
		expect(j.attr1).to.equal(4);
		expect(j.attr2).to.equal(3);
		expect(j.transient).to.equal(77);
	});


	it('has a getImmutablePropertyNames method', () => {
		class newclass extends Immutable( {attr1: 1, attr2: 3} ) {
			constructor() { super(...arguments); this.transient = 77; }
		};

		expect(newclass.getImmutablePropertyNames()).to.have.length(2);
	});

	it('can exend another immutable class', () => {
		const class1 = Immutable( { attr1: 1, attr2: 2});
		const class2 = class1.extend({ attr3: 3 });

		expect(class2.getImmutablePropertyNames()).to.have.length(3);

		let i = new class2(4,5,6);

		expect(i.attr1).to.equal(4);
		expect(i.attr2).to.equal(5);
		expect(i.attr3).to.equal(6);
	});

	it('can use functions to create defaults', () => {
		const class1 = Immutable( { attr1: () => new Date() } );

		let i1 = new class1();

		expect(i1.attr1).to.be.an.instanceof(Date);
	});
});