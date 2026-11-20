import { expect, test } from "bun:test";
import {
  loadSettings,
  saveSettings,
  parseBackup,
  serializeBackup,
  clearSettings,
} from "./storage";
const settings = {
  name: "Little one",
  method: "lmp",
  date: "2026-01-01",
} as const;
function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
}
test("settings persist, export, validate and clear", () => {
  const s = memory();
  expect(loadSettings(s).settings).toBeNull();
  expect(saveSettings(s, settings).error).toBeNull();
  expect(loadSettings(s).settings).toEqual(settings);
  expect(parseBackup(serializeBackup(settings)).settings).toEqual(settings);
  clearSettings(s);
  expect(loadSettings(s).settings).toBeNull();
});
test("rejects invalid imports without replacing saved settings", () => {
  const s = memory();
  saveSettings(s, settings);
  for (const data of [
    "no",
    "{}",
    '{"version":2}',
    '{"version":1,"settings":{"method":"lmp","date":"2026-02-30","name":""}}',
    "x".repeat(100001),
  ])
    expect(() => parseBackup(data)).toThrow();
  expect(loadSettings(s).settings).toEqual(settings);
});
test("storage and corrupt-data errors are visible", () => {
  const bad = {
    getItem: () => {
      throw Error();
    },
    setItem: () => {
      throw Error();
    },
    removeItem: () => {
      throw Error();
    },
  };
  expect(loadSettings(bad).error).toBeTruthy();
  expect(saveSettings(bad, settings).error).toBeTruthy();
  expect(() => clearSettings(bad)).toThrow();
  const s = memory();
  s.setItem("artemis.pregnancy.v1", "bad");
  expect(loadSettings(s).error).toBeTruthy();
});
