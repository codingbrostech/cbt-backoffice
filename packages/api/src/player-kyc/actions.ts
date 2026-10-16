import { mgtServicePlayerKycStatusUpdate } from '@cbt-bo/api-schema/bo/player-kyc';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const updatePlayerKycStatus = createMgtAction(mgtServicePlayerKycStatusUpdate);
