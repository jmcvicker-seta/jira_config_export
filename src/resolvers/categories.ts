import type { CategoryConfig } from '../types';

export const CATEGORIES: CategoryConfig[] = [
  // Core Config
  { key: 'projects', label: 'Projects', group: 'Core Config', endpoint: '/rest/api/3/project/search?expand=description,lead,issueTypes,insight', paginated: true, dataKey: 'values' },
  { key: 'workTypes', label: 'Work Types', group: 'Core Config', endpoint: '/rest/api/3/issuetype', paginated: false, dataKey: '' },
  { key: 'statuses', label: 'Statuses', group: 'Core Config', endpoint: '/rest/api/3/status', paginated: false, dataKey: '' },
  { key: 'resolutions', label: 'Resolutions', group: 'Core Config', endpoint: '/rest/api/3/resolution/search', paginated: true, dataKey: 'values' },
  { key: 'priorities', label: 'Priorities', group: 'Core Config', endpoint: '/rest/api/3/priority/search', paginated: true, dataKey: 'values' },
  { key: 'customFields', label: 'Custom Fields', group: 'Core Config', endpoint: '/rest/api/3/field/search?expand=key,lastUsed,screensCount,contextsCount,projectsCount,isLocked,isUnscreenable,searcherKey', paginated: true, dataKey: 'values' },
  { key: 'workflows', label: 'Workflows', group: 'Core Config', endpoint: '/rest/api/3/workflow/search?expand=transitions,statuses,schemes,projects', paginated: true, dataKey: 'values' },
  { key: 'screens', label: 'Screens', group: 'Core Config', endpoint: '/rest/api/3/screens?expand=workflowTransitions,screenScheme', paginated: true, dataKey: 'values' },

  // Access Control
  { key: 'projectRoles', label: 'Project Roles', group: 'Access Control', endpoint: '/rest/api/3/role', paginated: false, dataKey: '' },
  { key: 'groups', label: 'Groups', group: 'Access Control', endpoint: '/rest/api/3/group/bulk', paginated: true, dataKey: 'values' },

  // Schemes
  { key: 'permissionSchemes', label: 'Permission Schemes', group: 'Schemes', endpoint: '/rest/api/3/permissionscheme', paginated: false, dataKey: 'permissionSchemes' },
  { key: 'workTypeSchemes', label: 'Work Type Schemes', group: 'Schemes', endpoint: '/rest/api/3/issuetypescheme', paginated: true, dataKey: 'values' },
  { key: 'workTypeScreenSchemes', label: 'Work Type Screen Schemes', group: 'Schemes', endpoint: '/rest/api/3/issuetypescreenscheme', paginated: true, dataKey: 'values' },
  { key: 'prioritySchemes', label: 'Priority Schemes', group: 'Schemes', endpoint: '/rest/api/3/priorityscheme', paginated: true, dataKey: 'values' },
  { key: 'fieldConfigSchemes', label: 'Field Config Schemes', group: 'Schemes', endpoint: '/rest/api/3/fieldconfigurationscheme', paginated: true, dataKey: 'values' },
  { key: 'securitySchemes', label: 'Security Schemes', group: 'Schemes', endpoint: '/rest/api/3/issuesecurityschemes', paginated: false, dataKey: 'issueSecuritySchemes' },
  { key: 'notificationSchemes', label: 'Notification Schemes', group: 'Schemes', endpoint: '/rest/api/3/notificationscheme', paginated: true, dataKey: 'values' },
  { key: 'workflowSchemes', label: 'Workflow Schemes', group: 'Schemes', endpoint: '/rest/api/3/workflowscheme', paginated: true, dataKey: 'values' },

  // Filters & More
  { key: 'workItemLinks', label: 'Work Item Links', group: 'Filters & More', endpoint: '/rest/api/3/issueLinkType', paginated: false, dataKey: 'issueLinkTypes' },
  { key: 'projectCategories', label: 'Project Categories', group: 'Filters & More', endpoint: '/rest/api/3/projectCategory', paginated: false, dataKey: '' },
  { key: 'dashboards', label: 'Dashboards', group: 'Filters & More', endpoint: '/rest/api/3/dashboard', paginated: true, dataKey: 'dashboards' },
  { key: 'filters', label: 'Filters', group: 'Filters & More', endpoint: '/rest/api/3/filter/search?overrideSharePermissions=True&expand=jql,favouritedCount,sharePermissions,approximateLastUsed', paginated: true, dataKey: 'values', requiresUserContext: true },
];
