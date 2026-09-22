import BigNumber from 'bignumber.js';

/**
 * Minor unit = the smallest currency unit (integer representation).
 *
 * Example:
 * - USD 1.23 (major unit) → 123 (minor unit, cents)
 */

export interface IAmountOptions {
  decimals?: number; // default: 2
  roundingMode?: BigNumber.RoundingMode; // default: ROUND_HALF_UP
}

const TEN = new BigNumber(10);

export const amount = {
  /**
   * Normalize API minor-unit values into display-safe major-unit numbers.
   */
  fromMinor(value: BigNumber.Value | null | undefined, options?: IAmountOptions): number | null {
    if (value === undefined || value === null || value === '') return null;

    const decimals = options?.decimals ?? 2;
    const factor = TEN.pow(decimals);

    return new BigNumber(value).div(factor).toNumber();
  },

  /**
   * Normalize user input into API-ready minor-unit integers with rounding.
   */
  toMinor(value: BigNumber.Value | null | undefined, options?: IAmountOptions): number | null {
    if (value === undefined || value === null || value === '') return null;

    const decimals = options?.decimals ?? 2;
    const roundingMode = options?.roundingMode ?? BigNumber.ROUND_HALF_UP;
    const factor = TEN.pow(decimals);

    return new BigNumber(value).times(factor).integerValue(roundingMode).toNumber();
  }
};
