/** Frontend-only account simulation rules. No email or password is sent or stored. */
export const DEMO_OTP = '123456';
export const RESEND_SECONDS = 30;
export const RESET_EXPIRY_MINUTES = 10;
export const PASSWORD_MIN_LENGTH = 8;
export function isValidOtp(code: string) { return code === DEMO_OTP; }
export function passwordError(password: string, confirmation: string) {
  if (password.length < PASSWORD_MIN_LENGTH) return 'Use at least 8 characters.';
  if (password !== confirmation) return 'Your passwords do not match.';
  return null;
}
