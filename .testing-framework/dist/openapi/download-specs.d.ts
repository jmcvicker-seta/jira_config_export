/**
 * Script to download OpenAPI specs from Atlassian's public endpoints.
 *
 * Usage:
 *   npx tsx src/openapi/download-specs.ts [--output-dir ./specs] [--product jira]
 *
 * Downloads all (or filtered) OpenAPI v3 specs and saves them locally
 * for fixture validation and template generation.
 */
import { type SpecSource } from './spec-sources.js';
interface DownloadOptions {
    /** Directory to save specs to */
    outputDir?: string;
    /** Only download specs for this product (e.g. 'jira', 'confluence') */
    product?: string;
    /** Whether to skip existing files */
    skipExisting?: boolean;
}
interface DownloadResult {
    source: SpecSource;
    success: boolean;
    filePath?: string;
    error?: string;
    skipped?: boolean;
}
/**
 * Download OpenAPI specs from Atlassian's CDN.
 */
export declare function downloadSpecs(options?: DownloadOptions): Promise<DownloadResult[]>;
export {};
