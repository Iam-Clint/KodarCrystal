import { expect, test } from 'bun:test';
import { isValidOtp, passwordError, RESEND_SECONDS, RESET_EXPIRY_MINUTES } from '../src/lib/account-flow';
test('only the requested six-digit demo code is accepted', () => {
  expect(isValidOtp('123456')).toBe(true);
  expect(isValidOtp('654321')).toBe(false);
  expect(isValidOtp('12345')).toBe(false);
});
test('new passwords require at least eight characters', () => {
  expect(passwordError('1234567', '1234567')).toBe('Use at least 8 characters.');
  expect(passwordError('12345678', '12345678')).toBe(null);
});
test('confirmation must match the new password', () => {
  expect(passwordError('12345678', '87654321')).toBe('Your passwords do not match.');
});
test('resends wait thirty seconds', () => expect(RESEND_SECONDS).toBe(30));
test('recovery link displays ten-minute expiry', () => expect(RESET_EXPIRY_MINUTES).toBe(10));
