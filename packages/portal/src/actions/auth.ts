import {
  mgtServiceAuthChangePwd,
  mgtServiceAuthLogin,
  mgtServiceAuthValidate
} from '@cbt-bo/api-schema/bo-fm/auth';

import { createMgtAction } from '~/services/mgt';

export const login = createMgtAction(mgtServiceAuthLogin);

export const validateToken = createMgtAction(mgtServiceAuthValidate);

export const changePassword = createMgtAction(mgtServiceAuthChangePwd);
