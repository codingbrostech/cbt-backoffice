import { describe, expect, it } from 'vitest';

import {
  ApiError,
  ERROR_GENERAL,
  UNAUTHORIZED_API_CODE,
  formatApiErrorMessage,
  getApiErrorCode,
  getApiErrorMessage,
  isUnauthorizedError,
  parseErrorCode
} from './api-error';

describe('parseErrorCode', () => {
  describe('when the message starts with a numeric prefix', () => {
    it('should return the prefix as a number', () => {
      expect(parseErrorCode('10009: 驗證碼不正確')).toBe(10009);
    });
  });

  describe('when the message has no numeric prefix', () => {
    it('should return undefined', () => {
      expect(parseErrorCode('Unauthorized')).toBeUndefined();
      expect(parseErrorCode(undefined)).toBeUndefined();
    });
  });
});

describe('ApiError', () => {
  describe('when the body carries a numeric code', () => {
    it('should expose the status, code, message and detail', () => {
      const error = new ApiError(422, { code: 42, message: 'nope', detail: 'why' });

      expect(error).toMatchObject({ status: 422, code: 42, message: 'nope', detail: 'why' });
    });
  });

  describe('when the body only prefixes the message with the code', () => {
    it('should parse the code from the message', () => {
      const error = new ApiError(400, { code: 'InvalidArgument', message: '10009: bad otp' });

      expect(error.code).toBe(10009);
      expect(error.message).toBe('10009: bad otp');
    });
  });

  describe('when the body has no usable fields', () => {
    it('should fall back to the general code and an HTTP message', () => {
      const error = new ApiError(500, 'oops');

      expect(error.code).toBe(ERROR_GENERAL);
      expect(error.message).toBe('HTTP 500');
      expect(error.body).toBe('oops');
    });
  });
});

describe('isUnauthorizedError', () => {
  describe('when the status is 401', () => {
    it('should return true', () => {
      expect(isUnauthorizedError(new ApiError(401, {}))).toBe(true);
    });
  });

  describe('when the body carries the unauthorized api code', () => {
    it('should return true', () => {
      expect(isUnauthorizedError(new ApiError(400, { code: UNAUTHORIZED_API_CODE }))).toBe(true);
    });
  });

  describe('when the error is something else', () => {
    it('should return false', () => {
      expect(isUnauthorizedError(new ApiError(403, { code: 5 }))).toBe(false);
      expect(isUnauthorizedError(new Error('x'))).toBe(false);
    });
  });
});

describe('getApiErrorCode', () => {
  describe('when given an ApiError', () => {
    it('should return its code', () => {
      expect(getApiErrorCode(new ApiError(400, { code: 7 }))).toBe(7);
    });
  });

  describe('when given anything else', () => {
    it('should return undefined', () => {
      expect(getApiErrorCode(new Error('x'))).toBeUndefined();
    });
  });
});

describe('getApiErrorMessage', () => {
  describe('when given an ApiError with a detail', () => {
    it('should prefer the detail', () => {
      const error = new ApiError(400, { message: 'short', detail: 'long' });

      expect(getApiErrorMessage(error, 'fallback')).toBe('long');
    });
  });

  describe('when given a plain Error', () => {
    it('should return its message', () => {
      expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('boom');
    });
  });

  describe('when given a non-error value', () => {
    it('should return the fallback', () => {
      expect(getApiErrorMessage('x', 'fallback')).toBe('fallback');
    });
  });
});

describe('formatApiErrorMessage', () => {
  describe('when the error has a detail', () => {
    it('should append the code to the detail', () => {
      expect(formatApiErrorMessage(new ApiError(400, { code: 9, detail: 'why' }))).toBe('why (9)');
    });
  });
});
