import { noEmptyComponents } from './rules/no-empty-components.js';
import { checkboxGroupStructure } from './rules/checkbox-group-structure.js';
import { tabsStructure } from './rules/tabs-structure.js';
import { noFormLabelProp } from './rules/no-form-label-prop.js';
import { noHeadingLevelProp } from './rules/no-heading-level-prop.js';
import { noHtmlElements } from './rules/no-html-elements.js';
import { confluenceMacroConfigAllowedComponents } from './rules/confluence-macro-config-allowed-components.js';
import { modalStructure } from './rules/modal-structure.js';
import { modalRequiresOnClose } from './rules/modal-requires-on-close.js';
import { requireForgeReconciler } from './rules/require-forge-reconciler.js';
import { selectRequiresWidth } from './rules/select-requires-width.js';
import { noDoubleEncodeRoute } from './rules/no-double-encode-route.js';
import { noToggleIsChecked } from './rules/no-toggle-is-checked.js';
import { requireAllowImpersonation } from './rules/require-allow-impersonation.js';
import { noDeprecatedSearchEndpoint } from './rules/no-deprecated-search-endpoint.js';
import { noConfluenceV1Api } from './rules/no-confluence-v1-api.js';
import { requireStorageScope } from './rules/require-storage-scope.js';
import { noSensitiveMacroConfigFields } from './rules/no-sensitive-macro-config-fields.js';
import { preferKvsSecretStorage } from './rules/prefer-kvs-secret-storage.js';
import { requireWebtriggerAuth } from './rules/require-webtrigger-auth.js';
const plugin = {
    meta: {
        name: '@my/forge-eslint',
        version: '1.0.0',
        namespace: 'forge',
    },
    rules: {
        'no-empty-components': noEmptyComponents,
        'checkbox-group-structure': checkboxGroupStructure,
        'tabs-structure': tabsStructure,
        'no-form-label-prop': noFormLabelProp,
        'no-heading-level-prop': noHeadingLevelProp,
        'no-html-elements': noHtmlElements,
        'confluence-macro-config-allowed-components': confluenceMacroConfigAllowedComponents,
        'modal-structure': modalStructure,
        'modal-requires-on-close': modalRequiresOnClose,
        'require-forge-reconciler': requireForgeReconciler,
        'select-requires-width': selectRequiresWidth,
        'no-double-encode-route': noDoubleEncodeRoute,
        'no-toggle-is-checked': noToggleIsChecked,
        'require-allow-impersonation': requireAllowImpersonation,
        'no-deprecated-search-endpoint': noDeprecatedSearchEndpoint,
        'no-confluence-v1-api': noConfluenceV1Api,
        'require-storage-scope': requireStorageScope,
        'no-sensitive-macro-config-fields': noSensitiveMacroConfigFields,
        'prefer-kvs-secret-storage': preferKvsSecretStorage,
        'require-webtrigger-auth': requireWebtriggerAuth,
    },
    configs: {
        recommended: {
            plugins: ['forge'],
            rules: {
                'forge/no-empty-components': 'error',
                'forge/checkbox-group-structure': 'error',
                'forge/tabs-structure': 'error',
                'forge/no-form-label-prop': 'error',
                'forge/no-heading-level-prop': 'error',
                'forge/no-html-elements': 'error',
                'forge/confluence-macro-config-allowed-components': 'error',
                'forge/modal-structure': 'error',
                'forge/modal-requires-on-close': 'error',
                'forge/require-forge-reconciler': 'error',
                'forge/select-requires-width': 'error',
                'forge/no-double-encode-route': 'error',
                'forge/no-toggle-is-checked': 'error',
                'forge/require-allow-impersonation': 'error',
                'forge/no-deprecated-search-endpoint': 'error',
                'forge/no-confluence-v1-api': 'error',
                'forge/require-storage-scope': 'error',
                'forge/no-sensitive-macro-config-fields': 'error',
                'forge/prefer-kvs-secret-storage': 'error',
                'forge/require-webtrigger-auth': 'error',
            },
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
            },
        },
    },
};
export default plugin;
