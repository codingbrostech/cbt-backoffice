import { buildOffsetDateLabel } from '@cbt-bo/component-lib/components/header/TimezoneClock/utils';

export interface IHeaderClockProps {
  date: Date;
  timezoneMinutes: number;
  version?: string;
}

const HeaderClock = ({ date, timezoneMinutes, version }: IHeaderClockProps) => (
  <div className="flex flex-none flex-col items-end justify-center leading-tight">
    <span className="text-sm tracking-tight">{buildOffsetDateLabel(date, timezoneMinutes)}</span>
    {version && (
      <span className="text-xs tracking-tighter text-sidebar-foreground/70">{version}</span>
    )}
  </div>
);

export default HeaderClock;
