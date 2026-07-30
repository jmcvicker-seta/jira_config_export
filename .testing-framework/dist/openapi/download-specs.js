"use strict";
/**
 * Script to download OpenAPI specs from Atlassian's public endpoints.
 *
 * Usage:
 *   npx tsx src/openapi/download-specs.ts [--output-dir ./specs] [--product jira]
 *
 * Downloads all (or filtered) OpenAPI v3 specs and saves them locally
 * for fixture validation and template generation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSpecs = downloadSpecs;
const fs_1 = require("fs");
const path_1 = require("path");
const spec_sources_js_1 = require("./spec-sources.js");
// Name we expect to find in the testing-framework package.json. Used to
// distinguish "this package's root" from "some ancestor package.json"
// (e.g. the monorepo root, or a parent app that happens to import us).
const FORGE_TESTING_FRAMEWORK_PACKAGE_NAME = '@forge/testing-framework';
// We avoid `import.meta` because this file ships in both CJS and ESM builds
// and `import.meta` doesn't compile under the CJS TS target.
function resolvePackageSpecsDir() {
    if (typeof __dirname !== 'undefined') {
        return (0, path_1.join)(__dirname, '../../specs');
    }
    // ESM/tsx: walk up from the CLI entry script until we find the framework's package.json
    // (matched by name to avoid picking the monorepo root or a parent app).
    const entry = process.argv[1];
    if (entry) {
        let current = (0, path_1.dirname)((0, path_1.resolve)(entry));
        for (let i = 0; i < 6; i++) {
            const pkgPath = (0, path_1.join)(current, 'package.json');
            if ((0, fs_1.existsSync)(pkgPath) && readPackageName(pkgPath) === FORGE_TESTING_FRAMEWORK_PACKAGE_NAME) {
                return (0, path_1.join)(current, 'specs');
            }
            current = (0, path_1.dirname)(current);
        }
    }
    return (0, path_1.resolve)('specs');
}
function readPackageName(packageJsonPath) {
    try {
        const pkg = JSON.parse((0, fs_1.readFileSync)(packageJsonPath, 'utf8'));
        return pkg.name;
    }
    catch {
        return undefined;
    }
}
const DEFAULT_OUTPUT_DIR = resolvePackageSpecsDir();
/**
 * Download OpenAPI specs from Atlassian's CDN.
 */
async function downloadSpecs(options = {}) {
    const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
    (0, fs_1.mkdirSync)(outputDir, { recursive: true });
    let sources = spec_sources_js_1.SPEC_SOURCES;
    if (options.product) {
        sources = sources.filter((s) => s.product === options.product);
    }
    const results = [];
    for (const source of sources) {
        const filePath = (0, path_1.join)(outputDir, source.filename);
        if (options.skipExisting && (0, fs_1.existsSync)(filePath)) {
            results.push({ source, success: true, filePath, skipped: true });
            continue;
        }
        try {
            console.log(`Downloading ${source.name} from ${source.url}...`);
            const response = await fetch(source.url);
            if (!response.ok) {
                results.push({
                    source,
                    success: false,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                });
                continue;
            }
            const content = await response.text();
            // Validate it's valid JSON
            JSON.parse(content);
            (0, fs_1.writeFileSync)(filePath, content);
            console.log(`  ✅ Saved to ${filePath}`);
            results.push({ source, success: true, filePath });
        }
        catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            console.error(`  ❌ Failed: ${error}`);
            results.push({ source, success: false, error });
        }
    }
    return results;
}
// CLI entry point
if (process.argv[1]?.endsWith('download-specs.ts') || process.argv[1]?.endsWith('download-specs.js')) {
    const args = process.argv.slice(2);
    const outputDirIdx = args.indexOf('--output-dir');
    const productIdx = args.indexOf('--product');
    const options = {
        outputDir: outputDirIdx >= 0 ? args[outputDirIdx + 1] : undefined,
        product: productIdx >= 0 ? args[productIdx + 1] : undefined,
        skipExisting: args.includes('--skip-existing'),
    };
    downloadSpecs(options).then((results) => {
        const succeeded = results.filter((r) => r.success && !r.skipped).length;
        const skipped = results.filter((r) => r.skipped).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`\nDone: ${succeeded} downloaded, ${skipped} skipped, ${failed} failed`);
        if (failed > 0)
            process.exit(1);
    });
}
