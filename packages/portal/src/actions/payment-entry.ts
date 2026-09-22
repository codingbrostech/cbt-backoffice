import {
  mgtServicePaymentEntryList,
  mgtServicePaymentEntryUpsert
} from '@cbt-bo/api-schema/bo-fm/payment';

import { createMgtAction } from '~/services/mgt';

export const getPaymentEntries = createMgtAction(mgtServicePaymentEntryList);
export const upsertPaymentEntry = createMgtAction(mgtServicePaymentEntryUpsert);
