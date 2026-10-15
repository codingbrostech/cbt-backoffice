import {
  buildBaccaratHands,
  buildBaccaratWinner,
  buildHandPoints,
  buildPlayingCard
} from '@cbt-bo/component-lib/components/game/BaccaratCards/baccarat-round';

describe('buildBaccaratHands', () => {
  describe('when the value lists six valid codes', () => {
    it('should split the banker hand from the player hand', () => {
      expect(buildBaccaratHands('105,402,0,111,310,308')).toEqual({
        banker: { cards: [105, 402] },
        player: { cards: [111, 310], third: 308 }
      });
    });
  });

  describe('when extra data follows a `!`', () => {
    it('should ignore the extra data', () => {
      expect(buildBaccaratHands('211,112,0,110,208,0!x')).toEqual({
        banker: { cards: [211, 112] },
        player: { cards: [110, 208] }
      });
    });
  });

  describe('when the value has the wrong number of codes', () => {
    it('should return undefined', () => {
      expect(buildBaccaratHands('105,402,0')).toBeUndefined();
    });
  });

  describe('when a code names an unknown suit', () => {
    it('should return undefined', () => {
      expect(buildBaccaratHands('905,402,0,111,310,308')).toBeUndefined();
    });
  });

  describe('when a code names an unknown rank', () => {
    it('should return undefined', () => {
      expect(buildBaccaratHands('114,402,0,111,310,308')).toBeUndefined();
    });
  });

  describe('when the value is empty', () => {
    it('should return undefined', () => {
      expect(buildBaccaratHands('')).toBeUndefined();
    });
  });
});

describe('buildBaccaratWinner', () => {
  describe('when the first entry is a known winner code', () => {
    it('should return the matching side', () => {
      expect(buildBaccaratWinner('1,0,0,0')).toBe('banker');
      expect(buildBaccaratWinner('2,0,0,0')).toBe('player');
      expect(buildBaccaratWinner('3,0,0,0')).toBe('tie');
    });
  });

  describe('when the first entry is unknown', () => {
    it('should return undefined', () => {
      expect(buildBaccaratWinner('0,0,0,0')).toBeUndefined();
    });
  });

  describe('when the value is absent', () => {
    it('should return undefined', () => {
      expect(buildBaccaratWinner()).toBeUndefined();
    });
  });
});

describe('buildHandPoints', () => {
  describe('when the hand holds tens and face cards', () => {
    it('should count them as zero', () => {
      expect(buildHandPoints({ cards: [111, 310], third: 308 })).toBe(8);
    });
  });

  describe('when the sum reaches ten or more', () => {
    it('should keep only the last digit', () => {
      expect(buildHandPoints({ cards: [107, 206] })).toBe(3);
    });
  });

  describe('when the hand holds an ace', () => {
    it('should count it as one', () => {
      expect(buildHandPoints({ cards: [101, 405] })).toBe(6);
    });
  });
});

describe('buildPlayingCard', () => {
  describe('when the code is a red face card', () => {
    it('should return its letter, suit and red colour', () => {
      expect(buildPlayingCard(213)).toEqual({ rank: 'K', suit: '♥', isRed: true });
    });
  });

  describe('when the code is a black number card', () => {
    it('should return its number and black colour', () => {
      expect(buildPlayingCard(310)).toEqual({ rank: '10', suit: '♣', isRed: false });
    });
  });

  describe('when the code names no known suit', () => {
    it('should return undefined', () => {
      expect(buildPlayingCard(905)).toBeUndefined();
    });
  });
});
