import type { GameResult } from '@cbt-bo/api-schema/bo/models';
import SelectField from '@cbt-bo/component-lib/components/forms/SelectField';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useProviderGameOptions } from '#/hooks/use-provider-game-options';

export interface IProviderGameFieldsProps {
  providerName: string;
  gameName: string;
  currentGame?: GameResult;
}

/**
 * Searchable provider and game selects for a page form, bound to
 * `providerName` and `gameName` on the surrounding form. The game select lists
 * only the games of the picked provider, and asks for a provider until one is
 * picked. Each field shows a clear button while it holds a value.
 *
 * @example
 * <FieldGroup>
 *   <ProviderGameFields providerName="providerCode" gameName="gameId" />
 * </FieldGroup>
 */
const ProviderGameFields = ({ providerName, gameName, currentGame }: IProviderGameFieldsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext<Record<string, string>>();
  const providerCode = useWatch({ control, name: providerName });
  const { providerOptions, gameOptions } = useProviderGameOptions({
    providerName,
    gameName,
    isProviderScoped: true,
    currentGame
  });

  const gameNoResultsLabel = providerCode
    ? t('common.noResultFound')
    : t('game.selectProviderFirst');

  return (
    <>
      <SelectField
        control={control}
        name={providerName}
        label={t('game.provider')}
        options={providerOptions}
        clearLabel={t('common.clear')}
        noResultsLabel={t('common.noResultFound')}
      />
      <SelectField
        control={control}
        name={gameName}
        label={t('game.game')}
        options={gameOptions}
        clearLabel={t('common.clear')}
        noResultsLabel={gameNoResultsLabel}
      />
    </>
  );
};

export default ProviderGameFields;
