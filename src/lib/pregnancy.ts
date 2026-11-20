export interface PregnancySettings {
  name: string;
  method: "lmp" | "due";
  date: string;
}
const dayMs = 86_400_000;
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function calendarTime(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error("Enter a complete date.");
  const time = Date.parse(value + "T00:00:00Z");
  if (
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== value ||
    value < "1900-01-01" ||
    value > "2200-12-31"
  )
    throw new Error("Enter a valid date between 1900 and 2200.");
  return time;
}
export function addDays(date: string, days: number): string {
  return new Date(calendarTime(date) + days * dayMs).toISOString().slice(0, 10);
}
export function validateSettings(
  value: unknown,
  today = localDate(),
): PregnancySettings {
  if (!value || typeof value !== "object")
    throw new Error("Choose valid pregnancy settings.");
  const v = value as Record<string, unknown>;
  if (typeof v.name !== "string" || v.name.trim().length > 60)
    throw new Error("Use a name of 60 characters or fewer.");
  if (v.method !== "lmp" && v.method !== "due")
    throw new Error("Choose last period or due date.");
  if (typeof v.date !== "string") throw new Error("Choose a date.");
  calendarTime(v.date);
  const start = v.method === "lmp" ? v.date : addDays(v.date, -280);
  if (calendarTime(start) > calendarTime(today))
    throw new Error(
      v.method === "lmp"
        ? "The first day of your last period cannot be in the future."
        : "This due date is more than 40 weeks away. Check the date.",
    );
  return { name: v.name.trim(), method: v.method, date: v.date };
}
export function calculateProgress(
  settings: PregnancySettings,
  today = localDate(),
) {
  const valid = validateSettings(settings, today);
  const dueDate =
    valid.method === "due" ? valid.date : addDays(valid.date, 280);
  const startDate = addDays(dueDate, -280);
  const elapsed = Math.round(
    (calendarTime(today) - calendarTime(startDate)) / dayMs,
  );
  const start = new Date(calendarTime(startDate));
  const end = new Date(calendarTime(today));
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() -
    start.getUTCMonth();
  // Always anchor to the original day; February must not move March's anniversary.
  const anniversary = (offset: number) => {
    const year = start.getUTCFullYear();
    const month = start.getUTCMonth() + offset;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Date.UTC(year, month, Math.min(start.getUTCDate(), lastDay));
  };
  if (anniversary(months) > calendarTime(today)) months--;
  const calendarDays = Math.round(
    (calendarTime(today) - anniversary(months)) / dayMs,
  );
  return {
    startDate,
    dueDate,
    elapsed,
    months28: { months: Math.floor(elapsed / 28), days: elapsed % 28 },
    calendarMonths: { months, days: calendarDays },
    weeks: Math.floor(elapsed / 7),
    days: elapsed % 7,
    daysRemaining: 280 - elapsed,
    trimester: elapsed < 98 ? 1 : elapsed < 196 ? 2 : 3,
    percent: Math.min(100, Math.max(0, (elapsed / 280) * 100)),
  };
}
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(calendarTime(date)));
}
