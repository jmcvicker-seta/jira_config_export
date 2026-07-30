import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
export const checkboxGroupStructure = createRule({
    name: 'checkbox-group-structure',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce proper CheckboxGroup structure and prop usage',
            url: 'https://developer.atlassian.com/platform/forge/ui-kit',
        },
        fixable: 'code',
        messages: {
            missingName: 'CheckboxGroup must have a "name" prop, not "label".',
            missingOptions: 'CheckboxGroup must have an "options" prop with checkbox data.',
            nestedCheckbox: 'CheckboxGroup must not contain nested <Checkbox> components. Use the "options" prop instead.',
            invalidLabelProp: 'CheckboxGroup must use "name" prop, not "label" prop.',
            hasChildren: 'CheckboxGroup must not have children. Use the "options" prop to define checkboxes.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                // Only check JSX elements that have an opening element
                if (node.openingElement?.type !== 'JSXOpeningElement')
                    return;
                const elementName = node.openingElement.name;
                if (elementName?.type !== 'JSXIdentifier')
                    return;
                // Only process CheckboxGroup components
                if (elementName.name !== 'CheckboxGroup')
                    return;
                const attributes = node.openingElement.attributes;
                // Check for required props
                const hasNameProp = attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'name');
                const hasOptionsProp = attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'options');
                const hasLabelProp = attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'label');
                // Check for invalid label prop usage
                if (hasLabelProp) {
                    context.report({
                        node,
                        messageId: 'invalidLabelProp',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
                // Check for missing required props
                if (!hasNameProp) {
                    context.report({
                        node,
                        messageId: 'missingName',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
                if (!hasOptionsProp) {
                    context.report({
                        node,
                        messageId: 'missingOptions',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
                // Check for nested Checkbox children (invalid pattern)
                const hasNestedCheckbox = node.children?.some((child) => {
                    if (child.type === 'JSXElement') {
                        const childName = child.openingElement?.name;
                        return childName?.type === 'JSXIdentifier' && childName.name === 'Checkbox';
                    }
                    return false;
                });
                if (hasNestedCheckbox) {
                    context.report({
                        node,
                        messageId: 'nestedCheckbox',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
                // Check for any children at all (CheckboxGroup should not have children)
                if (node.children && node.children.length > 0) {
                    // Filter out whitespace-only text nodes
                    const nonWhitespaceChildren = node.children.filter((child) => {
                        if (child.type === 'JSXText') {
                            return child.value.trim().length > 0;
                        }
                        return true;
                    });
                    if (nonWhitespaceChildren.length > 0) {
                        context.report({
                            node,
                            messageId: 'hasChildren',
                            fix(fixer) {
                                return fixer.remove(node);
                            },
                        });
                    }
                }
            },
        };
    },
});
