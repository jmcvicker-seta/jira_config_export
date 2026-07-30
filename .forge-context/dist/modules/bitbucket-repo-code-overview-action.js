"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoCodeOverviewAction',
    createBase: () => ({
        type: 'bitbucket:repoCodeOverviewAction',
        repository: {
            uuid: 'sample',
        },
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        displayRepositoryCodeOverviewActionWithModal: (base) => ({ ...base, resolver: "function", render: "native" }),
        actionWithCustomUIResource: (base) => ({ ...base, resource: "custom-resource-key", render: "native" }),
    }
};
