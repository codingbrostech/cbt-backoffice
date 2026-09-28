import { addons, type API } from 'storybook/manager-api';
import { create, type ThemeVarsPartial } from 'storybook/theming';

export interface IManagerOptions {
  /** The title displayed in the Storybook sidebar header and browser tab */
  title: string;
  /** The base color scheme. Defaults to 'light'. */
  base?: ThemeVarsPartial['base'];
}

interface IStoryData {
  title?: string;
  name?: string;
}

/**
 * Formats the browser tab title based on story data.
 * Output: `"{Path} · {Story Name} — {pageTitle}"` (e.g., "Atoms › Button · Primary — Component Lib")
 */
function formatTitle(storyData: IStoryData = {}, pageTitle: string): string {
  const { title = '', name = '' } = storyData;
  const path = title
    .split('/')
    .map(s => s.trim())
    .join(' › ');

  return path && name ? `${path} · ${name} — ${pageTitle}` : pageTitle;
}

/**
 * Registers a Storybook addon that dynamically updates the browser tab title
 * based on the currently selected story.
 *
 * Note: Uses `setTimeout` for initial title update because during addon registration,
 * Storybook hasn't selected the initial story yet. The deferred call ensures
 * `getCurrentStoryData()` returns valid data.
 *
 * @param pageTitle - The base title to display (e.g., "Component Lib")
 */
function registerTitleAddon(pageTitle: string): void {
  addons.register('TitleAddon', (api: API) => {
    const updateTitle = (): void => {
      try {
        const storyData = api.getCurrentStoryData();
        document.title = formatTitle(storyData, pageTitle);
      } catch (error) {
        document.title = pageTitle;
        if (process.env.NODE_ENV === 'development') {
          console.error('[Storybook TitleAddon] No story selected:', error);
        }
      }
    };

    api.on('storyChanged', updateTitle);
    api.on('storyRendered', updateTitle);

    setTimeout(updateTitle);
  });
}

/**
 * Sets up the Storybook manager with a custom theme and dynamic browser tab title.
 *
 * This function configures:
 * - The sidebar header brand title
 * - The color scheme (light/dark)
 * - Dynamic browser tab title that updates based on the selected story
 *
 * @param options - Configuration options for the manager
 *
 * @example
 * ```typescript
 * import { setupManager } from "@cbt-bo/config/storybook";
 *
 * setupManager({ title: "Storybook - Component Lib" });
 * ```
 */
export function setupManager({ title, base = 'light' }: IManagerOptions): void {
  registerTitleAddon(title);
  addons.setConfig({
    theme: create({ base, brandTitle: title })
  });
}
