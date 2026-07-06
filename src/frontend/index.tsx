import React, { useEffect, useState, useCallback } from 'react';
import ForgeReconciler, {
  Text,
  Code,
  Button,
  Box,
  Stack,
  Inline,
  Heading,
  CheckboxGroup,
  ProgressBar,
  Spinner,
  SectionMessage,
  Lozenge,
  xcss,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import JSZip from 'jszip';
import { setupGlobalErrorHandlers, logError, ErrorBoundary } from './utils/errorLogger';
import type {
  CategoryResult,
  ExportRecord,
  CategoryStatus,
  CategoryProgress,
} from '../types';

// ---------------------------------------------------------------------------
// Category metadata (mirrors backend CATEGORIES but safe for frontend runtime)
// ---------------------------------------------------------------------------
interface CategoryOption {
  key: string;
  label: string;
  group: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  // Core Config
  { key: 'projects', label: 'Projects', group: 'Core Config' },
  { key: 'workTypes', label: 'Work Types', group: 'Core Config' },
  { key: 'statuses', label: 'Statuses', group: 'Core Config' },
  { key: 'resolutions', label: 'Resolutions', group: 'Core Config' },
  { key: 'priorities', label: 'Priorities', group: 'Core Config' },
  { key: 'customFields', label: 'Custom Fields', group: 'Core Config' },
  { key: 'workflows', label: 'Workflows', group: 'Core Config' },
  { key: 'screens', label: 'Screens', group: 'Core Config' },

  // Access Control
  { key: 'projectRoles', label: 'Project Roles', group: 'Access Control' },
  { key: 'groups', label: 'Groups', group: 'Access Control' },

  // Filters & More
  { key: 'workItemLinks', label: 'Work Item Links', group: 'Filters & More' },
  { key: 'projectCategories', label: 'Project Categories', group: 'Filters & More' },
  { key: 'dashboards', label: 'Dashboards', group: 'Filters & More' },
  { key: 'filters', label: 'Filters', group: 'Filters & More' },

  // Schemes
  { key: 'permissionSchemes', label: 'Permission Schemes', group: 'Schemes' },
  { key: 'workTypeSchemes', label: 'Work Type Schemes', group: 'Schemes' },
  { key: 'workTypeScreenSchemes', label: 'Work Type Screen Schemes', group: 'Schemes' },
  { key: 'prioritySchemes', label: 'Priority Schemes', group: 'Schemes' },
  { key: 'fieldConfigSchemes', label: 'Field Configuration Schemes', group: 'Schemes' },
  { key: 'securitySchemes', label: 'Security Schemes', group: 'Schemes' },
  { key: 'notificationSchemes', label: 'Notification Schemes', group: 'Schemes' },
  { key: 'workflowSchemes', label: 'Workflow Schemes', group: 'Schemes' },

];

const GROUP_ORDER = ['Core Config', 'Access Control', 'Schemes', 'Filters & More'];

const ALL_CATEGORY_KEYS = CATEGORY_OPTIONS.map((c) => c.key);
const DEBUG_ENDPOINT = 'http://127.0.0.1:7805/ingest/cf31c305-6d3e-4bff-99fa-13e277c216f2';
const DEBUG_SESSION_ID = 'f7e38c';

function emitDebugLog(
  runId: string,
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
): void {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

const GROUPED_OPTIONS = GROUP_ORDER.map((group) => {
  const options = CATEGORY_OPTIONS
    .filter((category) => category.group === group)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((category) => ({
      label: category.label,
      value: category.key,
    }));
  return { group, options };
});

/** Resolve a category key to its human-readable label. */
function categoryLabel(key: string): string {
  return CATEGORY_OPTIONS.find((c) => c.key === key)?.label ?? key;
}

// ---------------------------------------------------------------------------
// Preview-mode detection & mock data
// ---------------------------------------------------------------------------
const isPreviewMode =
  typeof window !== 'undefined' &&
  (window as unknown as Record<string, unknown>).__FORGE_PREVIEW__ === true;

const MOCK_EXPORT_RECORD: ExportRecord = {
  id: 'preview-001',
  timestamp: '2025-01-15T10:30:00Z',
  categories: ['projects', 'workflows'],
  results: [
    {
      category: 'projects',
      status: 'done',
      jsonTextContent: JSON.stringify([{ id: 1, key: 'PROJ', name: 'My Project' }], null, 2),
      rowCount: 1,
    },
    {
      category: 'workflows',
      status: 'done',
      jsonTextContent: JSON.stringify([{ id: 1, name: 'Default Workflow' }], null, 2),
      rowCount: 1,
    },
  ],
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const containerStyle = xcss({
  padding: 'space.300',
});

const sectionStyle = xcss({
  padding: 'space.200',
  borderRadius: 'radius.small',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderColor: 'color.border',
  backgroundColor: 'elevation.surface',
});

const progressItemStyle = xcss({
  paddingBlock: 'space.050',
});

const columnStyle = xcss({
  width: '50%',
});

// ---------------------------------------------------------------------------
// App Component
// ---------------------------------------------------------------------------
export const App = (): JSX.Element => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<CategoryProgress[]>([]);
  const [currentExport, setCurrentExport] = useState<ExportRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  // ---- Select / deselect all ----
  const allSelected = selectedCategories.length === ALL_CATEGORY_KEYS.length;

  const handleToggleAll = (): void => {
    setSelectedCategories(allSelected ? [] : [...ALL_CATEGORY_KEYS]);
  };

  // ---- Checkbox change for a single group ----
  const handleGroupCategoryChange = (groupKeys: string[], values: string[]): void => {
    const selectedSet = new Set(values || []);
    setSelectedCategories((prev) => {
      const withoutGroup = prev.filter((key) => !groupKeys.includes(key));
      return [...withoutGroup, ...Array.from(selectedSet)];
    });
  };

  // ---- Export ----
  const handleExport = async (): Promise<void> => {
    if (selectedCategories.length === 0) return;
    const runId = `frontend-export-${Date.now()}`;

    setError(null);
    setIsExporting(true);
    setCurrentExport(null);
    emitDebugLog(runId, 'H5', 'src/frontend/index.tsx:198', 'export started', {
      selectedCategories,
      isPreviewMode,
    });

    // Initialise all selected categories as in-progress
    const initialProgress: CategoryProgress[] = selectedCategories.map((key) => ({
      category: key,
      label: categoryLabel(key),
      status: 'in-progress' as CategoryStatus,
    }));
    setExportProgress(initialProgress);

    try {
      let result: ExportRecord;

      if (isPreviewMode) {
        // Simulate a short delay for preview
        await new Promise((resolve) => setTimeout(resolve, 500));
        result = {
          ...MOCK_EXPORT_RECORD,
          id: `preview-${Date.now()}`,
          timestamp: new Date().toISOString(),
          categories: selectedCategories,
          results: selectedCategories.map((key) => ({
            category: key,
            status: 'done' as const,
            jsonTextContent: JSON.stringify(
              [{ id: 1, name: `Sample ${categoryLabel(key)}` }],
              null,
              2,
            ),
            rowCount: 1,
          })),
        };
      } else {
        emitDebugLog(runId, 'H6', 'src/frontend/index.tsx:225', 'invoking resolver', {
          functionKey: 'fetchConfigurationData',
          selectedCategories,
        });
        result = (await invoke('fetchConfigurationData', {
          categories: selectedCategories,
        })) as ExportRecord;
        emitDebugLog(runId, 'H6', 'src/frontend/index.tsx:231', 'resolver returned', {
          resultId: result?.id,
          resultCount: result?.results?.length ?? 0,
        });
      }

      // Update progress from results
      const finalProgress: CategoryProgress[] = selectedCategories.map((key) => {
        const catResult = (result.results || []).find(
          (r: CategoryResult) => r.category === key,
        );
        return {
          category: key,
          label: categoryLabel(key),
          status: catResult?.status === 'done' ? ('done' as CategoryStatus) : ('error' as CategoryStatus),
          error: catResult?.error,
        };
      });
      setExportProgress(finalProgress);
      setCurrentExport(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      emitDebugLog(runId, 'H7', 'src/frontend/index.tsx:251', 'export failed in frontend', {
        errorMessage: msg,
        selectedCategories,
      });
      logError({ message: `Export failed: ${msg}` });
      setError(`Export failed: ${msg}`);

      // Mark all as error
      setExportProgress((prev) =>
        (prev || []).map((p) => ({ ...p, status: 'error' as CategoryStatus, error: msg })),
      );
    } finally {
      setIsExporting(false);
    }
  };

  // ---- Progress helpers ----
  const completedCount = (exportProgress || []).filter(
    (p) => p.status === 'done' || p.status === 'error',
  ).length;
  const totalCount = (exportProgress || []).length;
  const progressValue = totalCount > 0 ? completedCount / totalCount : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const hasErrors = (exportProgress || []).some((p) => p.status === 'error');

  // ---- Download helper ----
  const downloadBlob = useCallback(async (fileName: string, blob: Blob): Promise<void> => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('Download is only supported in a browser environment.');
      }

      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to download ${fileName}: ${msg}`);
      await logError({ message: `Download failed for ${fileName}: ${msg}` });
    }
  }, []);

  const successfulResultsForRecord = useCallback((record: ExportRecord): CategoryResult[] => (
    (record.results || []).filter(
      (r: CategoryResult) => r.status === 'done' && r.jsonTextContent,
    )
  ), []);

  const handleDownloadZip = useCallback(async (record: ExportRecord): Promise<void> => {
    const successResults = successfulResultsForRecord(record);
    if (successResults.length === 0) {
      setError('No successful exports are available to download.');
      return;
    }

    try {
      const zip = new JSZip();
      for (const result of successResults) {
        zip.file(`${result.category}.txt`, result.jsonTextContent || '');
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      await downloadBlob(`jira-config-export-${record.id}.zip`, zipBlob);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to build ZIP file: ${msg}`);
      await logError({ message: `ZIP generation failed for export ${record.id}: ${msg}` });
    }
  }, [downloadBlob, successfulResultsForRecord]);

  // ---- Lozenge appearance for status ----
  const statusAppearance = (
    status: CategoryStatus,
  ): 'default' | 'inprogress' | 'success' | 'removed' => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'in-progress':
        return 'inprogress';
      case 'done':
        return 'success';
      case 'error':
        return 'removed';
      default:
        return 'default';
    }
  };

  const statusLabel = (status: CategoryStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'error':
        return 'Error';
      default:
        return status;
    }
  };

  // ---- Render ----
  return (
    <Box xcss={containerStyle}>
      <Stack space="space.300">
        {/* Global error */}
        {error && (
          <SectionMessage appearance="error" title="Error">
            <Text>{error}</Text>
          </SectionMessage>
        )}

        {/* Category Selection */}
        <Box xcss={sectionStyle}>
          <Inline space="space.200" alignBlock="start">
            <Box xcss={columnStyle}>
              <Stack space="space.200">
                <Inline space="space.200" alignBlock="center">
                  <Heading size="medium">Select Data to Export</Heading>
                  <Button
                    appearance="subtle"
                    onClick={handleToggleAll}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Button>
                </Inline>
                {GROUPED_OPTIONS.map(({ group, options }) => {
                  const groupKeys = options.map((option) => option.value);
                  const selectedInGroup = selectedCategories.filter((key) => groupKeys.includes(key));
                  return (
                    <Stack key={group} space="space.100">
                      <Heading size="small">{group}</Heading>
                      <CheckboxGroup
                        name={`categories-${group}`}
                        options={options}
                        value={selectedInGroup}
                        onChange={(values) => handleGroupCategoryChange(groupKeys, values)}
                      />
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
            <Box xcss={columnStyle}>
              <Stack space="space.200">
                <Heading size="medium">Manual Export Needed</Heading>
                <Stack key="Agile Boards" space="space.100">
                  <Heading size="small">Agile Boards</Heading>
                  <Code>GET {'{{baseUrl}}'}/rest/agile/1.0/board?includePrivate=yes</Code>
                  <Text size="small">List all boards with type, filter, sub-query, and location; will include estimation type if Scrum.</Text>
                </Stack>
                <Stack key="Work Type Hierarchy" space="space.100">
                  <Heading size="small">Work Type Hierarchy</Heading>
                  <Text>Screenshot your current global hierarchy configuration for Jira.</Text>
                </Stack>
                <Stack key="Global Permissions" space="space.100">
                  <Heading size="small">Global Permissions</Heading>
                  <Code>GET {'{{baseUrl}}'}/secure/admin/GlobalPermissions!default.jspa</Code>
                  <Text size="small">List all global permissions and their default values. This is pulling on a specific URL to scrape values, as no API endpoint exists for pulling global permissions, the descriptions, and their grants</Text>
                </Stack>
                <Stack key="Field Configurations" space="space.100">
                  <Heading size="small">Field Configurations</Heading>
                  <Text>List all field configurations and how many schemes use each; this is a manual copy/paste from the UI into Excel. Any with DELETE as an operation will be able to be removed without impact.</Text>
                  <Box>
                    <Text weight="bold">Why this can't be done via API</Text>
                    <Text size="small">First, note that this endpoint will only return field configurations used in company-managed (classic software or business) projects. This potentially leaves out a significant dataset.</Text>
                    <Text size="small">Next, the /fieldconfigurationscheme endpoint does not expose the actual mapping between a scheme and the field configurations it uses. You’ll see the scheme name, ID, and description, but not which field configuration is used for the default or for specific issue types.</Text>
                    <Text size="small">No fieldConfigurationId or mapping detail in /fieldconfigurationscheme.</Text>
                    <Text size="small">No linkage in /fieldconfiguration responses either.</Text>
                    <Text size="small">No public API endpoint exists (as of April 2025) to directly return scheme-to-configuration mappings.</Text>
                  </Box>
                </Stack>
                <Stack key="Space auditing" space="space.100">
                  <Heading size="small">Space auditing & retention</Heading>
                  <Text>This is a discussion more than an export. The discussion will include looking at the latest updated issue date duration by space, which is solved for in the space export.</Text>
                </Stack>
                <Stack key="Work item auditing" space="space.100">
                  <Heading size="small">Work item auditing & retention</Heading>
                  <Text>This is a discussion more than an export. The discussion will include looking at the last updated work item dates, which is solved for in the project export.</Text>
                </Stack>
                <Stack key="Apps & integrations" space="space.100">
                  <Heading size="small">Marketplace Apps & integrations</Heading>
                  <Text>This is a discussion more than an export. The discussion will include an analysis of installed Marketplace Apps and active integrations versus how your team works.</Text>
                </Stack>
              </Stack>
            </Box>
          </Inline>
        </Box>

        {/* Export Button */}
        <Inline space="space.200" alignBlock="center">
          <Button
            appearance="primary"
            onClick={handleExport}
            isDisabled={selectedCategories.length === 0 || isExporting}
          >
            {selectedCategories.length > 0
              ? `Export Selected (${selectedCategories.length})`
              : 'Export'}
          </Button>
          {isExporting && <Spinner size="medium" />}
        </Inline>

        {/* Progress Section */}
        {(exportProgress || []).length > 0 && (
          <Box xcss={sectionStyle}>
            <Stack space="space.200">
              <Heading size="medium">Export Progress</Heading>
              <ProgressBar
                value={progressValue}
                appearance={allDone && !hasErrors ? 'success' : 'default'}
                ariaLabel="Export progress"
              />
              <Stack space="space.100">
                {(exportProgress || []).map((item) => (
                  <Box key={item.category} xcss={progressItemStyle}>
                    <Inline space="space.100" alignBlock="center">
                      <Lozenge appearance={statusAppearance(item.status)}>
                        {statusLabel(item.status)}
                      </Lozenge>
                      <Text>{item.label}</Text>
                      {item.error && (
                        <Text color="color.text.danger">{item.error}</Text>
                      )}
                    </Inline>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Download Section */}
        {currentExport && !isExporting && (
          <Box xcss={sectionStyle}>
            <Stack space="space.200">
              <Heading size="medium">Download Results</Heading>
              {successfulResultsForRecord(currentExport).length === 0 ? (
                <Text color="color.text.subtlest">
                  No successful exports to download.
                </Text>
              ) : (
                <Inline space="space.100">
                  <Button
                    appearance="primary"
                    onClick={() => {
                      void handleDownloadZip(currentExport);
                    }}
                  >
                    Download ZIP
                  </Button>
                </Inline>
              )}
            </Stack>
          </Box>
        )}

      </Stack>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
ForgeReconciler.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
