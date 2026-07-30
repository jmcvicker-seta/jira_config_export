"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:globalBackgroundScript',
    createBase: () => ({
        type: 'jira:globalBackgroundScript',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        fieldValueChangeCoordination: (base) => ({ ...base, events: "app.field-change, app.data-change, app.bg.ready" }),
        sharedDataDistribution: (base) => ({ ...base, purpose: "distributing shared data" }),
        heavyCalculationsOptimization: (base) => ({ ...base, purpose: "making heavy calculations" }),
    }
};
