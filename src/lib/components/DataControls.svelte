<script lang="ts">
  import { parseBackup, serializeBackup, downloadFile } from "../storage";
  import {
    formatDate,
    calculateProgress,
    type PregnancySettings,
  } from "../pregnancy";
  import Icon from "./Icon.svelte";
  let {
    settings,
    hasSaved,
    onimport,
    onclear,
  }: {
    settings: PregnancySettings;
    hasSaved: boolean;
    onimport: (s: PregnancySettings) => void;
    onclear: () => void;
  } = $props();
  let preview = $state<PregnancySettings | null>(null),
    error = $state(""),
    confirmClear = $state(false),
    reading = $state(false);
  async function importFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    preview = null;
    error = "";
    if (!file) return;
    reading = true;
    try {
      if (file.size > 100_000)
        throw Error("Choose an Artemis backup smaller than 100 KB.");
      preview = parseBackup(await file.text()).settings;
    } catch (e) {
      error = e instanceof Error ? e.message : "Could not read this file.";
    } finally {
      input.value = "";
      reading = false;
    }
  }
  function exportFile() {
    try {
      downloadFile("artemis-backup.json", serializeBackup(settings));
      error = "";
    } catch {
      error = "Your backup could not be downloaded. Please try again.";
    }
  }
</script>

<section class="card data-card">
  <div class="card-heading">
    <div>
      <h2>Your data stays yours</h2>
      <p class="muted">
        Saved in this browser. Back it up before switching devices.
      </p>
    </div>
    <span class="icon-badge"><Icon name="shield" /></span>
  </div>
  <div class="data-actions">
    <button class="button secondary" disabled={!hasSaved} onclick={exportFile}
      ><Icon name="download" size={17} /> Download backup</button
    ><span class="file-input-wrap"
      ><label class="button secondary file-button" for="backup-file"
        ><Icon name="upload" size={17} />
        {reading ? "Reading backup…" : "Restore backup"}</label
      ><input
        id="backup-file"
        type="file"
        accept=".json,application/json"
        onchange={importFile}
        disabled={reading}
      /></span
    >
  </div>
  {#if !hasSaved}<p class="field-help">
      Save your own details to enable a personal backup.
    </p>{/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  {#if preview}<div class="confirmation" role="status">
      <h3>Restore this pregnancy?</h3>
      <p>
        {preview.name || "Little one"} · Due {formatDate(
          calculateProgress(preview).dueDate,
        )}
      </p>
      <p>This replaces the details currently shown on this device.</p>
      <div class="actions">
        <button
          class="button primary"
          onclick={() => {
            if (preview) onimport(preview);
            preview = null;
          }}>Restore these details</button
        ><button class="button secondary" onclick={() => (preview = null)}
          >Cancel</button
        >
      </div>
    </div>{/if}
  {#if hasSaved}<div class="reset-row">
      <div>
        <h3>Start fresh</h3>
        <p class="muted">Remove pregnancy details from this browser.</p>
      </div>
      <button class="text-button danger" onclick={() => (confirmClear = true)}
        >Clear my details</button
      >
    </div>{/if}
  {#if confirmClear}<div class="confirmation">
      <h3>Clear your saved pregnancy?</h3>
      <p>
        Download a backup first if you want to keep it. This cannot be undone.
      </p>
      <div class="actions">
        <button
          class="button danger-button"
          onclick={() => {
            onclear();
            confirmClear = false;
          }}>Yes, clear my details</button
        ><button class="button secondary" onclick={() => (confirmClear = false)}
          >Keep my details</button
        >
      </div>
    </div>{/if}
</section>
