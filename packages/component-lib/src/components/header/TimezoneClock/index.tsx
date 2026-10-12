import HeaderClock from '@cbt-bo/component-lib/components/header/TimezoneClock/HeaderClock';
import TimezoneSelect from '@cbt-bo/component-lib/components/header/TimezoneClock/TimezoneSelect';
import type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock/types';
import { useNow } from '@cbt-bo/component-lib/components/header/TimezoneClock/use-now';

export type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock/types';

interface ITimezoneClockBaseProps {
  /**
   * UTC offset in minutes applied to the displayed time.
   */
  timezoneMinutes: number;
  /**
   * Shown under the time when present.
   */
  version?: string;
}

interface ITimezoneSelectableClockProps extends ITimezoneClockBaseProps {
  isTimezoneSelectable?: true;
  options: ITimezoneOption[];
  onTimezoneChange: (timezoneMinutes: number) => void;
}

interface ITimezoneFixedClockProps extends ITimezoneClockBaseProps {
  isTimezoneSelectable: false;
}

export type TTimezoneClockProps = ITimezoneSelectableClockProps | ITimezoneFixedClockProps;

/**
 * A live clock beside an optional timezone picker. The offset and its changes
 * belong to the caller.
 */
const TimezoneClock = (props: TTimezoneClockProps) => {
  const { timezoneMinutes, version } = props;
  const now = useNow();

  return (
    <>
      <HeaderClock date={now} timezoneMinutes={timezoneMinutes} version={version} />
      {props.isTimezoneSelectable !== false && (
        <TimezoneSelect
          value={timezoneMinutes}
          options={props.options}
          onChange={props.onTimezoneChange}
        />
      )}
    </>
  );
};

export default TimezoneClock;
