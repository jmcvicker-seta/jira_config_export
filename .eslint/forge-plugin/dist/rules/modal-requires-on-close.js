import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit/components/modal/');
/**
 * Gets the component name from a JSX element's opening tag.
 */
function getComponentName(node) {
    const elementName = node.openingElement?.name;
    if (elementName?.type === 'JSXIdentifier') {
        return elementName.name;
    }
    return null;
}
/**
 * Returns the named JSX attribute (e.g. `onClose={...}`) if present, else undefined.
 */
function getAttribute(node, attributeName) {
    return node.openingElement.attributes.find((attr) => attr.type === 'JSXAttribute' &&
        attr.name.type === 'JSXIdentifier' &&
        attr.name.name === attributeName);
}
// AST node types that represent an actual side effect — calling a function (e.g. a
// state setter), assigning, mutating, awaiting. A handler body with none of these
// does nothing observable.
const EFFECT_TYPES = new Set([
    'CallExpression',
    'OptionalCallExpression',
    'AssignmentExpression',
    'UpdateExpression',
    'AwaitExpression',
    'NewExpression',
    'YieldExpression',
    'TaggedTemplateExpression',
]);
/**
 * True if `node` (or any descendant) performs a side effect. Used to tell a real
 * `onClose` (`() => setIsOpen(false)`) from a no-op (`() => {}`, `() => undefined`).
 */
function containsEffect(node) {
    if (!node || typeof node !== 'object') {
        return false;
    }
    if (Array.isArray(node)) {
        return node.some(containsEffect);
    }
    const record = node;
    if (typeof record.type === 'string' && EFFECT_TYPES.has(record.type)) {
        return true;
    }
    for (const key of Object.keys(record)) {
        // `parent` back-references would cause infinite recursion.
        if (key === 'parent') {
            continue;
        }
        if (containsEffect(record[key])) {
            return true;
        }
    }
    return false;
}
/**
 * True when `onClose` is present but a no-op inline function — an empty body
 * (`() => {}`) or one that does nothing (`() => undefined`). Such a handler leaves
 * the modal just as un-closable as a missing `onClose`. Identifiers / member
 * expressions (`onClose={closeModal}`) are assumed real and not flagged.
 */
function isNoOpHandler(attribute) {
    const value = attribute.value;
    if (!value || value.type !== 'JSXExpressionContainer') {
        return false;
    }
    const expression = value.expression;
    if (expression.type === 'ArrowFunctionExpression' ||
        expression.type === 'FunctionExpression') {
        return !containsEffect(expression.body);
    }
    return false;
}
/**
 * True if the opening element spreads props (e.g. `<Modal {...props} />`).
 * When props are spread we can't statically prove onClose is absent, so we skip
 * the element to avoid false positives.
 */
function hasSpreadAttribute(node) {
    return node.openingElement.attributes.some((attr) => attr.type === 'JSXSpreadAttribute');
}
/**
 * Enforces that every `Modal` is dismissable: it must declare an `onClose`
 * handler. A modal rendered without `onClose` (the classic always-open
 * `<ModalTransition><Modal>…</Modal></ModalTransition>`) cannot be closed by the
 * user and traps the surface — both in the App Builder preview and in the
 * published app. The intended pattern is to gate the modal behind open-state and
 * close it from `onClose`:
 *
 *   const [isOpen, setIsOpen] = useState(false);
 *   ...
 *   {isOpen && (
 *     <Modal onClose={() => setIsOpen(false)}>
 *       <ModalBody>…</ModalBody>
 *     </Modal>
 *   )}
 */
export const modalRequiresOnClose = createRule({
    name: 'modal-requires-on-close',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce that Modal components declare an onClose handler so they can be dismissed',
        },
        messages: {
            modalMissingOnClose: 'Modal must declare an `onClose` handler so it can be dismissed. ' +
                'Gate it behind open-state and close it from onClose, e.g. ' +
                '`{isOpen && <Modal onClose={() => setIsOpen(false)}>…</Modal>}`. ' +
                'See: https://developer.atlassian.com/platform/forge/ui-kit/components/modal/',
            modalNoopOnClose: 'Modal `onClose` is a no-op (e.g. `onClose={() => {}}`), so the modal still ' +
                'cannot be dismissed. Make onClose actually close it, e.g. ' +
                '`onClose={() => setIsOpen(false)}`, and gate the modal behind `{isOpen && …}`. ' +
                'See: https://developer.atlassian.com/platform/forge/ui-kit/components/modal/',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                if (getComponentName(node) !== 'Modal') {
                    return;
                }
                // Spread props might supply onClose — don't flag what we can't see.
                if (hasSpreadAttribute(node)) {
                    return;
                }
                const onClose = getAttribute(node, 'onClose');
                if (!onClose) {
                    context.report({
                        node,
                        messageId: 'modalMissingOnClose',
                    });
                    return;
                }
                // Present but does nothing (`onClose={() => {}}`) — just as un-closable.
                if (isNoOpHandler(onClose)) {
                    context.report({
                        node: onClose,
                        messageId: 'modalNoopOnClose',
                    });
                }
            },
        };
    },
});
