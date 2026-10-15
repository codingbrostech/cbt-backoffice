import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { useTranslation } from 'react-i18next';

export const PLAYER_SEARCH_FIELDS = [
  'playerId',
  'patronNumber',
  'mobile'
] as const satisfies readonly string[];

export type TPlayerSearchField = (typeof PLAYER_SEARCH_FIELDS)[number];

/**
 * Player filter fields as form values. An empty string means the field is
 * not applied.
 */
export type TPlayerSearchFilter = Record<TPlayerSearchField, string>;

export const DEFAULT_PLAYER_SEARCH_FILTER = {
  playerId: '',
  patronNumber: '',
  mobile: ''
} as const satisfies TPlayerSearchFilter;

/**
 * The player filter fields of a `SearchBar`, bound to PLAYER_SEARCH_FIELDS on
 * the bar's form. Render it inside `SearchBar.Fields` on a form whose values
 * include `TPlayerSearchFilter`.
 *
 * @example
 * <SearchBar.Root defaultValues={{ ...DEFAULT_PLAYER_SEARCH_FILTER, ...DEFAULT_LIST_FILTER }} onSubmit={search}>
 *   <SearchBar.Fields>
 *     <PlayerSearchFields />
 *     <SearchBar.Actions resetLabel={t('common.reset')} submitLabel={t('common.search')} />
 *   </SearchBar.Fields>
 * </SearchBar.Root>
 */
const PlayerSearchFields = () => {
  const { t } = useTranslation();

  return (
    <>
      {PLAYER_SEARCH_FIELDS.map(name => (
        <SearchBar.TextField key={name} name={name} label={t(`player.${name}`)} />
      ))}
    </>
  );
};

export default PlayerSearchFields;
