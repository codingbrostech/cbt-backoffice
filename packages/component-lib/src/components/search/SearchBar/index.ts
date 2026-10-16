import SearchBarActions from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarActions';
import SearchBarDateRangeField from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarDateRangeField';
import SearchBarFields from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarFields';
import SearchBarHeader from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarHeader';
import SearchBarMultiSelectField from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarMultiSelectField';
import SearchBarRoot from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarRoot';
import SearchBarSelectField from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarSelectField';
import SearchBarTextField from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarTextField';
import SearchBarViewToggle from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarViewToggle';

export type { ISearchBarActionsProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarActions';
export type {
  ISearchBarDateRangeFieldLabels,
  ISearchBarDateRangeFieldProps
} from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarDateRangeField';
export type { ISearchBarFieldsProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarFields';
export type { ISearchBarHeaderProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarHeader';
export type {
  ISearchBarMultiSelectFieldProps,
  TSearchBarFieldSpan
} from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarMultiSelectField';
export type { ISearchBarRootProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarRoot';
export type { ISearchBarSelectFieldProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarSelectField';
export type { ISearchBarTextFieldProps } from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarTextField';
export type {
  ISearchBarViewOption,
  ISearchBarViewToggleProps
} from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarViewToggle';

/**
 * Compound filter bar above a list, with no routing or data-fetching
 * dependency. The applied `values`, the `defaultValues` and `onSubmit` come
 * in through `Root`, and each field part binds to the bar's form by `name`.
 *
 * @example
 * <SearchBar.Root defaultValues={DEFAULT_FILTER} values={filter} onSubmit={search}>
 *   <SearchBar.Header title="Admins">
 *     <Button type="button">Create</Button>
 *   </SearchBar.Header>
 *   <SearchBar.Fields>
 *     <SearchBar.TextField name="code" label="Login" />
 *     <SearchBar.SelectField name="state" label="State" options={states} allLabel="All" />
 *     <SearchBar.MultiSelectField name="labelIds" label="Labels" options={labels} removeLabel="Remove" />
 *     <SearchBar.Actions resetLabel="Reset" submitLabel="Search" />
 *   </SearchBar.Fields>
 * </SearchBar.Root>
 */
const SearchBar = {
  Root: SearchBarRoot,
  Header: SearchBarHeader,
  Fields: SearchBarFields,
  TextField: SearchBarTextField,
  SelectField: SearchBarSelectField,
  MultiSelectField: SearchBarMultiSelectField,
  DateRangeField: SearchBarDateRangeField,
  Actions: SearchBarActions,
  ViewToggle: SearchBarViewToggle
};

export default SearchBar;
