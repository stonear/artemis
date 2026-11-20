import { validateSettings, type PregnancySettings } from "./pregnancy";
export interface Backup {
  version: 1;
  settings: PregnancySettings;
}
type StorageAccess = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const key = "artemis.pregnancy.v1";
export function parseBackup(text: string): Backup {
  if (text.length > 100_000)
    throw new Error("This backup is too large. Choose an Artemis backup.");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  if (
    !value ||
    typeof value !== "object" ||
    (value as Record<string, unknown>).version !== 1
  )
    throw new Error("This backup version is not supported.");
  return {
    version: 1,
    settings: validateSettings((value as Record<string, unknown>).settings),
  };
}
export function serializeBackup(settings: PregnancySettings): string {
  return JSON.stringify(
    { version: 1, settings: validateSettings(settings) },
    null,
    2,
  );
}
export function loadSettings(storage: StorageAccess): {
  settings: PregnancySettings | null;
  error: string | null;
} {
  try {
    const text = storage.getItem(key);
    return {
      settings: text === null ? null : parseBackup(text).settings,
      error: null,
    };
  } catch {
    return {
      settings: null,
      error:
        "Saved settings could not be loaded. The example is shown. Restore a backup or set up your pregnancy.",
    };
  }
}
export function saveSettings(
  storage: StorageAccess,
  settings: PregnancySettings,
): { error: string | null } {
  try {
    storage.setItem(key, serializeBackup(settings));
    return { error: null };
  } catch {
    return {
      error:
        "Changes are not saved on this device. Download a backup to keep them.",
    };
  }
}
export function clearSettings(storage: StorageAccess): void {
  storage.removeItem(key);
}
export function downloadFile(filename: string, content: string): void {
  const url = URL.createObjectURL(
    new Blob([content], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
