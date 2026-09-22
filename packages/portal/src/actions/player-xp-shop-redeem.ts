import { mgtServicePlayerXpShopRedeemList } from '@cbt-bo/api-schema/bo-fm/player';

import { createMgtAction } from '~/services/mgt';

export const listPlayerXpShopRedeem = createMgtAction(mgtServicePlayerXpShopRedeemList);
