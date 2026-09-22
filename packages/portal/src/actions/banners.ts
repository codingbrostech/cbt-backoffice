import {
  mgtServiceBannerDelete,
  mgtServiceBannerList,
  mgtServiceBannerUpsert
} from '@cbt-bo/api-schema/bo-fm/banner';

import { createMgtAction } from '~/services/mgt';

export const getBanners = createMgtAction(mgtServiceBannerList);
export const createOrUpdateBanner = createMgtAction(mgtServiceBannerUpsert);

export const deleteBanner = createMgtAction(mgtServiceBannerDelete);
