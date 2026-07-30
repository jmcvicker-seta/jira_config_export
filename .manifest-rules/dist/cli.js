#!/usr/bin/env node
/**
 * CLI for validating Forge manifest files.
 *
 * Usage:
 *   node cli.js [manifest-path]
 *   node cli.js                    # defaults to ./manifest.yml
 *   node cli.js ./path/to/manifest.yml
 *
 * Exit codes:
 *   0 - Validation passed
 *   1 - Validation failed (errors found)
 *   2 - File not found or read error
 */
import fs from 'fs';
import path from 'path';
import { validateManifest, formatValidationErrors } from './index.js';
function main() {
    const args = process.argv.slice(2);
    const manifestPath = args[0] || 'manifest.yml';
    const resolvedPath = path.resolve(process.cwd(), manifestPath);
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ Manifest file not found: ${resolvedPath}`);
        process.exit(2);
    }
    // Read the manifest file
    let yamlContent;
    try {
        yamlContent = fs.readFileSync(resolvedPath, 'utf-8');
    }
    catch (error) {
        console.error(`❌ Failed to read manifest file: ${resolvedPath}`);
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(2);
    }
    // Validate the manifest
    const result = validateManifest(yamlContent, resolvedPath);
    // Output the results
    console.log(formatValidationErrors(result));
    // Exit with appropriate code
    process.exit(result.valid ? 0 : 1);
}
main();
