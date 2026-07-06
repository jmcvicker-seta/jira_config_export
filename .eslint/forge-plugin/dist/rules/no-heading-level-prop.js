import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
export const noHeadingLevelProp = createRule({
    name: 'no-heading-level-prop',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow level prop on Heading component, use size prop instead',
            url: 'https://developer.atlassian.com/platform/forge/ui-kit',
        },
        fixable: 'code',
        messages: {
            noLevelProp: 'Heading component must use "size" prop, not "level" prop.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                if (node.openingElement?.type !== 'JSXOpeningElement')
                    return;
                const elementName = node.openingElement.name;
                if (elementName?.type !== 'JSXIdentifier')
                    return;
                // Only check Heading components
                if (elementName.name !== 'Heading')
                    return;
                const attributes = node.openingElement.attributes;
                // Check for level prop
                const hasLevelProp = attributes.some((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.type === 'JSXIdentifier' &&
                    attr.name.name === 'level');
                if (hasLevelProp) {
                    context.report({
                        node,
                        messageId: 'noLevelProp',
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                }
            },
        };
    },
});
