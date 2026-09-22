import { mgtServicePlayerTxnPaymentList } from '@cbt-bo/api-schema/bo-fm/player';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const listPlayerTxnPayment = createMgtAction(mgtServicePlayerTxnPaymentList);

export const exportPlayerTxnPayment = createMgtBlobAction('/mgt/v1/player/paymenttxn/export');
