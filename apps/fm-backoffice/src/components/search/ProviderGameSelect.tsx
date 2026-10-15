import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { useTranslation } from 'react-i18next';

import { useProviderGameOptions } from '#/hooks/use-provider-game-options';

export enum EProviderGameField {
  PROVIDER = 'provider',
  GAME = 'game'
}

export interface IProviderGameSelectProps {
  providerName?: string;
  gameName?: string;
  only?: EProviderGameField;
}

/**
 * Searchable provider and game selects for a `SearchBar`, bound to
 * `providerName` and `gameName` on the bar's form. The game options narrow to
 * the picked provider, and a game from another provider is cleared when the
 * provider changes. Pass `only` to render one of the two fields.
 *
 * @example
 * <SearchBar.Fields>
 *   <ProviderGameSelect />
 *   <ProviderGameSelect only="provider" />
 * </SearchBar.Fields>
 */
const ProviderGameSelect = ({
  providerName = 'gamePvdId',
  gameName = 'gameId',
  only
}: IProviderGameSelectProps) => {
  const isProviderShown = !only || only === EProviderGameField.PROVIDER;
  const isGameShown = !only || only === EProviderGameField.GAME;
  const { t } = useTranslation();
  const { providerOptions, gameOptions } = useProviderGameOptions({
    providerName,
    gameName,
    isProviderEnabled: isProviderShown,
    isGameEnabled: isGameShown
  });

  return (
    <>
      {isProviderShown && (
        <SearchBar.SelectField
          name={providerName}
          label={t('game.provider')}
          options={providerOptions}
          allLabel={t('common.all')}
          noResultsLabel={t('common.noResultFound')}
        />
      )}
      {isGameShown && (
        <SearchBar.SelectField
          name={gameName}
          label={t('game.game')}
          options={gameOptions}
          allLabel={t('common.all')}
          noResultsLabel={t('common.noResultFound')}
        />
      )}
    </>
  );
};

export default ProviderGameSelect;
