import {
  buildCalendarDate,
  buildCustomRange,
  buildSearchRange,
  buildShiftedCalendarDate,
  clampDateTimeRange,
  buildGmtLabel,
  buildLocalDateTime,
  buildQuickRange,
  buildTimePart,
  buildTypedDateTime
} from './date-range';

const TUESDAY_LATE_UTC = new Date('2026-10-13T20:00:00Z');

describe('buildQuickRange', () => {
  describe('when the offset moves now into the next day', () => {
    it('should cover that whole day for today', () => {
      expect(buildQuickRange('today', TUESDAY_LATE_UTC, 480)).toEqual({
        from: '2026-10-14T00:00',
        to: '2026-10-14T23:59'
      });
    });

    it('should cover the day before for yesterday', () => {
      expect(buildQuickRange('yesterday', TUESDAY_LATE_UTC, 480)).toEqual({
        from: '2026-10-13T00:00',
        to: '2026-10-13T23:59'
      });
    });
  });

  describe('when the range is a week', () => {
    it('should start this week on Monday and end it today', () => {
      expect(buildQuickRange('thisWeek', TUESDAY_LATE_UTC, 0)).toEqual({
        from: '2026-10-12T00:00',
        to: '2026-10-13T23:59'
      });
    });

    it('should end last week on Sunday', () => {
      expect(buildQuickRange('lastWeek', TUESDAY_LATE_UTC, 0)).toEqual({
        from: '2026-10-05T00:00',
        to: '2026-10-11T23:59'
      });
    });

    it('should treat Sunday as the last day of its week', () => {
      expect(buildQuickRange('thisWeek', new Date('2026-10-18T12:00:00Z'), 0)).toEqual({
        from: '2026-10-12T00:00',
        to: '2026-10-18T23:59'
      });
    });
  });

  describe('when the range is a month', () => {
    it('should cover this month up to today', () => {
      expect(buildQuickRange('thisMonth', TUESDAY_LATE_UTC, 0)).toEqual({
        from: '2026-10-01T00:00',
        to: '2026-10-13T23:59'
      });
    });

    it('should cross the year for last month in January', () => {
      expect(buildQuickRange('lastMonth', new Date('2026-01-15T00:00:00Z'), 0)).toEqual({
        from: '2025-12-01T00:00',
        to: '2025-12-31T23:59'
      });
    });
  });
});

describe('buildCustomRange', () => {
  describe('when the offset moves now into the next day', () => {
    it('should end on that day and start a month earlier plus one day', () => {
      expect(buildCustomRange(TUESDAY_LATE_UTC, 480, 1)).toEqual({
        from: '2026-09-15T00:00',
        to: '2026-10-14T23:59'
      });
    });
  });

  describe('when the start month is shorter than today', () => {
    it('should start the day after that month ends', () => {
      expect(buildCustomRange(new Date('2026-03-31T12:00:00Z'), 0, 1)).toEqual({
        from: '2026-03-01T00:00',
        to: '2026-03-31T23:59'
      });
    });
  });

  describe('when the window spans several months across a year', () => {
    it('should start in the previous year', () => {
      expect(buildCustomRange(new Date('2026-01-15T12:00:00Z'), 0, 3)).toEqual({
        from: '2025-10-16T00:00',
        to: '2026-01-15T23:59'
      });
    });
  });
});

describe('clampDateTimeRange', () => {
  const LATEST = '2026-10-14T23:59';

  describe('when the range fits within the span', () => {
    it('should keep it', () => {
      const range = { from: '2026-10-01T08:00', to: '2026-10-10T18:00' };

      expect(clampDateTimeRange(range, 1, LATEST)).toEqual(range);
    });
  });

  describe('when the end is more than the span after the start', () => {
    it('should pull the end back to the last day of the span', () => {
      expect(
        clampDateTimeRange({ from: '2026-08-01T00:00', to: '2026-10-14T23:59' }, 1, LATEST)
      ).toEqual({ from: '2026-08-01T00:00', to: '2026-09-01T23:59' });
    });
  });

  describe('when the span would run past the latest time', () => {
    it('should end the range at the latest time', () => {
      expect(
        clampDateTimeRange({ from: '2026-10-01T00:00', to: '2026-10-20T23:59' }, 1, LATEST)
      ).toEqual({ from: '2026-10-01T00:00', to: LATEST });
    });
  });

  describe('when the end comes before the start', () => {
    it('should move the end to the last allowed time', () => {
      expect(
        clampDateTimeRange({ from: '2026-10-10T00:00', to: '2026-10-05T23:59' }, 1, LATEST)
      ).toEqual({ from: '2026-10-10T00:00', to: LATEST });
    });
  });

  describe('when only the end is filled', () => {
    it('should start the range one span before the end', () => {
      expect(clampDateTimeRange({ from: '', to: '2026-10-10T23:59' }, 1, LATEST)).toEqual({
        from: '2026-09-10T00:00',
        to: '2026-10-10T23:59'
      });
    });
  });

  describe('when only the start is filled', () => {
    it('should end the range at the end of the span', () => {
      expect(clampDateTimeRange({ from: '2026-09-01T00:00', to: '' }, 1, LATEST)).toEqual({
        from: '2026-09-01T00:00',
        to: '2026-10-01T23:59'
      });
    });
  });
});

