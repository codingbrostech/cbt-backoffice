import { assign } from 'radash';
import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';

export type TPreviewConfig = Partial<ProjectAnnotations<Renderer>>;

/** Base preview configuration shared across all Storybook instances */
const basePreviewConfig = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
} satisfies TPreviewConfig;

/**
 * Creates a Storybook preview configuration with autodocs and a11y settings.
 */
export function createPreviewConfig(options: TPreviewConfig = {}): TPreviewConfig {
  const { parameters = {}, tags = [], ...rest } = options;
  return {
    ...basePreviewConfig,
    tags: [...basePreviewConfig.tags, ...tags],
    parameters: assign(basePreviewConfig.parameters, parameters),
    ...rest
  };
}
