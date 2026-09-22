import { createPreviewConfig } from '@cbt-bo/config/storybook/browser';

import { configurePortal } from '../src/config';
import { initI18n } from '../src/i18n/config';
import '../src/styles.css';

configurePortal({ brand: 'FM' });
initI18n('en');

export default createPreviewConfig({});
