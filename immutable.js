const debug = require('debug')('immutable-base~immutable')

'use strict'

function create(defaults = {}, props = []) {

	for (key of Object.getOwnPropertyNames(defaults)) {
		debug("key:", key)
		debug(props)
		debug(props.indexOf(key))
		if (props.indexOf(key) < 0) props.push(key);
	}

	debug("merged props", props);
	
	let immutableClass = class {

		constructor() {
			debug("constructor", props, defaults, arguments);
			let args = arguments;

			// Handle case where we have one argument that's an object: assume it's properties to pass in
			if (args.length === 1 && typeof args[0] === 'object') {
				defaults = Object.assign({}, defaults, args[0]);
				debug("merged", defaults);
				args=[];
			} 

			// Otherwise assign arguments to propertis in order
			for (let i = 0; i < props.length; i++) {
				let value = i < args.length ? args[i] : defaults[props[i]];
				debug("value", value);
				Object.defineProperty(this, props[i], { value, enumerable: true, writable: false });
			}			
		}

		merge(props) {
			return new this.constructor(Object.assign({}, this, props));
		}

	}

	for (let prop of props) {
		let setterName = "set" + prop.slice(0,1).toUpperCase() + prop.slice(1);
		immutableClass.prototype[setterName] = function(val) {
			debug(setterName, prop, val);
			return this.merge({ [prop] : val });
		}
	}

	return immutableClass;

}

module.exports = { create };
