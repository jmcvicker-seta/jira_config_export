"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'jira:fullPage',
    createBase: () => ({
        type: 'jira:fullPage',
        location: 'https://example.atlassian.net',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        dashboardView: (base) => ({ ...base, render: "native", routePrefix: "dashboard" }),
        customUIIntegration: (base) => ({ ...base, resource: "custom-ui-resource", routePrefix: "custom-view" }),
        remoteBackendIntegration: (base) => ({ ...base, resolver: { ...(base.resolver || {}), endpoint: "https://example.com/api" }, routePrefix: "remote-app" }),
    }
};
