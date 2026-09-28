import dotenv from 'dotenv';
import fs from 'fs';
import { defineConfig, defineTransformer, type Options } from 'orval';
import path from 'path';

type THttpMethod = (typeof HTTP_METHODS)[number];

interface IOpenApiTag {
  name: string;
  description?: string;
}

interface IOpenApiOperation {
  tags?: string[];
  [key: string]: unknown;
}

interface IOpenApiPathItem
  extends Partial<Record<THttpMethod, IOpenApiOperation>>, Record<string, unknown> {}

interface IOpenApiSpec {
  tags?: IOpenApiTag[];
  paths?: Record<string, IOpenApiPathItem | undefined>;
  [key: string]: unknown;
}

interface IApiProjectSettings {
  specUrl?: string;
  specPath: string;
  tagToRemove: string;
  dirName: string;
}

dotenv.config({ path: '.env.local' });

const MGT_TAG_TO_REMOVE = 'MgtService';
const GENERATED_DIR = path.resolve(import.meta.dirname, 'src/generated');

// ─── Spec transformers ──────────────────────────────────────────────────────

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;

/**
 * Returns a transformer that removes a service tag from both
 * the top-level tag definitions and from every operation.
 */
const removeServiceTag = (tagName: string) =>
  defineTransformer((spec: IOpenApiSpec): IOpenApiSpec => {
    if (spec.tags?.some(t => t.name === tagName)) {
      spec.tags = spec.tags.filter(t => t.name !== tagName);
    }

    for (const pathItem of Object.values(spec.paths ?? {})) {
      for (const method of HTTP_METHODS) {
        const op = pathItem?.[method];
        if (op) {
          op.tags = op.tags?.filter(t => t !== tagName);
        }
      }
    }

    return spec;
  });

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Create an index.ts barrel in each tag folder so the
 * package.json wildcard export resolves correctly.
 */
const generateTagBarrels = (baseDir: string) => {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const tagFile = path.join(baseDir, entry.name, `${entry.name}.ts`);
    const indexFile = path.join(baseDir, entry.name, 'index.ts');

    if (fs.existsSync(tagFile)) {
      fs.writeFileSync(
        indexFile,
        `// Auto-generated barrel. Do not edit — re-run gen:api to regenerate.\nexport * from './${entry.name}';\n`
      );
    }
  }
};

const removeFirstBlockComment = (content: string) => content.replace(/\/\*\*[\s\S]*?\*\/\n?/, '');

const removeImportTypes = (content: string) =>
  content.replace(/import type \{[^}]*\} from '[^']*';\n?/g, '');

/**
 * Collapse all individual model files into a single index.ts barrel.
 * Strips Orval headers and inter-model imports (now same-file references).
 */
const collapseModels = (modelsDir: string) => {
  const files = fs
    .readdirSync(modelsDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .sort();

  const contents: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(modelsDir, file), 'utf-8');

    let stripped = removeFirstBlockComment(content);
    stripped = removeImportTypes(stripped);
    stripped = stripped.trim();

    if (stripped) {
      contents.push(stripped);
    }
  }

  fs.writeFileSync(
    path.join(modelsDir, 'index.ts'),
    `// Auto-generated barrel. Do not edit — re-run gen:api to regenerate.\n\n${contents.join('\n\n')}\n`
  );

  for (const file of files) {
    fs.unlinkSync(path.join(modelsDir, file));
  }
};

// ─── Orval config ────────────────────────────────────────────────────────────

const defineApiProject = ({ specUrl, specPath, tagToRemove, dirName }: IApiProjectSettings) => {
  const appDir = path.join(GENERATED_DIR, dirName);
  const tagsDir = path.join(appDir, 'tags');
  const modelsDir = path.join(appDir, 'models');

  return {
    input: {
      target: `${specUrl}${specPath}`,
      override: {
        transformer: removeServiceTag(tagToRemove)
      }
    },
    output: {
      mode: 'tags-split',
      target: tagsDir,
      schemas: modelsDir,
      client: 'fetch',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/fetcher.ts',
          name: 'customFetch'
        }
      }
    },
    hooks: {
      afterAllFilesWrite: () => {
        generateTagBarrels(tagsDir);
        collapseModels(modelsDir);
      }
    }
  } as const satisfies Options;
};

export default defineConfig({
  'bo-fm': defineApiProject({
    specUrl: process.env.BO_FM_SPEC_URL,
    specPath: '/docs/mgt',
    tagToRemove: MGT_TAG_TO_REMOVE,
    dirName: 'bo-fm'
  }),
  'bo-so': defineApiProject({
    specUrl: process.env.BO_SO_SPEC_URL,
    specPath: '/docs/mgt',
    tagToRemove: MGT_TAG_TO_REMOVE,
    dirName: 'bo-so'
  })
});
