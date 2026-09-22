import { mgtServiceTxnLedgerList } from '@cbt-bo/api-schema/bo-fm/ledgertxn';
import {
  mgtServicePaymentEntryList,
  mgtServicePaymentProviderList
} from '@cbt-bo/api-schema/bo-fm/payment';
import {
  mgtServiceTxnPaymentApproveWithdraw,
  mgtServiceTxnPaymentList,
  mgtServiceTxnPaymentRejectWithdraw
} from '@cbt-bo/api-schema/bo-fm/paymenttxn';
import { mgtServiceTxnWagerList } from '@cbt-bo/api-schema/bo-fm/wagertxn';
import {
  mgtServiceAcscRewardPushLogList,
  mgtServiceAcscTransferList
} from '@cbt-bo/api-schema/bo-so/acsc';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const getPlayerBetTxns = createMgtAction(mgtServiceTxnWagerList);

export const getLedgerTxns = createMgtAction(mgtServiceTxnLedgerList);

export const getPaymentTxns = createMgtAction(mgtServiceTxnPaymentList);

export const approvePaymentTxn = createMgtAction(mgtServiceTxnPaymentApproveWithdraw);

export const rejectPaymentTxn = createMgtAction(mgtServiceTxnPaymentRejectWithdraw);

export const getPaymentEntryList = createMgtAction(mgtServicePaymentEntryList);

export const getPaymentProviderList = createMgtAction(mgtServicePaymentProviderList);

export const getAcscRewardPushLogs = createMgtAction(mgtServiceAcscRewardPushLogList);

export const getAcscTransfers = createMgtAction(mgtServiceAcscTransferList);

export const exportLedgerTxns = createMgtBlobAction('/mgt/v1/ledgertxn/export');

export const exportPaymentTxns = createMgtBlobAction('/mgt/v1/paymenttxn/export');

export const exportPlayerBetTxns = createMgtBlobAction('/mgt/v1/wagertxn/export');
