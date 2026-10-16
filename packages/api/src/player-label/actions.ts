import { mgtServicePlayerLabelList } from '@cbt-bo/api-schema/bo/playerlabel';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getPlayerLabels = createMgtAction(mgtServicePlayerLabelList);
