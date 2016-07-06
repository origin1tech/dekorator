/**
 * Dependency Injection
 *
 * This module is an ultra light weight
 * dependency injection module. It is
 * NOT intended to be a complete solution.
 */
"use strict";
var _register, _dependencies;
// Define symbols for dependencies
// and registering Type resolvers.
_register = Symbol('register');
_dependencies = Symbol('types');
/**
 * Resolves dependencies for the given Type.
 *
 * @private
 * @param  {T} Type - class object.
 * @return {Function} the resolver function.
 */
function resolver(Type) {
    if (Type[_dependencies]) {
        return function () {
            var args = Type[_dependencies].map(function (t) {
                return invoke(t);
            });
            return new (Function.prototype.bind.apply(Type, [null].concat(args)));
        };
    }
    return function () {
        // return new Type();
        return new (Function.prototype.bind.apply(Type, []));
    };
}
/**
 * Registers the resolver with the Type using symbol.
 *
 * @private
 * @param  {T} Type - the Type to attach resolver to.
 * @return {Function} the resolver invocation function.
 */
function register(Type) {
    if (!Type[_register])
        Type[_register] = resolver(Type);
    return Type[_register];
}
exports.register = register;
/**
 * Decorates class as singleton.
 *
 * @example
 * @singleton(Type)
 *
 * @param  {Function} Type - the Type to be defined as singleton.
 */
function singleton(Type) {
    Type[_register] = function () {
        var instance = resolver(Type)();
        Type[_register] = function () {
            return instance;
        };
        return instance;
    };
}
exports.singleton = singleton;
/**
 * Injects dependency in class or function.
 *
 * @example
 * @inject(Type)
 *
 * @param  {*} ...types - array of Types as rest param.
 * @return {Function}
 */
function inject() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i - 0] = arguments[_i];
    }
    return function (target, key, descriptor) {
        // If descriptor is function
        // and not a class.
        if (descriptor) {
            var fn = descriptor.value;
            fn[_dependencies] = types;
        }
        else {
            // Using symbol assign the Array
            // of types to the target.
            target[_dependencies] = types;
        }
    };
}
exports.inject = inject;
/**
 * Invokes the class or function
 * calling the attached resolver
 * resolving dependencies.
 *
 * @example
 * invoke(Type);
 *
 * @param {T} Type - the type to be instantiated.
 * @param {Array} types - array of dependencies to be injected on the fly.
 * @return {Object}
 */
function invoke(Type) {
    var types = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
    }
    // If types manually inject
    // the supplied dependencies.
    if (types.length)
        inject.apply(undefined, types)(Type);
    return register(Type)();
}
exports.invoke = invoke;
//# sourceMappingURL=index.js.map