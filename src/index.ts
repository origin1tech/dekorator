
/**
 * Dependency Injection
 *
 * This module is an ultra light weight
 * dependency injection module. It is
 * NOT intended to be a complete solution.
 */

let _register: symbol;
let _dependencies: symbol;

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
function resolver<T>(Type: T): Function {

  if (Type[_dependencies]) {

    return (): T => {

      let args: any = Type[_dependencies].map((t: any) => {

        return invoke(t);

      });

      return new (Function.prototype.bind.apply(Type, [null].concat(args)));

    };

  }
  return () => {

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
export function register<T>(Type: T): Function {

  if (!Type[_register])
    Type[_register] = resolver(Type);

  return Type[_register];

}

/**
 * Decorates class as singleton.
 *
 * @example @singleton(Type)
 *
 * @param  {Function} Type - the Type to be defined as singleton.
 */
export function singleton<T>(Type: { new (): T }): void {

  Type[_register] = () => {

    let instance = resolver(Type)();

    Type[_register] = () => {

      return instance;

    };

    return instance;

  };

}

/**
 * Injects dependency in class or function.
 *
 * @example @inject(Type)
 *
 * @param  {*} ...types - array of Types as rest param.
 * @return {Function}
 */
export function inject(...types: any[]): Function {

  return (target: any, key: string, descriptor: PropertyDescriptor): void => {

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
 * @example invoke(Type);
 *
 * @param {T} Type - the type to be instantiated.
 * @param {Array} types - array of dependencies to be injected on the fly.
 * @return {Object}
 */
export function invoke<T>(Type: T, ...types: any[]): any {

  // If types manually inject
  // the supplied dependencies.
  if (types.length)
    inject.apply(undefined, types)(Type);

  return register(Type)();

}
