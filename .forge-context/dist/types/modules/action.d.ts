/**
 * Type definitions for ActionContext
 */
export interface ActionContext {
    cloudId: string;
    moduleKey: string;
    jira?: {
        url?: string;
        resourceType?: string;
        issueKey?: string;
        issueId?: number;
        issueType?: string;
        issueTypeId?: number;
        projectKey?: string;
        projectId?: number;
    };
    confluence?: {
        url?: string;
        resourceType?: string;
        contentId?: string;
        spaceKey?: string;
        spaceId?: string;
    };
    type: 'rovo:action';
}
