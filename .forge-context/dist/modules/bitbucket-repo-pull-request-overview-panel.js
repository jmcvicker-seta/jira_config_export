"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoPullRequestOverviewPanel',
    createBase: () => ({
        type: 'bitbucket:repoPullRequestOverviewPanel',
        repository: {
            uuid: 'sample',
        },
        pullRequest: {
            id: 1,
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        panelWithUIKitResolver: (base) => ({ ...base, render: "native", resolver: { ...(base.resolver || {}), function: "myResolverFunction" } }),
        panelWithStaticResource: (base) => ({ ...base, resource: "myStaticResource" }),
        panelWithRemoteEndpoint: (base) => ({ ...base, resolver: { ...(base.resolver || {}), endpoint: "https://example.com/resolver" } }),
    }
};
