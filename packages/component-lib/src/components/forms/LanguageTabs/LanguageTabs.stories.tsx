import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { expect, userEvent, within } from 'storybook/test';

import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import TextareaField from '@cbt-bo/component-lib/components/forms/TextareaField';

import LanguageTabs, { type ILanguageTabsProps } from '.';

interface IStoryFormValues {
  titles: Record<string, string>;
  descriptions: Record<string, string>;
}

const TWO_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '繁體中文' }
];

const THREE_LANGUAGES = [...TWO_LANGUAGES, { value: 'ko', label: '한국어' }];

const meta = {
  title: 'Forms/LanguageTabs',
  component: LanguageTabs,
  tags: ['!autodocs'],
  args: {
    languages: TWO_LANGUAGES
  },
  argTypes: {
    languages: { control: 'object' },
    children: { control: false }
  },
  parameters: {
    layout: 'centered'
  },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    )
  ],
  render: function Render({ languages }) {
    const { control } = useForm<IStoryFormValues>({
      defaultValues: {
        titles: { en: 'Buffalo Blitz', zh: '水牛閃電' },
        descriptions: { en: 'Golden herds trigger expanding wilds.', zh: '金色牛群觸發擴展百搭。' }
      }
    });

    return (
      <LanguageTabs languages={languages}>
        {({ value }) => (
          <>
            <TextField control={control} name={`titles.${value}`} label="Title" />
            <TextareaField control={control} name={`descriptions.${value}`} label="Description" />
          </>
        )}
      </LanguageTabs>
    );
  }
} satisfies Meta<ILanguageTabsProps>;

export default meta;

type TStory = StoryObj<ILanguageTabsProps>;

export const Default: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('tab', { name: '繁體中文' }));

    await expect(canvas.getByLabelText('Title')).toHaveValue('水牛閃電');
  }
};

export const ThreeLanguages: TStory = {
  args: { languages: THREE_LANGUAGES }
};
