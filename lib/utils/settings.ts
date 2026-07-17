/**
 * @file lib/utils/settings.ts
 * @description Shared utility helpers for the Konark HRMS Settings Module.
 */

const DISPLAY_TO_FISCAL: Record<string, string> = {
  January: "01-01",
  April: "04-01",
  July: "07-01",
  October: "10-01",
};

const FISCAL_TO_DISPLAY: Record<string, string> = {
  "01-01": "January",
  "04-01": "April",
  "07-01": "July",
  "10-01": "October",
};

/**
 * Converts a persisted fiscal value (MM-DD)
 * into the display value used by the UI.
 */
export function mapFiscalToDisplay(fiscalValue: string): string {
  return FISCAL_TO_DISPLAY[fiscalValue] ?? fiscalValue;
}

/**
 * Converts a display month
 * into the persisted fiscal value.
 */
export function mapDisplayToFiscal(displayValue: string): string {
  return DISPLAY_TO_FISCAL[displayValue] ?? displayValue;
}

/**
 * Returns true if the supplied value is a valid fiscal date.
 */
export function isFiscalDate(value: string): boolean {
  return /^\d{2}-\d{2}$/.test(value);
}

/**
 * Normalizes fiscal values.
 */
export function normalizeFiscalValue(value: string): string {
  if (DISPLAY_TO_FISCAL[value]) {
    return DISPLAY_TO_FISCAL[value];
  }

  if (FISCAL_TO_DISPLAY[value]) {
    return value;
  }

  return "01-01";
}