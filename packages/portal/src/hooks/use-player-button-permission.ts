import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';
import { useSelector } from '@tanstack/react-store';

import { isBrandSo } from '~/config';
import { PAGE_KEY } from '~/constants/page-key';
import { appStore } from '~/store/app-store';

export interface IPlayerButtonPermission {
  isWalletAdjustmentAllowed: boolean;
  isPointAdjustmentAllowed: boolean;
  isSendOtpAllowed: boolean;
  isChangeMobileAllowed: boolean;
  isSendPmMessageAllowed: boolean;
  isAssignPromotionAllowed: boolean;
  isUpdatePlayerLabelAllowed: boolean;
  isVipLevelAdjustmentAllowed: boolean;
  isExportAllowed: boolean;
  isMobileNoDetailVisible: boolean;
  isSensitiveDataVisible: boolean;
}

const isActionAllowed = (permissions: AdminRolePermEntry[], key: string): boolean =>
  permissions.some(
    permission =>
      permission.type === 'action' && permission.pageKey === key && permission.canCreate === true
  );

/**
 * Action permissions of the current role. Export and mobile detail are open
 * on FM and permission gated on SO.
 */
export const buildPlayerButtonPermission = (
  permissions: AdminRolePermEntry[]
): IPlayerButtonPermission => ({
  isWalletAdjustmentAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_WALLET_ADJUSTMENT),
  isPointAdjustmentAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_POINT_ADJUSTMENT),
  isSendOtpAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_OTP),
  isChangeMobileAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_CHANGE_MOBILE),
  isSendPmMessageAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_SEND_PM_MESSAGE),
  isAssignPromotionAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_ASSIGN_PROMOTION),
  isUpdatePlayerLabelAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_UPDATE_LABEL),
  isVipLevelAdjustmentAllowed: isActionAllowed(permissions, PAGE_KEY.PLAYER_VIPLEVEL_ADJUSTMENT),
  isExportAllowed: !isBrandSo() || isActionAllowed(permissions, PAGE_KEY.EXPORT_FUNCTION),
  isMobileNoDetailVisible: !isBrandSo() || isActionAllowed(permissions, PAGE_KEY.MOBILE_NO_DETAIL),
  isSensitiveDataVisible: isActionAllowed(permissions, PAGE_KEY.SENSITIVE_DATA)
});

export const usePlayerButtonPermission = (): IPlayerButtonPermission => {
  const permissions = useSelector(appStore, state => state.currentRolePermissions);

  return buildPlayerButtonPermission(permissions);
};
