/**
 * Type definitions for CustomFieldContext
 */
export interface CustomFieldContext {
    type: 'jira:customField';
    entryPoint: 'edit' | 'view';
    fieldId: string;
    fieldType: string;
    fieldValue: 'string' | 'string[]' | 'number' | 'object';
    issue: {
        id: string;
        key: string;
        type: string;
        typeId: string;
    };
    project: {
        id: string;
        key: string;
        type: 'business' | 'software' | 'product_discovery' | 'service_desk' | 'ops';
    };
    renderContext: 'issue-view' | 'issue-create' | 'issue-transition' | 'portal-view' | 'portal-request';
    experience: 'issue-view' | 'issue-create' | 'issue-transition' | 'portal-view' | 'portal-request';
    issueTransition?: {
        id?: string;
    };
    portal?: {
        id?: number;
    };
    request?: {
        typeId?: number;
    };
    location: string;
}
