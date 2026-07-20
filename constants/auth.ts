import { AUTH_ROLES, AUTH_PROVIDERS } from "@/types/auth";

export { AUTH_ROLES, AUTH_PROVIDERS };

/**
 * Minimum character length constraint for passwords.
 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Maximum character length constraint for passwords.
 */
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Maximum character length constraint for emails.
 */
export const EMAIL_MAX_LENGTH = 255;

/**
 * Regular expression patterns for strict password policy validations.
 */
export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
} as const;

/**
 * Authorized routes in the authentication module.
 */
export const AUTH_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  unauthorized: "/unauthorized",
  sessionExpired: "/session-expired",
} as const;

/**
 * Local storage keys reserved for authentication state and user session data.
 */
export const AUTH_STORAGE_KEYS = {
  accessToken: "konark_access_token",
  refreshToken: "konark_refresh_token",
  rememberMe: "konark_remember_me",
  user: "konark_auth_user",
  theme: "konark_theme",
} as const;

/**
 * Default initial values for the user login form.
 */
export const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
  rememberMe: false,
} as const;

/**
 * Default initial values for the forgot password email request form.
 */
export const FORGOT_PASSWORD_DEFAULT_VALUES = {
  email: "",
} as const;

/**
 * Default initial values for the password reset/override form.
 */
export const RESET_PASSWORD_DEFAULT_VALUES = {
  token: "",
  password: "",
  confirmPassword: "",
} as const;

/**
 * Standard professional user-facing feedback messages for authentication states.
 */
export const AUTH_MESSAGES = {
  loginSuccess: "Successfully signed in.",
  loginFailed: "Authentication failed. Please try again.",
  logoutSuccess: "Successfully signed out.",
  sessionExpired: "Your session has expired. Please sign in again.",
  invalidCredentials: "The email or password entered is incorrect.",
  forgotPasswordSuccess: "If the account exists, an email has been sent with recovery instructions.",
  resetPasswordSuccess: "Password reset successfully. You can now log in with your new password.",
  passwordMismatch: "The passwords do not match.",
  unauthorized: "You do not have permission to access this resource.",
} as const;

/**
 * Page titles for each stage of the authentication lifecycle.
 */
export const AUTH_PAGE_TITLES = {
  login: "Sign In",
  forgotPassword: "Reset Password",
  resetPassword: "Create New Password",
  unauthorized: "Access Denied",
  sessionExpired: "Session Expired",
} as const;

/**
 * Contextual descriptions for each stage of the authentication lifecycle.
 */
export const AUTH_PAGE_DESCRIPTIONS = {
  login: "Sign in to your Konark HRMS account to manage your profile, leave, and payroll.",
  forgotPassword: "Enter your email address to receive password recovery instructions.",
  resetPassword: "Create a secure, non-reusable password to regain access to your account.",
  unauthorized: "You do not have the required permissions to access this page. Contact HR or your Administrator.",
  sessionExpired: "For security, your session was ended due to inactivity. Please sign in again.",
} as const;