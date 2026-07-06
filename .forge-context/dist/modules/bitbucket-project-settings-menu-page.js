"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:projectSettingsMenuPage',
    createBase: () => ({
        type: 'bitbucket:projectSettingsMenuPage',
        project: {
            uuid: 'sample',
            key: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayProjectSettingsPageWithUIKit: (base) => ({ ...base, render: "native" }),
        displayProjectSettingsPageWithCustomUI: (base) => ({ ...base, resource: "custom-ui-resource" }),
        displayProjectSettingsPageWithFunctionResolver: (base) => ({ ...base, resolver: { ...(base.resolver || {}), function: "resolveProjectSettings" } }),
    }
};
