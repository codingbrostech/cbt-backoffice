import type { GameProviderResult, GameResult } from '@cbt-bo/api-schema/bo-fm/models';
import { queryOptions } from '@tanstack/react-query';
import { group, sift } from 'radash';

import { getGameTypes, getGames } from '~/actions/game';
import { getGameProviders } from '~/actions/gameprovider';
import type { ISelectOption } from '~/table/types';

export const GAMES_QUERY_KEY = 'games';
export const GAME_TYPES_QUERY_KEY = 'game-types';
export const GAME_PROVIDERS_QUERY_KEY = 'game-providers';

export const gameTypesQueryOptions = () =>
  queryOptions({
    queryKey: [GAME_TYPES_QUERY_KEY],
    queryFn: async (): Promise<string[]> => {
      const { data = [] } = await getGameTypes({});

      return data;
    }
  });

/**
 * Every game provider as a select option keyed and labelled by `code`.
 */
export const gameProviderCodeOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [GAME_PROVIDERS_QUERY_KEY, 'code-options'],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data: providers = [] } = await getGameProviders({});

      return providers.flatMap(({ code }) => (code ? [{ value: code, label: code }] : []));
    }
  });

/**
 * Every game provider as a select option keyed by `id` and labelled by
 * `name`.
 */
export const gameProviderOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [GAME_PROVIDERS_QUERY_KEY, 'options'],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data: providers = [] } = await getGameProviders({});

      return providers.flatMap(({ id, name }) => (id ? [{ value: id, label: name ?? id }] : []));
    }
  });

export const PROVIDER_GAMES_QUERY_KEY = 'provider-games';

export type TProviderGame = GameResult & { assetNumber?: string };

export interface IProviderGames {
  providers: GameProviderResult[];
  gamesByProviderCode: Record<string, TProviderGame[]>;
}

const ALL_ROWS_PAGE_SIZE = -1;

const isSelectableGame = (game: GameResult): boolean =>
  game.isOpen === true && game.state === 'active';

/**
 * The game providers and the open, active games grouped by provider code,
 * the data set behind the provider and game selectors.
 */
export const providerGamesQueryOptions = () =>
  queryOptions({
    queryKey: [PROVIDER_GAMES_QUERY_KEY],
    queryFn: async (): Promise<IProviderGames> => {
      const [{ data: providers = [] }, { data: games = [] }] = await Promise.all([
        getGameProviders({}),
        getGames({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE })
      ]);
      const selectableGames = games.filter(isSelectableGame);
      const groupedGames = group(selectableGames, game => game.providerCode ?? '');
      const gamesByProviderCode: Record<string, TProviderGame[]> = {};

      for (const [providerCode, providerGames] of Object.entries(groupedGames)) {
        if (providerCode) gamesByProviderCode[providerCode] = sift(providerGames ?? []);
      }

      return { providers, gamesByProviderCode };
    }
  });
