import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidOtp, passwordError, RESEND_SECONDS, RESET_EXPIRY_MINUTES } from '../src/lib/account-flow.ts';
test('only the requested six-digit demo code is accepted', () => {
  assert.equal(isValidOtp('123456'), true); assert.equal(isValidOtp('654321'), false); assert.equal(isValidOtp('12345'), false);
});
test('new passwords require at least eight characters', () => {
  assert.equal(passwordError('1234567', '1234567'), 'Use at least 8 characters.'); assert.equal(passwordError('12345678', '12345678'), null);
});
test('confirmation must match the new password', () => assert.equal(passwordError('12345678', '87654321'), 'Your passwords do not match.'));
test('resends wait thirty seconds', () => assert.equal(RESEND_SECONDS, 30));
test('recovery link displays ten-minute expiry', () => assert.equal(RESET_EXPIRY_MINUTES, 10));
