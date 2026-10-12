import {
  mgtServiceAuthLogin,
  mgtServiceAuthLogout,
  mgtServiceAuthValidate
} from '@cbt-bo/api-schema/bo/auth';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const login = createMgtAction(mgtServiceAuthLogin);

export const validateToken = createMgtAction(mgtServiceAuthValidate);

export const logout = createMgtAction(mgtServiceAuthLogout);
