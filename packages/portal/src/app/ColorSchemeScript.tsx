const SETTING_STORAGE_KEY = 'tgpx-adm-setting-storage';

const COLOR_SCHEME_SCRIPT = `(function(){try{var r=JSON.parse(localStorage.getItem('${SETTING_STORAGE_KEY}')||'null');if(r&&r.state&&r.state.colorScheme==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

/**
 * Applies the persisted color scheme before the first paint. Render inside
 * the document head.
 */
const ColorSchemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: COLOR_SCHEME_SCRIPT }} />
);

export default ColorSchemeScript;