describe('buildSearchRange', () => {
  const NOW = new Date('2026-10-14T04:00:00Z');

  describe('when both bounds are blank', () => {
    it('should give the custom starting window', () => {
      expect(buildSearchRange({ from: '', to: '' }, NOW, 480, 1)).toEqual({
        from: '2026-09-15T00:00',
        to: '2026-10-14T23:59'
      });
    });
  });

  describe('when only the start is filled', () => {
    it('should end the range today at the latest', () => {
      expect(buildSearchRange({ from: '2026-10-01T00:00', to: '' }, NOW, 480, 1)).toEqual({
        from: '2026-10-01T00:00',
        to: '2026-10-14T23:59'
      });
    });
  });
});

describe('buildShiftedCalendarDate', () => {
  describe('when shifting forward within the year', () => {
    it('should keep the day of the month', () => {
      expect(buildShiftedCalendarDate(new Date(2026, 8, 15), 1)).toEqual(new Date(2026, 9, 15));
    });
  });

  describe('when the target month is shorter', () => {
    it('should fall back to its last day', () => {
      expect(buildShiftedCalendarDate(new Date(2026, 2, 31), -1)).toEqual(new Date(2026, 1, 28));
    });
  });

  describe('when shifting back across a year', () => {
    it('should land in the previous year', () => {
      expect(buildShiftedCalendarDate(new Date(2026, 0, 10), -1)).toEqual(new Date(2025, 11, 10));
    });
  });
});

describe('buildCalendarDate', () => {
  describe('when the value is filled', () => {
    it('should give the local midnight of its date', () => {
      expect(buildCalendarDate('2026-10-13T08:30')).toEqual(new Date(2026, 9, 13));
    });
  });

  describe('when the value is blank', () => {
    it('should give undefined', () => {
      expect(buildCalendarDate('')).toBeUndefined();
    });
  });
});

describe('buildTimePart', () => {
  describe('when the value is filled', () => {
    it('should give its time', () => {
      expect(buildTimePart('2026-10-13T08:30', '00:00')).toBe('08:30');
    });
  });

  describe('when the value is blank', () => {
    it('should give the fallback', () => {
      expect(buildTimePart('', '23:59')).toBe('23:59');
    });
  });
});

describe('buildLocalDateTime', () => {
  describe('when the date is given', () => {
    it('should join the date and the time', () => {
      expect(buildLocalDateTime(new Date(2026, 9, 3), '23:59')).toBe('2026-10-03T23:59');
    });
  });

  describe('when the date is missing', () => {
    it('should give a blank value', () => {
      expect(buildLocalDateTime(undefined, '23:59')).toBe('');
    });
  });
});

describe('buildTypedDateTime', () => {
  describe('when the text is a date and a time', () => {
    it('should give the local date-time', () => {
      expect(buildTypedDateTime(' 2026-10-13 08:30 ')).toBe('2026-10-13T08:30');
    });
  });

  describe('when the day does not exist', () => {
    it('should give undefined', () => {
      expect(buildTypedDateTime('2026-02-30 08:30')).toBeUndefined();
    });
  });

  describe('when the time does not exist', () => {
    it('should give undefined', () => {
      expect(buildTypedDateTime('2026-10-13 24:00')).toBeUndefined();
    });
  });

  describe('when the text is incomplete', () => {
    it('should give undefined', () => {
      expect(buildTypedDateTime('2026-10-13 08')).toBeUndefined();
    });
  });
});

describe('buildGmtLabel', () => {
  describe('when the offset is whole hours', () => {
    it('should render the hours only', () => {
      expect(buildGmtLabel(480)).toBe('GMT+8');
    });
  });

  describe('when the offset is west with minutes', () => {
    it('should render a minus sign and the minutes', () => {
      expect(buildGmtLabel(-570)).toBe('GMT-9:30');
    });
  });
});
