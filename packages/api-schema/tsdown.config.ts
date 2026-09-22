import fs from 'fs';
import path from 'path';
import { defineConfig } from 'tsdown';

const SRC_DIR = path.resolve(import.meta.dirname, 'src');
const GENERATED_DIR = path.join(SRC_DIR, 'generated');

/**
 * Scan all app directories under src/generated/ (bo-fm, bo-so)
 * and build entry points for models and tags.
 * Tags are flattened: src/generated/bo-fm/tags/auth/ → dist/bo-fm/auth/
 */
const buildEntryMap = (): Record<string, string> => {
  const entries: Record<string, string> = {
    fetcher: path.join(SRC_DIR, 'fetcher.ts')
  };

  const apps = fs
    .readdirSync(GENERATED_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(({ name }) => name);

  for (const app of apps) {
    const appDir = path.join(GENERATED_DIR, app);

    const modelsIndex = path.join(appDir, 'models', 'index.ts');

    if (fs.existsSync(modelsIndex)) {
      entries[`${app}/models/index`] = modelsIndex;
    }

    const tagsDir = path.join(appDir, 'tags');

    if (fs.existsSync(tagsDir)) {
      for (const tag of fs.readdirSync(tagsDir, { withFileTypes: true })) {
        if (!tag.isDirectory()) continue;

        const tagIndex = path.join(tagsDir, tag.name, 'index.ts');

        if (fs.existsSync(tagIndex)) {
          entries[`${app}/${tag.name}/index`] = tagIndex;
        }
      }
    }
  }

  return entries;
};

export default defineConfig({
  entry: buildEntryMap(),
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  outExtensions() {
    return { js: '.js', dts: '.d.ts' };
  }
});
