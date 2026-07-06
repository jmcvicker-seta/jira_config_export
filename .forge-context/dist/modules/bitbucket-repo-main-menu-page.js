"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoMainMenuPage',
    createBase: () => ({
        type: 'bitbucket:repoMainMenuPage',
        repository: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayRepositoryMenuPageWithUIKit: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "myResolverFunction" } }),
        displayRepositoryMenuPageWithCustomUI: (base) => ({ ...base, resource: "myCustomResource", resolver: { ...(base.resolver || {}), endpoint: "https://example.com/api" } }),
    }
};
