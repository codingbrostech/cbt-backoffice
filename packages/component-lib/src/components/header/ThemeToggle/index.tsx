import { MoonIcon, SunIcon } from 'lucide-react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export type TTheme = 'light' | 'dark';

export interface IThemeToggleProps {
  theme: TTheme;
  className?: string;
  lightLabel?: string;
  darkLabel?: string;
  onThemeChange: (theme: TTheme) => void;
}

const ThemeToggle = ({
  theme,
  className,
  lightLabel = 'Switch to light mode',
  darkLabel = 'Switch to dark mode',
  onThemeChange
}: IThemeToggleProps) => {
  const isDark = theme === 'dark';

  const handleClick = () => {
    onThemeChange(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      className={cn(
        'flex size-8 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground outline-hidden hover:bg-sidebar-accent',
        className
      )}
      aria-label={isDark ? lightLabel : darkLabel}
      aria-pressed={isDark}
      onClick={handleClick}
    >
      {isDark ? (
        <SunIcon className="size-4" aria-hidden />
      ) : (
        <MoonIcon className="size-4" aria-hidden />
      )}
    </button>
  );
};

export default ThemeToggle;
