"use strict";
/**
 * Fake implementation of @forge/resolver.
 *
 * Provides a Resolver class with define() and getDefinitions() methods
 * matching the real @forge/resolver API surface.
 *
 * Usage in app code (works unchanged with this shim):
 *   import Resolver from '@forge/resolver';
 *   const resolver = new Resolver();
 *   resolver.define('getText', (req) => 'Hello');
 *   export const handler = resolver.getDefinitions();
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
exports.makeResolver = makeResolver;
class Resolver {
    handlers = new Map();
    /**
     * Register a handler for a define key.
     */
    define(name, handler) {
        this.handlers.set(name, handler);
    }
    /**
     * Returns the function that Forge invokes at runtime.
     * The returned function accepts `{ call: { functionKey, payload }, context }`.
     */
    getDefinitions() {
        return async (invocation) => {
            const { call, context } = invocation;
            const handler = this.handlers.get(call.functionKey);
            if (!handler) {
                throw new Error(`Resolver has no definition for '${call.functionKey}'. ` +
                    `Registered keys: [${[...this.handlers.keys()].join(', ')}]`);
            }
            return handler({ payload: call.payload ?? {}, context });
        };
    }
    /**
     * Get all registered define keys (useful for test assertions).
     */
    getRegisteredKeys() {
        return [...this.handlers.keys()];
    }
}
exports.Resolver = Resolver;
/**
 * Creates a resolver in one step using type-safe definitions.
 * Matches `import { makeResolver } from '@forge/resolver'`.
 */
function makeResolver(handlers) {
    const resolver = new Resolver();
    for (const [key, handler] of Object.entries(handlers)) {
        resolver.define(key, handler);
    }
    return resolver.getDefinitions();
}
// Default export matching `import Resolver from '@forge/resolver'`
exports.default = Resolver;
