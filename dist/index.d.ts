/**
 * Registers the resolver with the Type using symbol.
 *
 * @private
 * @param  {T} Type - the Type to attach resolver to.
 * @return {Function} the resolver invocation function.
 */
export declare function register<T>(Type: T): Function;
/**
 * Decorates class as singleton.
 *
 * @example
 * @singleton(Type)
 *
 * @param  {Function} Type - the Type to be defined as singleton.
 */
export declare function singleton<T>(Type: {
    new (): T;
}): void;
/**
 * Injects dependency in class or function.
 *
 * @example
 * @inject(Type)
 *
 * @param  {*} ...types - array of Types as rest param.
 * @return {Function}
 */
export declare function inject(...types: any[]): Function;
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
export declare function invoke<T>(Type: T, ...types: any[]): any;
