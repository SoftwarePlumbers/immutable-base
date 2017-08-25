const debug = require('debug')('immutable-base~immutable');

'use strict';

/** Handle case where we have a single argument containing an object.
 *
 * Basically, merge properties in args[0] into defaults, iff we have a single argument and it is an object.
 *
 */
function _processPropertiesArgument(args, defaults) {
    if (args.length === 1 && typeof args[0] === 'object') {
        Object.assign(defaults, args[0]);
        args.length = 0;
    }
}

/** Create an immutable class
 *
 * The resulting class will have the supplied properties and defaults, a constructor, and setters
 * which return a copy of the instance they are applied to with the implied update in place.
 *
 * Passing in { property: undefined } will ensure a setter is created for 'property' without creating a default.
 *
 * @param defaults {Object} A set of key/value pairs used to create default properties for class instances.
 * @returns A class object with appropriate properties and setter methods.
 */
function create(defaults) {

    let props = Object.getOwnPropertyNames(defaults);

    /** Immutable class created from defaults.
     *
     */
    const immutableClass = class {

        /** Constructor.
         *
         * Can take a single object argument, in which case the properties of the object are copied over into
         * any matching default propertis that were defined in 'create'. Can also take normal arguments, in which
         * case the arguments are matched to the default properties in the order in which they were originally 
         * defined in the defaults object.
         */
        constructor() {
            debug('constructor', props, defaults, arguments);
            let args = arguments;
            defaults = Object.assign({}, defaults);

            // Handle case where we have one argument that's an object: assume it's properties to pass in
            _processPropertiesArgument(args,defaults);

            // Otherwise assign arguments to properties in order
            for (let i = 0; i < props.length; i++) {
                let value = i < args.length ? args[i] : defaults[props[i]];
                Object.defineProperty(this, props[i], { value, enumerable: true, writable: false });
            }           
        }

        /** Merge a set of properties with the immutable object, returning a new immutable object
        *
        * @param props Properties to merge.
        * @returns a new immutable object of the same type as 'this'.
        */
        merge(props) {
            return new this.constructor(Object.assign({}, this, props));
        }

        /** Get the immutable property names
         *
         * An immutable object may legitimately have transient proprerties that are not part of the public
         * interface of the object. We therefore create a getImmutablePropertyNames static method that gets
         * the list of immutable properties names that is defined for this class.
         */
        static getImmutablePropertyNames() { return props; }

        /** Extends an immutable object, making a new immutable object.
         *
         * @param new_defaults additional properties for the extended object, plus default values for them.
         */
        static extend(new_defaults) { return extend(immutableClass, new_defaults)}
    };

    for (let prop of props) {
        let setterName = 'set' + prop.slice(0,1).toUpperCase() + prop.slice(1);
        immutableClass.prototype[setterName] = function(val) {
            debug(setterName, prop, val);
            return this.merge({ [prop] : val });
        };
    }

    return immutableClass;

}

/** Extend an immutable class
 *
 * The resulting class will have the supplied properties and defaults, a constructor, an additional setters
 * which return a copy of the instance they are applied to with the implied update in place.
 *
 * Passing in { property: undefined } will ensure a setter is created for 'property' without creating a default.
 *
 * @param to_extend a class object (which must inherit from an immutable object as created above)
 * @param defaults {Object} A set of key/value pairs used to create additional default properties for class instances.
 * @returns A class object with appropriate properties and setter methods.
 */
function extend(to_extend, new_defaults = {}) {

    let new_props = Object.getOwnPropertyNames(new_defaults);
    let props = to_extend.getImmutablePropertyNames().concat(new_props);

    debug('merged props', props);
    
    /** Immutable class created from new_defaults and the extended class
     *
     */
    let immutableClass = class extends to_extend {

        /** Constructor.
         *
         * Can take a single object argument, in which case the properties of the object are copied over into
         * any matching default propertis that were defined in 'create'. Can also take normal arguments, in which
         * case the arguments are matched to the default properties in the base class, and then to additional 
         * properties defined in the new_defaults object .
         */
        constructor() {
            // take care of elements in superclass
            super(...arguments);

            let args = arguments;
            new_defaults = Object.assign({}, new_defaults);

            // Handle case where we have one argument that's an object: assume it's properties to pass in
            _processPropertiesArgument(args,new_defaults);

            // Otherwise assign arguments to properties in order
            for (let i = to_extend.getImmutablePropertyNames().length; i < props.length; i++) {
                let value = i < args.length ? args[i] : new_defaults[props[i]];
                debug('value', value);
                Object.defineProperty(this, props[i], { value, enumerable: true, writable: false });
            }           
        }

        /** Get the immutable property names
         *
         * An immutable object may legitimately have transient proprerties that are not part of the public
         * interface of the object. We therefore create a getImmutablePropertyNames static method that gets
         * the list of immutable properties names that is defined for this class.
         */
        static getImmutablePropertyNames() { return props; }


        /** Extends an immutable object, making a new immutable object.
         *
         * @param new_defaults additional properties for the extended object, plus default values for them.
         */
        static extend(new_defaults) { return extend(immutableClass, new_defaults)}
    };

    for (let prop of new_props) {
        let setterName = 'set' + prop.slice(0,1).toUpperCase() + prop.slice(1);
        immutableClass.prototype[setterName] = function(val) {
            debug(setterName, prop, val);
            return this.merge({ [prop] : val });
        };
    }

    return immutableClass;  
}

module.exports = create;
