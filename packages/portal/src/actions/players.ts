import {
  mgtServicePlayerPointAdjust,
  mgtServicePlayerAccountNoteCreate,
  mgtServicePlayerAccountNoteList,
  mgtServicePlayerBetInfoGet,
  mgtServicePlayerChangeMobile,
  mgtServicePlayerDeposit,
  mgtServicePlayerFinancialInfoGet,
  mgtServicePlayerGet,
  mgtServicePlayerIncomeSourceList,
  mgtServicePlayerInfoUpsert,
  mgtServicePlayerList,
  mgtServicePlayerMessageSend,
  mgtServicePlayerOtpCodeGet,
  mgtServicePlayerRescueOtpGen,
  mgtServicePlayerUpdate,
  mgtServicePlayerWalletAdjustment,
  mgtServicePlayerWithdraw,
  mgtServicePlayerWorkNatureList
} from '@cbt-bo/api-schema/bo-fm/player';
import {
  mgtServicePlayerKycStatusUpdate,
  mgtServicePlayerKycSync
} from '@cbt-bo/api-schema/bo-fm/player-kyc';
import {
  mgtServicePlayerSessionList,
  mgtServicePlayerSessionRevoke
} from '@cbt-bo/api-schema/bo-fm/playersession';
import { mgtServicePlayerVipLevelSet } from '@cbt-bo/api-schema/bo-fm/viplevel';
import { mgtServiceAcscPlayerOverview } from '@cbt-bo/api-schema/bo-so/acsc';

import { createMgtAction } from '~/services/mgt';

export const getPlayers = createMgtAction(mgtServicePlayerList);

export const getPlayerSessions = createMgtAction(mgtServicePlayerSessionList);

export const revokePlayerSession = createMgtAction(mgtServicePlayerSessionRevoke);

export const updatePlayer = createMgtAction(mgtServicePlayerUpdate);

export const getPlayer = createMgtAction(mgtServicePlayerGet);

export const updatePlayerInfo = createMgtAction(mgtServicePlayerInfoUpsert);

export const getPlayerBetInfo = createMgtAction(mgtServicePlayerBetInfoGet);

export const getPlayerFinancialInfo = createMgtAction(mgtServicePlayerFinancialInfoGet);

export const playerWalletAdjustment = createMgtAction(mgtServicePlayerWalletAdjustment);

export const playerPointAdjustment = createMgtAction(mgtServicePlayerPointAdjust);

export const playerDeposit = createMgtAction(mgtServicePlayerDeposit);

export const playerWithdraw = createMgtAction(mgtServicePlayerWithdraw);

export const playerOtpCodeGet = createMgtAction(mgtServicePlayerOtpCodeGet);

export const playerGenerateOtpCode = createMgtAction(mgtServicePlayerRescueOtpGen);

export const playerChangeMobile = createMgtAction(mgtServicePlayerChangeMobile);

export const playerMessageSend = createMgtAction(mgtServicePlayerMessageSend);

export const getPlayerIncomeSources = createMgtAction(mgtServicePlayerIncomeSourceList);

export const getPlayerWorkNatures = createMgtAction(mgtServicePlayerWorkNatureList);

export const updatePlayerKycStatus = createMgtAction(mgtServicePlayerKycStatusUpdate);

export const syncPlayerKyc = createMgtAction(mgtServicePlayerKycSync);

export const getPlayerAccountNotes = createMgtAction(mgtServicePlayerAccountNoteList);

export const createPlayerAccountNote = createMgtAction(mgtServicePlayerAccountNoteCreate);

export const playerVipLevelSet = createMgtAction(mgtServicePlayerVipLevelSet);

export const getPlayerAcscOverview = createMgtAction(mgtServiceAcscPlayerOverview);
