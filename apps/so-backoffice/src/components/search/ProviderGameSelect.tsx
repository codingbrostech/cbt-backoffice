import { openGameListQueryOptions } from '@cbt-bo/api/game/queries';
import { gameProviderListQueryOptions } from '@cbt-bo/api/game-provider/queries';
import type { GameProviderResult, GameResult } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { useQuery } from '@tanstack/react-query';
import { sift } from 'radash';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export enum EProviderGameField {
  PROVIDER = 'provider',
  GAME = 'game'
}

export interface IProviderGameSelectProps {
  providerName?: string;
  gameName?: string;
  only?: EProviderGameField;
}

const ST8_PROVIDER_CODE = 'st8';
const EMPTY_GAMES: GameResult[] = [];

const buildProviderOptions = (providers: GameProviderResult[]): ISelectOption[] =>
  providers.flatMap(({ code, name }) =>
    code ? [{ value: code, label: sift([name, code]).join(' - ') }] : []
  );

const buildGameOptionLabel = (game: GameResult, id: string): string => {
  const { code, providerCode, descriptions, properties, table, assetNumber } = game;
  const baseName = descriptions?.en ?? code ?? id;
  const isSt8 = providerCode?.toLowerCase() === ST8_PROVIDER_CODE;
  const developer = isSt8 ? properties?.developer : undefined;
  const developerSuffix = developer ? ` (${developer})` : '';
  const labelParts = sift([`${baseName}${developerSuffix}`, table, assetNumber]);

  return `${labelParts.join(' - ')} (${id})`;
};

const buildGameOptions = (games: GameResult[]): ISelectOption[] =>
  games.flatMap(game =>
    game.id ? [{ value: game.id, label: buildGameOptionLabel(game, game.id) }] : []
  );

/**
 * Searchable provider and game selects for a `SearchBar`, bound to
 * `providerName` and `gameName` on the bar's form. The game options narrow to
 * the picked provider, and a game from another provider is cleared when the
 * provider changes. Pass `only` to render one of the two fields.
 *
 * @example
 * <SearchBar.Fields>
 *   <ProviderGameSelect />
 *   <ProviderGameSelect only={EProviderGameField.PROVIDER} />
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
  const { control, getValues, setValue } = useFormContext<Record<string, string>>();
  const providerCode = useWatch({ control, name: providerName });
  const { data: providers = [] } = useQuery({
    ...gameProviderListQueryOptions(),
    enabled: isProviderShown
  });
  const { data: games = EMPTY_GAMES } = useQuery({
    ...openGameListQueryOptions(),
    enabled: isGameShown
  });

  const providerGames = providerCode
    ? games.filter(game => game.providerCode === providerCode)
    : games;
  const providerOptions = buildProviderOptions(providers);
  const gameOptions = buildGameOptions(providerGames);

  useEffect(() => {
    const gameId = getValues(gameName);
    const game = games.find(({ id }) => id === gameId);
    const isOutsideProvider = Boolean(providerCode && game && game.providerCode !== providerCode);

    if (isOutsideProvider) setValue(gameName, '', { shouldDirty: true });
  }, [providerCode, games, gameName, getValues, setValue]);

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
