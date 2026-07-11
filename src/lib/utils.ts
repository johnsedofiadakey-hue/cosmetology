import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ghana local numbers are 9 digits after the leading 0 (e.g. 0541234567),
// or the same 9 digits with no leading 0 (541234567). Accepts either and
// returns "233XXXXXXXXX" so phone numbers are stored consistently
// regardless of how the client typed it into the "+233" prefixed input.
export function normalizeGhanaPhone(localInput: string): string {
  const digits = localInput.replace(/\D/g, "");
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return "233" + digits.slice(1);
  return "233" + digits;
}

// Strips a 233/0 prefix so a previously-normalized number can be re-shown
// in a "+233"-prefixed input as just the local digits.
export function stripGhanaPrefix(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("233")) return digits.slice(3);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

// Formats an "HH:mm" 24-hour slot string (as returned by
// /api/bookings/available) into a 12-hour "h:mm AM/PM" display string.
export function formatSlotLabel(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

// Displays a service's price as either a fixed amount ("GH₵200") or, when
// priceMax is set, a range ("GH₵100-250"). Booking totals always sum the
// base `price` (the low end of a range) — see formatTotalPrice below.
export function formatServicePrice(service: { price: number; priceMax?: number }, currency: string): string {
  if (service.priceMax && service.priceMax > service.price) {
    return `${currency}${service.price}-${service.priceMax}`;
  }
  return `${currency}${service.price}`;
}

// Sums a cart's base prices, and — if any selected service has a price
// range — also sums the high end, so the total is shown as a range too
// (e.g. "GH₵450 - GH₵700") rather than silently collapsing to just the low
// estimate.
export function formatTotalPrice(services: Array<{ price: number; priceMax?: number }>, currency: string): string {
  const min = services.reduce((sum, s) => sum + s.price, 0);
  const max = services.reduce((sum, s) => sum + (s.priceMax && s.priceMax > s.price ? s.priceMax : s.price), 0);
  return max > min ? `${currency}${min} - ${currency}${max}` : `${currency}${min}`;
}
