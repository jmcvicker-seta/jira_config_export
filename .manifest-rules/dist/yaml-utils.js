/**
 * Shared YAML traversal helpers for manifest validation rules.
 *
 * Every rule parses the manifest into a `yaml` AST and walks the same handful of
 * nodes (the root map, the `modules` section, a module's `key`/property values).
 * Centralising these helpers avoids duplicating the (subtly fiddly) scalar
 * unwrapping and position-mapping logic across rules.
 */
import { parseDocument, isMap } from 'yaml';
/**
 * Map a node's byte offset back to a 1-indexed line/column for agent-friendly
 * error output. Falls back to the start of the document when range info is
 * unavailable (e.g. synthetic nodes).
 */
export function getPosition(node, source) {
    if (!node.range) {
        return { line: 1, column: 1 };
    }
    const offset = node.range[0];
    const lines = source.slice(0, offset).split('\n');
    return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
    };
}
/**
 * Read a property from a YAML map node, unwrapping scalar nodes to their plain
 * value while returning collection nodes (maps/seqs) as-is for further walking.
 */
export function getPropertyValue(node, propName) {
    for (const pair of node.items) {
        if (pair.key && String(pair.key) === propName) {
            return pair.value && typeof pair.value === 'object' && 'value' in pair.value
                ? pair.value.value
                : pair.value;
        }
    }
    return undefined;
}
/**
 * Resolve a module's `key`, or `'unknown'` when it is missing/non-string, for
 * use in error messages.
 */
export function getModuleKey(node) {
    const keyValue = getPropertyValue(node, 'key');
    return typeof keyValue === 'string' ? keyValue : 'unknown';
}
/**
 * Return the value of a top-level key when it is a map (e.g. `modules`).
 */
export function getTopLevelMap(root, key) {
    for (const pair of root.items) {
        if (pair.key && String(pair.key) === key && isMap(pair.value)) {
            return pair.value;
        }
    }
    return null;
}
/**
 * Parse a manifest YAML string into its root map.
 *
 * Returns `null` on parse failure or when the document root is not a map; rules
 * treat both as "nothing to validate" and defer YAML syntax reporting to
 * {@link validateUiKitModuleStructure}, which emits the single parse error.
 */
export function parseManifestRoot(yamlContent) {
    let doc;
    try {
        doc = parseDocument(yamlContent, { keepSourceTokens: true });
    }
    catch {
        return null;
    }
    const root = doc.contents;
    return isMap(root) ? root : null;
}
