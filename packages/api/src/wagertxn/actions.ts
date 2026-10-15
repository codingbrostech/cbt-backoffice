import { mgtServiceTxnWagerList, mgtServiceTxnWagerSummary } from '@cbt-bo/api-schema/bo/wagertxn';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getWagerTxns = createMgtAction(mgtServiceTxnWagerList);

export const getWagerTxnSummary = createMgtAction(mgtServiceTxnWagerSummary);
