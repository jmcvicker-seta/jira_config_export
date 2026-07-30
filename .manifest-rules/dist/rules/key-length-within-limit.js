/**
 * Validation rule: key-length-within-limit
 *
 * Ensures all manifest keys (module, function, resource, remote) do not exceed the
 * Forge platform's 23-character maximum length. The limit is enforced server-side by
 * XLS (xen-lifecycle-service) and declared in the @forge/manifest JSON schema.
 *
 * Keys must also match the pattern [a-zA-Z0-9_-]+ (alphanumerics, hyphens, underscores).
 * Convention is lowercase-with-hyphens and short suffixes like -fn, -res, -handler.
 */
import { parseDocument, isMap, isSeq } from 'yaml';
import { getPosition } from '../yaml-utils.js';
export const RULE_NAME = 'key-length-within-limit';
export const MAX_KEY_LENGTH = 23;
const KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;
function isScalarNode(node) {
    return node !== null && typeof node === 'object' && 'value' in node;
}
function getKeyValue(node) {
    for (const pair of node.items) {
        if (pair.key && String(pair.key) === 'key') {
            if (isScalarNode(pair.value)) {
                return { value: String(pair.value.value), keyNode: pair.value };
            }
            return { value: String(pair.value), keyNode: null };
        }
    }
    return { value: '', keyNode: null };
}
/**
 * Suggest a shortened key by abbreviating common words.
 */
function suggestShorterKey(key) {
    const abbreviations = {
        function: 'fn',
        handler: 'hdlr',
        executor: 'exec',
        resolver: 'rslvr',
        resource: 'res',
        manager: 'mgr',
        controller: 'ctrl',
        service: 'svc',
        command: 'cmd',
        properties: 'props',
        dynamic: 'dyn',
        configuration: 'config',
        background: 'bg',
        component: 'comp',
        navigation: 'nav',
        application: 'app',
        dashboard: 'dash',
        notification: 'notif',
        description: 'desc',
        admin: 'adm',
    };
    const parts = key.split(/[-_]/);
    const separator = key.includes('_') ? '_' : '-';
    const shortened = parts.map((part) => {
        const lower = part.toLowerCase();
        return abbreviations[lower] ?? part;
    });
    const result = shortened.join(separator);
    if (result.length <= MAX_KEY_LENGTH && result !== key) {
        return result;
    }
    // If still too long, try truncating parts from the middle
    const truncated = shortened.map((p) => (p.length > 4 ? p.slice(0, 4) : p));
    const truncResult = truncated.join(separator);
    if (truncResult.length <= MAX_KEY_LENGTH && truncResult !== key) {
        return truncResult;
    }
    return result;
}
/**
 * Validate a single key entry for length and character constraints.
 */
function validateKeyEntry(node, section, source) {
    const errors = [];
    const { value: keyValue, keyNode } = getKeyValue(node);
    if (!keyValue || keyValue === 'undefined') {
        return errors;
    }
    const posNode = keyNode ?? node;
    const pos = getPosition(posNode, source);
    if (keyValue.length > MAX_KEY_LENGTH) {
        const suggested = suggestShorterKey(keyValue);
        const suggestionText = suggested.length <= MAX_KEY_LENGTH && suggested !== keyValue
            ? ` Try: '${suggested}'`
            : ` Use short suffixes like -fn, -res, -hdlr to stay within the limit.`;
        errors.push({
            rule: RULE_NAME,
            message: `Key '${keyValue}' in '${section}' is ${keyValue.length} characters, which exceeds the Forge platform limit of ${MAX_KEY_LENGTH}.`,
            suggestion: `Shorten the key to ${MAX_KEY_LENGTH} characters or fewer.${suggestionText}`,
            line: pos.line,
            column: pos.column,
            moduleType: section,
            moduleKey: keyValue,
        });
    }
    if (!KEY_PATTERN.test(keyValue)) {
        errors.push({
            rule: RULE_NAME,
            message: `Key '${keyValue}' in '${section}' contains invalid characters. Keys must only contain alphanumerics, hyphens, and underscores.`,
            suggestion: `Rename the key to use only [a-zA-Z0-9_-] characters. Convention is lowercase-with-hyphens (e.g., 'my-module-key').`,
            line: pos.line,
            column: pos.column,
            moduleType: section,
            moduleKey: keyValue,
        });
    }
    return errors;
}
/**
 * Validate all manifest keys are within the 23-character limit.
 *
 * Walks the following manifest sections:
 * - modules.* (all module types, including modules.function)
 * - resources (hosted resource entries)
 * - remotes (remote backend definitions)
 *
 * @param yamlContent - The raw YAML content of the manifest file
 * @returns Array of validation errors
 */
export function validateKeyLengthWithinLimit(yamlContent) {
    const errors = [];
    let doc;
    try {
        doc = parseDocument(yamlContent, { keepSourceTokens: true });
    }
    catch (e) {
        errors.push({
            rule: RULE_NAME,
            message: `Failed to parse manifest YAML: ${e instanceof Error ? e.message : String(e)}`,
            suggestion: 'Fix the YAML syntax errors before validation can proceed.',
            line: 1,
            column: 1,
            moduleType: 'unknown',
            moduleKey: 'unknown',
        });
        return errors;
    }
    const root = doc.contents;
    if (!isMap(root)) {
        return errors;
    }
    for (const rootPair of root.items) {
        if (!rootPair.key)
            continue;
        const rootKey = String(rootPair.key);
        if (rootKey === 'modules' && isMap(rootPair.value)) {
            // Walk every module type under 'modules'
            const modulesNode = rootPair.value;
            for (const modulePair of modulesNode.items) {
                if (!modulePair.key)
                    continue;
                const moduleType = String(modulePair.key);
                if (isSeq(modulePair.value)) {
                    for (const item of modulePair.value.items) {
                        if (isMap(item)) {
                            errors.push(...validateKeyEntry(item, moduleType, yamlContent));
                        }
                    }
                }
            }
        }
        else if (rootKey === 'resources' && isSeq(rootPair.value)) {
            // Walk resource entries
            for (const item of rootPair.value.items) {
                if (isMap(item)) {
                    errors.push(...validateKeyEntry(item, 'resources', yamlContent));
                }
            }
        }
        else if (rootKey === 'remotes' && isSeq(rootPair.value)) {
            // Walk remote entries
            for (const item of rootPair.value.items) {
                if (isMap(item)) {
                    errors.push(...validateKeyEntry(item, 'remotes', yamlContent));
                }
            }
        }
    }
    return errors;
}
