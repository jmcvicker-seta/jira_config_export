"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    key: 'dashboards:widget',
    createBase: () => ({
        key: 'sample',
        title: "Hello World Widget",
        description: "A sample dashboard widget",
        thumbnail: "https://example.com/icon.svg",
        resource: "widgetResource",
        edit: {
            resource: "widgetEditResource",
            render: 'native',
            resolver: {
                function: "widgetEditResolver",
            },
        },
        render: 'native',
        resolver: {
            function: "widgetResolver",
        },
        config: {
            title: 'sample',
        },
        layout: {
            width: 1,
            height: 1,
        },
        widgetId: 'sample',
        type: 'dashboards:widget',
    }),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    scenarios: {
        viewMode: (base) => ({ ...base, render: "native", edit: null }),
        editMode: (base) => ({ ...base, edit: { ...(base.edit || {}), render: "native", resolver: { ...(base.edit?.resolver || {}), function: "widgetEditResolver" } } }),
        customUIMode: (base) => ({ ...base, render: null, resolver: null }),
    }
};
