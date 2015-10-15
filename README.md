# Dekorator

[![wercker status](https://app.wercker.com/status/5aa3d785a8e99ed8322da7e7df56fad5/m "wercker status")](https://app.wercker.com/project/bykey/5aa3d785a8e99ed8322da7e7df56fad5)

Simple dependency injection lib exposing inject and singleton decorators. Dekorator can be used with Node or in browser with an ES6 transpiler such as (Babel)[https://babeljs.io/].

Dekorator is an extremely stripped down dependency injection library. It is meant to provide a lightweight solution for embedding into other libraries. If you are looking for a robust solution with lots of features this isn't it. It has a very specific use case. This doesn't mean it won't work exactly as indicated but rather you may need additional features it does not provide.

## Install

**For use with Node**

```sh
$ npm install dekorator
```
**For use in browser & JSPM**

NOTE: jspm is a package manager which sets up your project for use with System.js, the ES6 module loader system. You can read more on (jspm here)[http://jspm.io].

```sh
jspm install npm:dekorator
```
or

```sh
jspm install github:origin1tech/dekorator
```

## Getting Started

Using **dekorator** is very simple. You need merely decorate an ES6 class to have it's dependency(s) injected into the constructor or specify the class as a singleton.

#### Injecting

```js
import {inject, invoke} from 'origin1tech/dekorator'; // shown using System.js

class Vehicle {
	constructor() {
	}
}

@inject(Vehicle)
class Car {
	constructor(vehicle) {
		this.vehicle = vehicle;
	}
	getVehicle() {
		return this.vehicle;
	}
}

// Invoke the class.
let car = invoke(Car);

// do something with car and
// injected vehicle.
let vehicle = car.getVehicle();
```

#### singleton

Nothing special here simply decorate your class with "@singleton" and it just works. Decorating with this decorator will ensure the class is a singleton in turn it will return the same instance when injected in other classes.

```js
@singleton
class MyClass {
	constructor() {}
}
```

## Additional Notes

One thing that trips up devs when first using decorators, well at least for those that actually use semi colons is that when using an ES7/ES2016 decorator you DO NOT use a semi colon after the decoration. Think of it in terms of a fluent api where you wouldn't terminate as you're using dot notation to further define some class/function etc.

**What NOT to do**

The below example with fail and not work

```js
@inject(OtherClass);
class MyClass {
	constructor() {}
}
```

## Testing

You will notice a few specs in the **test** folder which can be run using **Mocha**. Simply type mocha in your terminal from the root of the project or run:

```sh
npm test
```

## License

Basically you can do just about anything you like. Enjoy!

See (LICENSE.md)[license.md]
