import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator(() => 'https://developer.atlassian.com/platform/forge/ui-kit');
// Explicit list of HTML elements.
// Compiled from https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements.
const HTML_TAGS = new Set([
    // HTML
    'html',
    // Document metadata
    'base',
    'head',
    'link',
    'meta',
    'style',
    'title',
    // Sectioning root
    'body',
    // Content sectioning
    'address',
    'article',
    'aside',
    'footer',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hgroup',
    'main',
    'nav',
    'section',
    'search',
    // Text content
    'blockquote',
    'dd',
    'div',
    'dl',
    'dt',
    'figcaption',
    'figure',
    'hr',
    'li',
    'menu',
    'ol',
    'p',
    'pre',
    'ul',
    // Inline text semantics
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'code',
    'data',
    'dfn',
    'em',
    'i',
    'kbd',
    'mark',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
    'wbr',
    // Image and multimedia
    'area',
    'audio',
    'img',
    'map',
    'track',
    'video',
    // Embedded content
    'embed',
    'fencedframe',
    'iframe',
    'object',
    'picture',
    'source',
    // SVG and MathML containers
    'svg',
    'math',
    // Scripting
    'canvas',
    'noscript',
    'script',
    // Demarcating edits
    'del',
    'ins',
    // Table content
    'caption',
    'col',
    'colgroup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    // Forms
    'button',
    'datalist',
    'fieldset',
    'form',
    'input',
    'label',
    'legend',
    'meter',
    'optgroup',
    'option',
    'output',
    'progress',
    'select',
    'selectedcontent',
    'textarea',
    // Interactive elements
    'details',
    'dialog',
    'summary',
    // Web Components
    'slot',
    'template',
    // Obsolete and deprecated (to catch usage and disallow)
    'acronym',
    'big',
    'center',
    'content',
    'dir',
    'font',
    'frame',
    'frameset',
    'image',
    'marquee',
    'menuitem',
    'nobr',
    'noembed',
    'noframes',
    'param',
    'plaintext',
    'rb',
    'rtc',
    'shadow',
    'strike',
    'tt',
    'xmp',
]);
export const noHtmlElements = createRule({
    name: 'no-html-elements',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow raw HTML elements in JSX; require Forge UI Kit components instead',
            url: 'https://developer.atlassian.com/platform/forge/ui-kit',
        },
        fixable: 'code',
        messages: {
            noHtmlElement: 'HTML element "<{{element}}>" must not be used. Use Forge UI Kit components instead.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXElement(node) {
                const nameNode = node.openingElement.name;
                if (nameNode.type === 'JSXIdentifier') {
                    const elementName = nameNode.name;
                    if (HTML_TAGS.has(elementName)) {
                        context.report({
                            node,
                            messageId: 'noHtmlElement',
                            data: { element: elementName },
                            fix(fixer) {
                                return fixer.remove(node);
                            },
                        });
                    }
                    return;
                }
                if (nameNode.type === 'JSXNamespacedName') {
                    const fullName = `${nameNode.namespace.name}:${nameNode.name.name}`;
                    context.report({
                        node,
                        messageId: 'noHtmlElement',
                        data: { element: fullName },
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                    return;
                }
            },
        };
    },
});
export default noHtmlElements;
