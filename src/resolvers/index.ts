import Resolver from '@forge/resolver';
import api, { assumeTrustedRoute } from '@forge/api';
import { v4 as uuidv4 } from 'uuid';
import type { CategoryConfig, CategoryResult, ExportRecord } from '../types';
import { CATEGORIES } from './categories';

// Re-export CATEGORIES so other modules can access via resolvers barrel
export { CATEGORIES } from './categories';

// Basic type for Forge resolver request
interface ResolverRequest {
  payload?: unknown;
  context?: {
    accountId?: string;
    cloudId?: string;
    [key: string]: unknown;
  };
}

// ---------- Helper: JSON text generation ----------

/**
 * Convert fetched records to readable JSON text for file download.
 */
export function generateJsonText(records: Record<string, unknown>[]): string {
  return JSON.stringify(records, null, 2);
}

// ---------- Helper: API fetching with retry ----------

const MAX_RETRIES = 3;
const MAX_RESULTS = 50;
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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch data from a Jira REST API endpoint with pagination and retry support.
 */
async function fetchCategoryData(config: CategoryConfig): Promise<{ records: Record<string, unknown>[]; error?: string }> {
  const records: Record<string, unknown>[] = [];

  if (!config.paginated) {
    // Non-paginated: single request
    const result = await fetchWithRetry(config.endpoint, config);
    if (result.error) {
      return { records: [], error: result.error };
    }
    const data = result.data;
    if (config.dataKey === '') {
      // Root array response
      if (Array.isArray(data)) {
        records.push(...(data as Record<string, unknown>[]));
      }
    } else {
      const items = (data as Record<string, unknown>)?.[config.dataKey];
      if (Array.isArray(items)) {
        records.push(...(items as Record<string, unknown>[]));
      }
    }
    return { records };
  }

  // Paginated: loop until all records fetched
  let startAt = 0;
  let hasMore = true;

  while (hasMore) {
    const separator = config.endpoint.includes('?') ? '&' : '?';
    const url = `${config.endpoint}${separator}startAt=${startAt}&maxResults=${MAX_RESULTS}`;

    const result = await fetchWithRetry(url, config);
    if (result.error) {
      return { records: [], error: result.error };
    }

    const data = result.data as Record<string, unknown>;
    const items = data[config.dataKey];
    if (Array.isArray(items)) {
      records.push(...(items as Record<string, unknown>[]));
    }

    // Check if there are more pages
    const isLast = data.isLast as boolean | undefined;
    const returnedCount = Array.isArray(items) ? items.length : 0;

    if (isLast === true || returnedCount < MAX_RESULTS) {
      hasMore = false;
    } else {
      startAt += MAX_RESULTS;
    }
  }

  return { records };
}

/**
 * Make a single API request with exponential backoff retry on HTTP 429.
 */
