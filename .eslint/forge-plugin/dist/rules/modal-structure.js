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
 * Checks if a JSX element has a specific component as a direct child.
 */
function hasDirectChild(node, componentName) {
    return (node.children?.some((child) => {
        if (child.type === 'JSXElement') {
            return getComponentName(child) === componentName;
        }
        return false;
    }) ?? false);
}
/**
 * Gets all direct JSX element children of a node.
 */
function getJSXElementChildren(node) {
    return (node.children?.filter((child) => child.type === 'JSXElement') ??
        []);
}
export const modalStructure = createRule({
    name: 'modal-structure',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce that Modal components contain a ModalBody for proper padding and layout',
        },
        messages: {
            modalMissingBody: 'Modal must contain a ModalBody (as a direct child, or inside a Form). ' +
                'See: https://developer.atlassian.com/platform/forge/ui-kit/components/modal/',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                const componentName = getComponentName(node);
                if (componentName !== 'Modal') {
                    return;
                }
                // Check for ModalBody as direct child
                if (hasDirectChild(node, 'ModalBody')) {
                    return;
                }
                // Check for ModalBody as grandchild via Form (valid pattern from docs)
                const children = getJSXElementChildren(node);
                for (const child of children) {
                    const childName = getComponentName(child);
                    if (childName === 'Form' && hasDirectChild(child, 'ModalBody')) {
                        return;
                    }
                }
                // No ModalBody found at child or grandchild level
                context.report({
                    node,
                    messageId: 'modalMissingBody',
                });
            },
        };
    },
});
