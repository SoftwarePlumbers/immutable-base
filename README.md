# immutable-base

A simple utility for creating immutable classes in javascript.

Immutable objects are in vogue because of frameworks like flux. There are some fairly heavyweight libraries out there that do all kinds of cool stuff with collections, such as Immutable.js.

This is really nothing but a handy utility for creating immutable object classes. For example:

```javascript

const { Immutable } = require(immutable-base);

class MyClass extends Immutable({ name: "", address, "", tel: ""}) {};

```

Creates a class MyClass which has immutable properties name, address, and tel all of which default to the empty string. Attempting to change these properties results in an error, but the class has setter methods which create a new instance of the class with the change applied.

The created class also has a constructor which will take arguments to set name, address, and tel _in that order_ OR take an object with optional name, address, and tel properties and assign the values appropriately. Thus:

```javascript

let person = new MyClass("jonathan", "1 road lane", "0800-999-888-777");
let person2 = new MyClass({name: "robert"});
let person3 = person2.setAddress(person1.address);

```

Would be perfectly valid code given only the class definition above. Equally:

```javascript

person3.address = "22 field park";

```
Would throw an exception.