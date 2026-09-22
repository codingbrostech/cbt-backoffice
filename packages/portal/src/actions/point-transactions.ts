import {
  mgtServiceTxnPointApprove,
  mgtServiceTxnPointList,
  mgtServiceTxnPointReject
} from '@cbt-bo/api-schema/bo-fm/pointtxn';

import { createMgtAction } from '~/services/mgt';

export const getPointTxns = createMgtAction(mgtServiceTxnPointList);

export const approvePointTxn = createMgtAction(mgtServiceTxnPointApprove);

export const rejectPointTxn = createMgtAction(mgtServiceTxnPointReject);
