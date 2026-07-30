"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:workspaceSettingsMenuPage',
    createBase: () => ({
        type: 'bitbucket:workspaceSettingsMenuPage',
        workspace: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayWorkspaceSettingsPageWithUIKit: (base) => ({ ...base, render: "native" }),
        displayWorkspaceSettingsPageWithCustomUI: (base) => ({ ...base, resource: "custom-ui-resource" }),
        displayWorkspaceSettingsPageWithResolverFunction: (base) => ({ ...base, resolver: { ...(base.resolver || {}), function: "resolveWorkspaceSettings" } }),
    }
};
