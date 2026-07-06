/**
 * Shared YAML traversal helpers for manifest validation rules.
 *
 * Every rule parses the manifest into a `yaml` AST and walks the same handful of
 * nodes (the root map, the `modules` section, a module's `key`/property values).
 * Centralising these helpers avoids duplicating the (subtly fiddly) scalar
 * unwrapping and position-mapping logic across rules.
 */
import { type YAMLMap } from 'yaml';
/**
 * Map a node's byte offset back to a 1-indexed line/column for agent-friendly
 * error output. Falls back to the start of the document when range info is
 * unavailable (e.g. synthetic nodes).
 */
export declare function getPosition(node: {
    range?: [number, number, number] | null;
}, source: string): {
    line: number;
    column: number;
};
/**
 * Read a property from a YAML map node, unwrapping scalar nodes to their plain
 * value while returning collection nodes (maps/seqs) as-is for further walking.
 */
export declare function getPropertyValue(node: YAMLMap, propName: string): unknown;
/**
 * Resolve a module's `key`, or `'unknown'` when it is missing/non-string, for
 * use in error messages.
 */
export declare function getModuleKey(node: YAMLMap): string;
/**
 * Return the value of a top-level key when it is a map (e.g. `modules`).
 */
export declare function getTopLevelMap(root: YAMLMap, key: string): YAMLMap | null;
/**
 * Parse a manifest YAML string into its root map.
 *
 * Returns `null` on parse failure or when the document root is not a map; rules
 * treat both as "nothing to validate" and defer YAML syntax reporting to
 * {@link validateUiKitModuleStructure}, which emits the single parse error.
 */
export declare function parseManifestRoot(yamlContent: string): YAMLMap | null;
//# sourceMappingURL=yaml-utils.d.ts.map