import {
  mgtServicePageDivDelete,
  mgtServicePageDivList,
  mgtServicePageDivUpsert
} from '@cbt-bo/api-schema/bo-fm/page';

import { createMgtAction } from '~/services/mgt';

export const getPageDivs = createMgtAction(mgtServicePageDivList);
export const createOrUpdatePageDiv = createMgtAction(mgtServicePageDivUpsert);

export const deletePageDiv = createMgtAction(mgtServicePageDivDelete);
