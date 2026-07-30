"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoCodeFileViewer',
    createBase: () => ({
        type: 'bitbucket:repoCodeFileViewer',
        repository: {
            uuid: 'sample',
        },
        file: {
            path: 'sample',
        },
        commit: {
            hash: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        markdownFileViewer: (base) => ({ ...base, filePattern: ".*\\.md$" }),
        uIKitWithFunctionResolver: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "string" } }),
        customUIWithEndpointResolver: (base) => ({ ...base, resource: "string", resolver: { ...(base.resolver || {}), endpoint: "string" } }),
    }
};
