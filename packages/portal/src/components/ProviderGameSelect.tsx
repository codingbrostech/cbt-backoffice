import EditableSelect from '~/components/EditableSelect';
import type { ISelectOption } from '~/table/types';

export interface IProviderGameSelectProps {
  idPrefix: string;
  isEditing: boolean;
  providerLabel?: string;
  gameLabel?: string;
  providerOptions: ISelectOption[];
  gameOptions: ISelectOption[];
  providerCode: string;
  gameId: string;
  providerReadOnlyValue?: string;
  gameReadOnlyValue?: string;
  isDisabled?: boolean;
  isProviderInvalid?: boolean;
  isGameInvalid?: boolean;
  isProviderChanged?: boolean;
  isGameChanged?: boolean;
  onProviderChange: (providerCode: string) => void;
  onGameChange: (gameId: string) => void;
}

/**
 * Paired provider and game selects. The game options are those of the
 * selected provider.
 */
const ProviderGameSelect = ({
  idPrefix,
  isEditing,
  providerLabel,
  gameLabel,
  providerOptions,
  gameOptions,
  providerCode,
  gameId,
  providerReadOnlyValue,
  gameReadOnlyValue,
  isDisabled,
  isProviderInvalid,
  isGameInvalid,
  isProviderChanged,
  isGameChanged,
  onProviderChange,
  onGameChange
}: IProviderGameSelectProps) => (
  <>
    <EditableSelect
      id={`${idPrefix}-provider`}
      label={providerLabel}
      options={providerOptions}
      value={providerCode}
      readOnlyValue={providerReadOnlyValue}
      isEditing={isEditing}
      isDisabled={isDisabled}
      isInvalid={isProviderInvalid}
      isChanged={isProviderChanged}
      className="w-40"
      onChange={onProviderChange}
    />
    <EditableSelect
      id={`${idPrefix}-game`}
      label={gameLabel}
      options={gameOptions}
      value={gameId}
      readOnlyValue={gameReadOnlyValue}
      isEditing={isEditing}
      isDisabled={isDisabled}
      isInvalid={isGameInvalid}
      isChanged={isGameChanged}
      className="min-w-48 flex-1"
      onChange={onGameChange}
    />
  </>
);

export default ProviderGameSelect;
