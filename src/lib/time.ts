import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const TZ = "America/Los_Angeles";

export function fmt(d: Date | string, pattern = "MMM d, yyyy h:mm a") {
  return formatInTimeZone(new Date(d), TZ, pattern);
}

export function fmtDate(d: Date | string) {
  return formatInTimeZone(new Date(d), TZ, "MMM d, yyyy");
}

export function nowLocalInputValue(): string {
  return formatInTimeZone(new Date(), TZ, "yyyy-MM-dd'T'HH:mm");
}

export function localInputToUTC(v: string): Date {
  return fromZonedTime(v, TZ);
}
