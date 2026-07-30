/**
 * Parses a Forge manifest.yml into a typed ManifestConfig.
 *
 * Handles the various manifest shapes (module types, entity definitions,
 * index types) and returns a clean, typed object.
 */
import type { ManifestConfig } from './types.js';
/**
 * Parse a manifest YAML string into a ManifestConfig.
 */
export declare function parseManifest(yamlContent: string): ManifestConfig;
/**
 * Parse a manifest from a file path.
 */
export declare function parseManifestFile(filePath: string): ManifestConfig;
