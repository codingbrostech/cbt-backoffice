import { SENSITIVE_DATA_MASK } from '~/constants/common';
import { usePlayerButtonPermission } from '~/hooks/use-player-button-permission';

export interface IMaskedValueProps {
  value: React.ReactNode;
}

const MaskedValue = ({ value }: IMaskedValueProps) => {
  const { isSensitiveDataVisible } = usePlayerButtonPermission();

  return <>{isSensitiveDataVisible ? value : SENSITIVE_DATA_MASK}</>;
};

export default MaskedValue;
