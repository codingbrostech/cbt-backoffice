import dayjs from 'dayjs';
import { useSyncExternalStore } from 'react';

const CLOCK_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TICK_MS = 1000;

let currentTime = '';

const subscribe = (onChange: () => void): (() => void) => {
  const tick = () => {
    currentTime = dayjs().format(CLOCK_FORMAT);
    onChange();
  };
  const timer = setInterval(tick, TICK_MS);
  tick();

  return () => {
    clearInterval(timer);
  };
};

const getSnapshot = (): string => currentTime;

const getServerSnapshot = (): string => '';

const AppInfo = () => {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="px-4 text-right text-xs text-muted-foreground tabular-nums" aria-live="off">
      {now}
    </div>
  );
};

export default AppInfo;
