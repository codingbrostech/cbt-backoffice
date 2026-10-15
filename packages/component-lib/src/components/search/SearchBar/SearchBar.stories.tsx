import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { ETableView } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';

import SearchBar from '.';

interface IFilterValues {
  code: string;
  state: string;
  role: string;
}

interface IStoryArgs {
  onSubmit: (values: IFilterValues) => void;
  className?: string;
  title: string;
  isCreateShown: boolean;
  createLabel: string;
  codeLabel: string;
  stateLabel: string;
  roleLabel: string;
  allLabel: string;
  resetLabel: string;
  submitLabel: string;
  viewLabel: string;
  simpleLabel: string;
  detailLabel: string;
}

interface IStoryViewToggleProps {
  label: string;
  simpleLabel: string;
  detailLabel: string;
}

interface IPartControls {
  part: string;
  include: readonly (keyof IStoryArgs)[];
}

/**
 * The args grouped by the `SearchBar` part that takes them.
 */
export const PART_CONTROLS = [
  { part: 'Root', include: ['onSubmit', 'className'] },
  { part: 'Header', include: ['title', 'isCreateShown', 'createLabel'] },
  { part: 'TextField', include: ['codeLabel'] },
  { part: 'SelectField', include: ['stateLabel', 'roleLabel', 'allLabel'] },
  { part: 'Actions', include: ['resetLabel', 'submitLabel'] },
  { part: 'ViewToggle', include: ['viewLabel', 'simpleLabel', 'detailLabel'] }
] as const satisfies readonly IPartControls[];

const DEFAULT_FILTER = { code: '', state: '', role: '' } as const satisfies IFilterValues;
const STATE_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];
const ROLE_OPTIONS = [
  { value: 'super', label: 'Super' },
  { value: 'admin', label: 'Admin' }
];

const StoryViewToggle = ({ label, simpleLabel, detailLabel }: IStoryViewToggleProps) => {
  const [view, setView] = useState(ETableView.SIMPLE);

  const viewOptions = [
    { value: ETableView.SIMPLE, label: simpleLabel },
    { value: ETableView.DETAIL, label: detailLabel }
  ] as const satisfies readonly { value: ETableView; label: string }[];

  return (
    <SearchBar.ViewToggle
      label={label}
      value={view}
      options={viewOptions}
      onValueChange={setView}
    />
  );
};

const meta = {
  title: 'Search/SearchBar',
  tags: ['!autodocs'],
  excludeStories: ['PART_CONTROLS'],
  args: {
    onSubmit: fn(),
    title: 'Admins',
    isCreateShown: true,
    createLabel: 'Create Admin',
    codeLabel: 'Login',
    stateLabel: 'State',
    roleLabel: 'Role',
    allLabel: 'All',
    resetLabel: 'Reset',
    submitLabel: 'Search',
    viewLabel: 'View',
    simpleLabel: 'Simple',
    detailLabel: 'Detail'
  },
  argTypes: {
    onSubmit: {
      description: 'Called with the field values on search, and with the defaults on reset.',
      table: { category: 'Root' }
    },
    className: {
      description: 'Classes on `Root`.',
      table: { category: 'Root' }
    },
    title: {
      type: { name: 'string', required: true },
      description: 'Heading of `Header`.',
      table: { category: 'Header' }
    },
    isCreateShown: {
      type: { name: 'boolean' },
      description: 'Story-only. Renders a create button as the `Header` children.',
      table: { category: 'Header' }
    },
    createLabel: {
      type: { name: 'string' },
      description: 'Story-only. Label of that create button.',
      table: { category: 'Header' }
    },
    codeLabel: {
      type: { name: 'string', required: true },
      description: 'Label of the `TextField` bound to `code`.',
      table: { category: 'TextField' }
    },
    stateLabel: {
      type: { name: 'string', required: true },
      description: 'Label of the `SelectField` bound to `state`.',
      table: { category: 'SelectField' }
    },
    roleLabel: {
      type: { name: 'string', required: true },
      description: 'Label of the `SelectField` bound to `role`.',
      table: { category: 'SelectField' }
    },
    allLabel: {
      type: { name: 'string', required: true },
      description: 'Placeholder of each `SelectField` while nothing is picked.',
      table: { category: 'SelectField' }
    },
    resetLabel: {
      type: { name: 'string', required: true },
      description: 'Label of the reset button in `Actions`.',
      table: { category: 'Actions' }
    },
    submitLabel: {
      type: { name: 'string', required: true },
      description: 'Label of the search button in `Actions`.',
      table: { category: 'Actions' }
    },
    viewLabel: {
      type: { name: 'string', required: true },
      description: 'Accessible name of the `ViewToggle` group.',
      table: { category: 'ViewToggle' }
    },
    simpleLabel: {
      type: { name: 'string', required: true },
      description: 'Story-only. Label of the first `ViewToggle` option.',
      table: { category: 'ViewToggle' }
    },
    detailLabel: {
      type: { name: 'string', required: true },
      description: 'Story-only. Label of the second `ViewToggle` option.',
      table: { category: 'ViewToggle' }
    }
  },
  render: ({
    onSubmit,
    className,
    title,
    isCreateShown,
    createLabel,
    codeLabel,
    stateLabel,
    roleLabel,
    allLabel,
    resetLabel,
    submitLabel,
    viewLabel,
    simpleLabel,
    detailLabel
  }) => (
    <SearchBar.Root defaultValues={DEFAULT_FILTER} onSubmit={onSubmit} className={className}>
      <SearchBar.Header title={title}>
        {isCreateShown && (
          <Button type="button">
            <PlusIcon />
            {createLabel}
          </Button>
        )}
      </SearchBar.Header>
      <SearchBar.Fields>
        <SearchBar.TextField name="code" label={codeLabel} />
        <SearchBar.SelectField
          name="state"
          label={stateLabel}
          options={STATE_OPTIONS}
          allLabel={allLabel}
        />
        <SearchBar.SelectField
          name="role"
          label={roleLabel}
          options={ROLE_OPTIONS}
          allLabel={allLabel}
        />
        <SearchBar.Actions resetLabel={resetLabel} submitLabel={submitLabel}>
          <StoryViewToggle label={viewLabel} simpleLabel={simpleLabel} detailLabel={detailLabel} />
        </SearchBar.Actions>
      </SearchBar.Fields>
    </SearchBar.Root>
  )
} satisfies Meta<IStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Login'), 'ada');
    await userEvent.click(canvas.getByRole('combobox', { name: 'State' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Active' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Search' }));

    await expect(args.onSubmit).toHaveBeenLastCalledWith({
      code: 'ada',
      state: 'active',
      role: ''
    });

    await userEvent.click(await canvas.findByRole('button', { name: 'Reset' }));

    await expect(args.onSubmit).toHaveBeenLastCalledWith(DEFAULT_FILTER);
    await expect(canvas.getByLabelText('Login')).toHaveValue('');

    await userEvent.click(canvas.getByRole('radio', { name: 'Detail' }));

    await expect(canvas.getByRole('radio', { name: 'Detail' })).toBeChecked();
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
  }
};

export const WithoutHeaderAction: TStory = {
  args: { isCreateShown: false }
};
