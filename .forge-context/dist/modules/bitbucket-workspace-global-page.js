"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:workspaceGlobalPage',
    createBase: () => ({
        type: 'bitbucket:workspaceGlobalPage',
        workspace: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        uIKitWithFunctionResolver: (base) => ({ ...base, render: "native", resolver: "function" }),
        customUIWithFunctionResolver: (base) => ({ ...base, resource: "custom-ui-resource", resolver: "function" }),
        remoteEndpointResolver: (base) => ({ ...base, resolver: "endpoint" }),
    }
};
