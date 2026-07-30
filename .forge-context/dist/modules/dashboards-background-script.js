"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'dashboards:backgroundScript',
    createBase: () => ({
        key: "dashboard-bg-script",
        resource: "dashBgScriptResource",
        render: 'native',
        type: 'dashboards:backgroundScript',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        dataDistributionAcrossWidgets: (base) => ({ ...base, key: "dashboard-bg-script", resource: "dashBgScriptResource", render: "native" }),
        widgetCommunication: (base) => ({ ...base, key: "dashboard-bg-script", resource: "dashBgScriptResource", render: "native" }),
    }
};
