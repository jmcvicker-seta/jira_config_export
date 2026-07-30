"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'bitbucket:repoPullRequestAction',
    createBase: () => ({
        type: 'bitbucket:repoPullRequestAction',
        repository: {
            uuid: 'sample',
        },
        pullRequest: {
            id: 1,
        },
        location: 'https://example.atlassian.net',
    }),
};
