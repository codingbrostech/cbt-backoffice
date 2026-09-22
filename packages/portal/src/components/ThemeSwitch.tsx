import { useSelector } from '@tanstack/react-store';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { settingStore } from '~/store/setting-store';

const ThemeSwitch = () => {
  const colorScheme = useSelector(settingStore, state => state.colorScheme);

  const isDark = colorScheme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle color scheme"
      onClick={() => {
        settingStore.actions.setColorScheme(isDark ? 'light' : 'dark');
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeSwitch;
