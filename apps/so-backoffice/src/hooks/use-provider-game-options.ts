import { openGameListQueryOptions } from '@cbt-bo/api/game/queries';
import { gameProviderListQueryOptions } from '@cbt-bo/api/game-provider/queries';
import type { GameProviderResult, GameResult } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { useQuery } from '@tanstack/react-query';
import { sift } from 'radash';
import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export interface IUseProviderGameOptionsParams {
  providerName: string;
  gameName: string;
  /**
   * Fetches the provider list. Defaults to true.
   */
  isProviderEnabled?: boolean;
  /**
   * Fetches the game list. Defaults to true.
   */
  isGameEnabled?: boolean;
  /**
   * Shows no games until a provider is picked. Defaults to false.
   */
  isProviderScoped?: boolean;
  /**
   * Game already on the form, always kept in the game options.
   */
  currentGame?: GameResult;
}

export interface IProviderGameOptions {
  providerOptions: ISelectOption[];
  gameOptions: ISelectOption[];
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

const buildListedGames = (openGames: GameResult[], currentGame?: GameResult): GameResult[] => {
  if (!currentGame) return openGames;

  const isListed = openGames.some(({ id }) => id === currentGame.id);

  return isListed ? openGames : [currentGame, ...openGames];
};

const buildProviderGames = (
  games: GameResult[],
  providerCode: string,
  isProviderScoped: boolean
): GameResult[] => {
  if (providerCode) return games.filter(game => game.providerCode === providerCode);

  return isProviderScoped ? [] : games;
};

const buildGameOptions = (games: GameResult[]): ISelectOption[] =>
  games.flatMap(game =>
    game.id ? [{ value: game.id, label: buildGameOptionLabel(game, game.id) }] : []
  );

/**
 * Provider and game options for the fields bound to `providerName` and
 * `gameName` on the surrounding form. The game options narrow to the picked
 * provider, and a game from another provider is cleared when the provider
 * changes. With `isProviderScoped`, clearing the provider also clears the game.
 *
 * @example
 * const { providerOptions, gameOptions } = useProviderGameOptions({
 *   providerName: 'providerCode',
 *   gameName: 'gameId'
 * });
 */
export const useProviderGameOptions = ({
  providerName,
  gameName,
  isProviderEnabled = true,
  isGameEnabled = true,
  isProviderScoped = false,
  currentGame
}: IUseProviderGameOptionsParams): IProviderGameOptions => {
  const { control, getValues, setValue } = useFormContext<Record<string, string>>();
  const providerCode = useWatch({ control, name: providerName });
  const { data: providers = [] } = useQuery({
    ...gameProviderListQueryOptions(),
    enabled: isProviderEnabled
  });
  const { data: openGames = EMPTY_GAMES } = useQuery({
    ...openGameListQueryOptions(),
    enabled: isGameEnabled
  });
  const games = useMemo(() => buildListedGames(openGames, currentGame), [openGames, currentGame]);

  const providerGames = buildProviderGames(games, providerCode, isProviderScoped);
  const providerOptions = buildProviderOptions(providers);
  const gameOptions = buildGameOptions(providerGames);

  useEffect(() => {
    const gameId = getValues(gameName);
    const game = games.find(({ id }) => id === gameId);
    const isProviderMismatch = Boolean(game && game.providerCode !== providerCode);
    const isOutsideProvider = Boolean(providerCode || isProviderScoped) && isProviderMismatch;

    if (isOutsideProvider) setValue(gameName, '', { shouldDirty: true });
  }, [providerCode, games, gameName, isProviderScoped, getValues, setValue]);

  return { providerOptions, gameOptions };
};