async function fetchWithRetry(
  url: string,
  config: CategoryConfig,
  retryCount = 0,
): Promise<{ data?: unknown; error?: string }> {
  const runId = `${config.key}-${Date.now()}`;
  const makeRequest = async (identity: 'asUser' | 'asApp') => {
    const requestFn = identity === 'asUser'
      ? api.asUser().requestJira
      : api.asApp().requestJira;
    emitDebugLog(runId, 'H1', 'src/resolvers/index.ts:140', 'request attempt', {
      categoryKey: config.key,
      url,
      retryCount,
      identity,
    });
    return requestFn(assumeTrustedRoute(url), {
      headers: { Accept: 'application/json' },
    });
  };

  try {
    console.log(`[fetchWithRetry] ${config.requiresUserContext ? 'asUser' : 'asApp'} GET ${url}`);
    emitDebugLog(runId, 'H2', 'src/resolvers/index.ts:136', 'fetchWithRetry entry', {
      categoryKey: config.key,
      url,
      retryCount,
      requiresUserContext: !!config.requiresUserContext,
      isAgile: !!config.isAgile,
    });

    emitDebugLog(runId, 'H1', 'src/resolvers/index.ts:146', 'selected Jira request identity', {
      categoryKey: config.key,
      selectedIdentity: config.requiresUserContext ? 'asUser' : 'asApp',
    });

    const primaryIdentity: 'asUser' | 'asApp' = config.requiresUserContext ? 'asUser' : 'asApp';
    let response = await makeRequest(primaryIdentity);

    emitDebugLog(runId, 'H3', 'src/resolvers/index.ts:152', 'jira response received', {
      categoryKey: config.key,
      status: response.status,
      ok: response.ok,
      url,
    });

    if (response.status === 429) {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`[fetchWithRetry] Rate limited (429), retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return fetchWithRetry(url, config, retryCount + 1);
      }
      return { error: `Rate limited after ${MAX_RETRIES} retries` };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[fetchWithRetry] HTTP ${response.status} for ${url}: ${errorText}`);
      emitDebugLog(runId, 'H3', 'src/resolvers/index.ts:168', 'jira response not ok', {
        categoryKey: config.key,
        status: response.status,
        errorText,
        url,
      });
      return { error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetchWithRetry] Exception for ${url}: ${message}`);
    emitDebugLog(runId, 'H4', 'src/resolvers/index.ts:176', 'jira request threw exception', {
      categoryKey: config.key,
      url,
      retryCount,
      exceptionMessage: message,
      requiresUserContext: !!config.requiresUserContext,
    });

    return { error: `Exception: ${message}` };
  }
}

// ---------- Resolver ----------

const resolver = new Resolver();

resolver.define('fetchConfigurationData', async (req: ResolverRequest) => {
  const payload = req.payload as { categories?: string[] } | undefined;
  const requestedCategories = payload?.categories ?? [];
  const resolverRunId = `resolver-${Date.now()}`;

  console.log(`[fetchConfigurationData] Starting export for categories: ${requestedCategories.join(', ')}`);
  emitDebugLog(resolverRunId, 'H1', 'src/resolvers/index.ts:194', 'resolver invoked', {
    requestedCategories,
    hasContext: !!req.context,
    accountIdPresent: !!req.context?.accountId,
    cloudIdPresent: !!req.context?.cloudId,
  });

  const exportId = uuidv4();
  const timestamp = new Date().toISOString();
  const results: CategoryResult[] = [];

  // Process categories sequentially (not in parallel) to avoid rate limiting
  for (const categoryKey of requestedCategories) {
    const config = CATEGORIES.find((c) => c.key === categoryKey);
    if (!config) {
      console.error(`[fetchConfigurationData] Unknown category: ${categoryKey}`);
      results.push({
        category: categoryKey,
        status: 'error',
        error: `Unknown category: ${categoryKey}`,
        rowCount: 0,
      });
      continue;
    }

    console.log(`[fetchConfigurationData] Fetching ${config.label} (${config.key})...`);

    try {
      const { records, error } = await fetchCategoryData(config);

      if (error) {
        console.error(`[fetchConfigurationData] Error fetching ${config.key}: ${error}`);
        results.push({
          category: categoryKey,
          status: 'error',
          error,
          rowCount: 0,
        });
      } else {
        const jsonTextContent = generateJsonText(records);
        console.log(`[fetchConfigurationData] ${config.key}: ${records.length} records, JSON text length: ${jsonTextContent.length}`);
        results.push({
          category: categoryKey,
          status: 'done',
          jsonTextContent,
          rowCount: records.length,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[fetchConfigurationData] Exception for ${config.key}: ${message}`);
      results.push({
        category: categoryKey,
        status: 'error',
        error: message,
        rowCount: 0,
      });
    }
  }

  const exportRecord: ExportRecord = {
    id: exportId,
    timestamp,
    categories: requestedCategories,
    results,
  };

  console.log(`[fetchConfigurationData] Export ${exportId} complete. ${results.length} categories processed.`);
  return exportRecord;
});

// Error logging resolver
resolver.define('logError', (req: ResolverRequest) => {
  const errorData = req.payload as {
    message: string;
    stack?: string;
    source?: string;
    lineno?: number;
    colno?: number;
    timestamp: string;
    userAgent?: string;
    url?: string;
  };

  // Log structured error data to Forge logging platform
  console.error('[Frontend Error]', {
    message: errorData.message,
    stack: errorData.stack,
    source: errorData.source,
    line: errorData.lineno,
    column: errorData.colno,
    timestamp: errorData.timestamp,
    userAgent: errorData.userAgent,
    url: errorData.url,
  });

  return { success: true };
});

// Type assertion to avoid export naming issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = resolver.getDefinitions() as any;
