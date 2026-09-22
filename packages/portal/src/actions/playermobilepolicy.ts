import {
  mgtServicePlayerMobilePolicyDelete,
  mgtServicePlayerMobilePolicyGet,
  mgtServicePlayerMobilePolicyList,
  mgtServicePlayerMobilePolicyUpsert
} from '@cbt-bo/api-schema/bo-fm/playermobilepolicy';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const getPlayerMobilePolicy = createMgtAction(mgtServicePlayerMobilePolicyGet);

export const listPlayerMobilePolicies = createMgtAction(mgtServicePlayerMobilePolicyList);

export const upsertPlayerMobilePolicy = createMgtAction(mgtServicePlayerMobilePolicyUpsert);

export const deletePlayerMobilePolicy = createMgtAction(mgtServicePlayerMobilePolicyDelete);

export const exportPlayerMobilePolicies = createMgtBlobAction('/mgt/v1/player/mobilepolicy/export');
