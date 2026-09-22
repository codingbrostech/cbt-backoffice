import {
  mgtServicePageDelete,
  mgtServicePageList,
  mgtServicePageUpsert
} from '@cbt-bo/api-schema/bo-fm/page';

import { createMgtAction } from '~/services/mgt';

export const getPages = createMgtAction(mgtServicePageList);
export const createOrUpdatePage = createMgtAction(mgtServicePageUpsert);

export const deletePage = createMgtAction(mgtServicePageDelete);
