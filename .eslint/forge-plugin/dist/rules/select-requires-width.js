import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
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
 * Checks if a JSX element has a specific attribute.
 */
function hasAttribute(node, attrName) {
    return node.openingElement.attributes.some((attr) => attr.type === 'JSXAttribute' &&
        attr.name?.type === 'JSXIdentifier' &&
        attr.name.name === attrName);
}
/**
 * Walks up the AST to find if there's an ancestor Box element with an xcss prop.
 */
function hasBoxAncestorWithXcss(node) {
    let current = node.parent;
    while (current) {
        if (current.type === 'JSXElement') {
            const name = getComponentName(current);
            if (name === 'Box' && hasAttribute(current, 'xcss')) {
                return true;
            }
        }
        current = current.parent;
    }
    return false;
}
export const selectRequiresWidth = createRule({
    name: 'select-requires-width',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce that Select components are wrapped in a Box with xcss for width control',
        },
        messages: {
            selectNeedsWidth: 'Select component should be wrapped in a Box with xcss prop to control its width (e.g. minWidth). ' +
                'Without this, the Select dropdown may be too narrow to read. ' +
                'Example: <Box xcss={selectStyle}><Select ... /></Box>',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                const componentName = getComponentName(node);
                if (componentName !== 'Select') {
                    return;
                }
                if (!hasBoxAncestorWithXcss(node)) {
                    context.report({
                        node,
                        messageId: 'selectNeedsWidth',
                    });
                }
            },
        };
    },
});
