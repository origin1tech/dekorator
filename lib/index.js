/**
 * Dependency Injection
 *
 * This module is an ultra light weight
 * dependency injection module. It is
 * NOT intended to be a complete solution.
 * It merely serves the purpose of
 * supporting this library so as to not
 * need an additional dependency.
 */

let _register, _dependencies;

// Define symbols for dependencies
// and registering Type resolvers.
_register = Symbol('register');
_dependencies = Symbol('types');

/**
 * Resolves dependencies for the given Type.
 *
 * @private
 * @param  {Function} Type - class object.
 * @return {Function} the resolver function.
 */
function resolver(Type) {

  if (Type[_dependencies]) {

    return function() {

      let args = Type[_dependencies].map(function(T) {

        return invoke(T);

      });

      return new(Function.prototype.bind.apply(Type, [null].concat(args)));

    };

  }
  return function() {

    return new Type();

  };

}

/**
 * Registers the resolver with the Type using symbol.
 *
 * @private
 * @param  {Function} Type - the Type to attach resolver to.
 * @return {Function} the resolver invocation function.
 */
export function register(Type) {

  if (!Type[_register])
    Type[_register] = resolver(Type);

  return Type[_register];

}

/**
 * Decorates class as singleton.
 *
 * @example
 * @singleton(Type)
 *
 * @param  {Function} Type - the Type to be defined as singleton.
 * @return {Object}
 */
export function singleton(Type) {

  Type[_register] = function() {

    let instance = resolver(Type)();

    Type[_register] = function() {

      return instance;

    };

    return instance;

  };

}

/**
 * Injects dependency in class or function.
 *
 * @example
 * @inject(Type)
 *
 * @param  {*} ...types - array of Types as rest param.
 * @return {Function}
 */
export function inject(...types) {

  return function(target, key, descriptor) {

    // If descriptor is function
    // and not a class.
    if (descriptor) {

        const fn = descriptor.value;
        fn[_dependencies] = types;

    }

    else {

      // Using symbol assign the Array
      // of types to the target.
      target[_dependencies] = types;

    }

  };

}

/**
 * Invokes the class or function
 * calling the attached resolver
 * resolving dependencies.
 *
 * @example
 * invoke(Type);
 *
 * @param {Function} Type - the type to be instantiated.
 * @param {Array} types - array of dependencies to be injected on the fly.
 * @return {Object}
 */
export function invoke(Type, ...types) {

  // If types manually inject
  // the supplied dependencies.
  if (types.length)
    inject.apply(undefined, types)(Type);

  return register(Type)();

}

export { inject, singleton, invoke };
