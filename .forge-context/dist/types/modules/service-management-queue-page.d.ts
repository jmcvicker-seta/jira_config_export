/**
 * Type definitions for QueuePageContext
 */
export interface QueuePageContext {
    type: 'jiraServiceManagement:queuePage';
    project: {
        id: string;
        key: string;
    };
    location: string;
}
