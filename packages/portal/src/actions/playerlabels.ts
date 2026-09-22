import {
  mgtServicePlayerLabelAssign,
  mgtServicePlayerLabelRemove,
  mgtServicePlayerLabelsByPlayer
} from '@cbt-bo/api-schema/bo-fm/player';
import {
  mgtServicePlayerLabelDelete,
  mgtServicePlayerLabelGet,
  mgtServicePlayerLabelList,
  mgtServicePlayerLabelRestrictionDelete,
  mgtServicePlayerLabelRestrictionList,
  mgtServicePlayerLabelRestrictionUpsert,
  mgtServicePlayerLabelUpsert,
  mgtServicePlayersByLabel
} from '@cbt-bo/api-schema/bo-fm/playerlabel';

import { createMgtAction } from '~/services/mgt';

export const getPlayerLabel = createMgtAction(mgtServicePlayerLabelGet);

export const getPlayerLabels = createMgtAction(mgtServicePlayerLabelList);

export const getPlayersByLabel = createMgtAction(mgtServicePlayersByLabel);

export const getPlayerLabelsByPlayer = createMgtAction(mgtServicePlayerLabelsByPlayer);

export const assignPlayerLabel = createMgtAction(mgtServicePlayerLabelAssign);

export const removePlayerLabel = createMgtAction(mgtServicePlayerLabelRemove);

export const createOrUpdatePlayerLabel = createMgtAction(mgtServicePlayerLabelUpsert);

export const deletePlayerLabel = createMgtAction(mgtServicePlayerLabelDelete);

export const listPlayerLabelRestrictions = createMgtAction(mgtServicePlayerLabelRestrictionList);

export const upsertPlayerLabelRestriction = createMgtAction(mgtServicePlayerLabelRestrictionUpsert);

export const deletePlayerLabelRestriction = createMgtAction(mgtServicePlayerLabelRestrictionDelete);
