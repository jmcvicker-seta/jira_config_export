/**
 * Type definitions for CustomFieldTypeContext
 */
export interface CustomFieldTypeContext {
    type: 'jira:customFieldType';
    entryPoint: 'edit' | 'view' | 'contextConfig';
    fieldId: string;
    fieldType: string;
    fieldValue?: 'string' | 'string[]' | 'number' | 'object';
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
    configurationId?: number;
    configuration?: Record<string, unknown>;
    fieldContextId?: number;
    issueTransition?: {
        id?: string;
    };
    portal?: {
        id?: number;
    };
    request?: {
        typeId?: number;
    };
}
