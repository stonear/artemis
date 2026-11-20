import { expect, test } from "bun:test";
import {
  addDays,
  calculateProgress,
  localDate,
  validateSettings,
} from "./pregnancy";
const lmp = { name: "Little one", method: "lmp", date: "2026-01-01" } as const;
test("LMP estimates 280 days and completed weeks plus days", () => {
  const p = calculateProgress(lmp, "2026-06-05");
  expect(p.dueDate).toBe("2026-10-08");
  expect(p.weeks).toBe(22);
  expect(p.days).toBe(1);
  expect(p.daysRemaining).toBe(125);
});
test("due-date and LMP modes produce the same age", () => {
  expect(
    calculateProgress(
      { ...lmp, method: "due", date: "2026-10-08" },
      "2026-06-05",
    ),
  ).toEqual(calculateProgress(lmp, "2026-06-05"));
});
test("trimester boundaries use completed weeks", () => {
  for (const [d, t] of [
    [97, 1],
    [98, 2],
    [195, 2],
    [196, 3],
  ])
    expect(calculateProgress(lmp, addDays(lmp.date, d)).trimester).toBe(t);
});
test("due and past-due dates retain accurate age and cap visual progress", () => {
  expect(calculateProgress(lmp, "2026-10-08").daysRemaining).toBe(0);
  const p = calculateProgress(lmp, "2026-10-18");
  expect(p.weeks).toBe(41);
  expect(p.days).toBe(3);
  expect(p.daysRemaining).toBe(-10);
  expect(p.percent).toBe(100);
});
test("rejects impossible dates, types, future starts and invalid methods", () => {
  for (const date of [
    "2026-02-29",
    "2026-13-01",
    "2026-01-32",
    "2026-1-01",
    "",
  ])
    expect(() => validateSettings({ ...lmp, date }, "2026-06-05")).toThrow();
  expect(() =>
    validateSettings({ ...lmp, date: "2026-06-06" }, "2026-06-05"),
  ).toThrow();
  expect(() =>
    validateSettings(
      { ...lmp, method: "due", date: "2027-06-05" },
      "2026-06-05",
    ),
  ).toThrow();
  expect(() => validateSettings({ ...lmp, method: "conception" })).toThrow();
  expect(() => validateSettings({ ...lmp, name: 42 })).toThrow();
  expect(() => validateSettings(null)).toThrow();
});
test("calendar arithmetic crosses leap days and DST with local display dates", () => {
  expect(addDays("2024-02-28", 2)).toBe("2024-03-01");
  expect(addDays("2026-03-07", 3)).toBe("2026-03-10");
  expect(localDate(new Date(2026, 0, 1, 0, 1))).toBe("2026-01-01");
});
