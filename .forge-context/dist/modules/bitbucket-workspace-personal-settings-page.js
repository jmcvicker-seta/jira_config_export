"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:workspacePersonalSettingsPage',
    createBase: () => ({
        type: 'bitbucket:workspacePersonalSettingsPage',
        workspace: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        uIKitWithFunctionResolver: (base) => ({ ...base, render: "native", resource: "main", resolver: { ...(base.resolver || {}), function: "resolver" } }),
        customUIWithFunctionResolver: (base) => ({ ...base, resource: "main", resolver: { ...(base.resolver || {}), function: "resolver" } }),
    }
};
