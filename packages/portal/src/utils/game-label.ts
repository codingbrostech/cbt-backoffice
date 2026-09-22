import type { GameProviderResult, GameResult } from '@cbt-bo/api-schema/bo-fm/models';
import type {
  GameProviderResult as SoGameProviderResult,
  GameResult as SoGameResult
} from '@cbt-bo/api-schema/bo-so/models';
import { sift } from 'radash';

type TSharedGameKey = 'id' | 'code' | 'providerCode' | 'descriptions' | 'properties' | 'table';
type TProviderOptionKey = 'code' | 'name';

/**
 * The game fields the label helpers read, picked from both generated
 * schemas so a regen that drops or renames one fails to compile.
 */
export interface IGameLabelSource
  extends Pick<GameResult, TSharedGameKey>, Pick<SoGameResult, TSharedGameKey | 'assetNumber'> {}

/**
 * The provider fields behind a select option, picked from both generated
 * schemas so a regen that drops or renames one fails to compile.
 */
export interface IProviderOptionSource
  extends
    Pick<GameProviderResult, TProviderOptionKey>,
    Pick<SoGameProviderResult, TProviderOptionKey> {}

export interface ISelectOption {
  value: string;
  label: string;
}

const ST8_PROVIDER_CODE = 'st8';

export const isSt8Provider = (providerCode?: string): boolean =>
  providerCode?.toLowerCase() === ST8_PROVIDER_CODE;

/**
 * Joins a game's display name, an optional developer suffix, and extra
 * fields such as table or machine id into one " - " separated label.
 */
export const formatGameLabel = (
  baseName: string,
  developer: string | undefined,
  gameFields: (string | undefined)[]
): string => {
  const developerSuffix = developer ? ` (${developer})` : '';
  const labelParts = sift([`${baseName}${developerSuffix}`, ...gameFields]);

  return labelParts.join(' - ');
};

/**
 * Builds the select-option label for a game, appending the developer only
 * for ST8_PROVIDER_CODE games unless `isDeveloperShown` is false.
 */
export const formatGameOptionLabel = (
  game: IGameLabelSource,
  { isDeveloperShown = true }: { isDeveloperShown?: boolean } = {}
): string => {
  const baseName = game.descriptions?.en ?? game.code ?? game.id ?? '';
  const developer =
    isDeveloperShown && isSt8Provider(game.providerCode) ? game.properties?.developer : undefined;

  return formatGameLabel(baseName, developer, [game.table, game.assetNumber]);
};

export const toProviderOptions = (providers: IProviderOptionSource[]): ISelectOption[] => {
  const options = providers.map(provider => ({
    value: provider.code ?? '',
    label: provider.name ?? provider.code ?? ''
  }));

  return options.filter(option => Boolean(option.value));
};

export const withEnsuredOption = (
  options: ISelectOption[],
  value: string,
  label: string
): ISelectOption[] => {
  if (!value) return options;

  const isValuePresent = options.some(option => option.value === value);

  return isValuePresent ? options : [...options, { value, label }];
};

export const toGameOptions = (games: IGameLabelSource[]): ISelectOption[] => {
  const options = games.map(game => {
    const value = game.id ?? game.code ?? '';
    return { value, label: `${formatGameOptionLabel(game)} (${value})` };
  });

  return options.filter(option => Boolean(option.value));
};
