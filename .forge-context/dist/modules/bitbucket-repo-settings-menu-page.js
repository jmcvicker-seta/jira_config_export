"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoSettingsMenuPage',
    createBase: () => ({
        type: 'bitbucket:repoSettingsMenuPage',
        repository: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayRepositorySettingsPageWithUIKit: (base) => ({ ...base, render: "native" }),
        displayRepositorySettingsPageWithCustomUI: (base) => ({ ...base, resource: "custom-ui-resource" }),
        accessRepositoryContextInResolver: (base) => ({ ...base, resolver: { ...(base.resolver || {}), function: "resolver-function" } }),
    }
};
