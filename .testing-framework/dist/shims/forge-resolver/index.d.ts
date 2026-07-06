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
export interface ResolverRequest {
    payload: Record<string, unknown>;
    context: Record<string, unknown>;
}
export type ResolverHandler = (req: ResolverRequest) => unknown | Promise<unknown>;
export declare class Resolver {
    private readonly handlers;
    /**
     * Register a handler for a define key.
     */
    define(name: string, handler: ResolverHandler): void;
    /**
     * Returns the function that Forge invokes at runtime.
     * The returned function accepts `{ call: { functionKey, payload }, context }`.
     */
    getDefinitions(): (invocation: {
        call: {
            functionKey: string;
            payload?: Record<string, unknown>;
        };
        context: Record<string, unknown>;
    }) => Promise<unknown>;
    /**
     * Get all registered define keys (useful for test assertions).
     */
    getRegisteredKeys(): string[];
}
/**
 * Creates a resolver in one step using type-safe definitions.
 * Matches `import { makeResolver } from '@forge/resolver'`.
 */
export declare function makeResolver<D extends Record<string, (req: ResolverRequest) => unknown | Promise<unknown>>>(handlers: D): (invocation: {
    call: {
        functionKey: string;
        payload?: Record<string, unknown>;
    };
    context: Record<string, unknown>;
}) => Promise<unknown>;
export default Resolver;
