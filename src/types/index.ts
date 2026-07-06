// Re-export all Forge UI types for convenient importing
export * from './forge-ui-types';

// App-specific types for the Configuration Exporter

export interface CategoryResult {
  category: string;
  status: 'done' | 'error';
  jsonTextContent?: string;
  error?: string;
  rowCount: number;
}

export interface ExportRecord {
  id: string;
  timestamp: string;
  categories: string[];
  results: CategoryResult[];
}

export interface ExportRequest {
  categories: string[];
}

export type CategoryStatus = 'pending' | 'in-progress' | 'done' | 'error';

export interface CategoryProgress {
  category: string;
  label: string;
  status: CategoryStatus;
  error?: string;
}

export interface CategoryConfig {
  key: string;
  label: string;
  group: string;
  endpoint: string;
  paginated: boolean;
  /** The key within the API response JSON that contains the array of records */
  dataKey: string;
  /** Whether this endpoint requires .asUser() instead of .asApp() */
  requiresUserContext?: boolean;
  /** Whether this is an agile endpoint (uses requestJira with agile path) */
  isAgile?: boolean;
}
