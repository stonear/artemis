<script lang="ts">
  import { untrack } from "svelte";
  import {
    validateSettings,
    formatDate,
    calculateProgress,
    type PregnancySettings,
  } from "../pregnancy";
  let {
    settings,
    today,
    onsave,
    oncancel,
  }: {
    settings?: PregnancySettings;
    today: string;
    onsave: (settings: PregnancySettings) => void;
    oncancel: () => void;
  } = $props();
  let name = $state(untrack(() => settings?.name ?? "")),
    method = $state(untrack(() => settings?.method ?? "lmp")),
    date = $state(untrack(() => settings?.date || today)),
    error = $state(""),
    dateEdited = $state(false);
  function submit(event: SubmitEvent) {
    event.preventDefault();
    try {
      onsave(validateSettings({ name, method, date }, today));
    } catch (e) {
      error = e instanceof Error ? e.message : "Check your details.";
    }
  }
  function switchMethod(next: "lmp" | "due") {
    if (method === next) return;
    if (!date || (!settings && !dateEdited)) {
      date = today;
      method = next;
      error = "";
      return;
    }
    try {
      const p = calculateProgress({ name, method, date }, today);
      date = next === "due" ? p.dueDate : p.startDate;
    } catch {
      date = today;
    }
    method = next;
    error = "";
  }
</script>

<section class="card settings-card">
  <div class="section-eyebrow">PREGNANCY DETAILS</div>
  <h2>Your pregnancy details</h2>
  <p class="muted">Enter your dates once. Update them whenever you need.</p>
  <form onsubmit={submit}>
    <label for="baby-name"
      >Baby’s name or nickname <span class="optional">(optional)</span></label
    ><input
      id="baby-name"
      maxlength="60"
      bind:value={name}
      placeholder="Little one"
      autocomplete="off"
    />
    <fieldset>
      <legend>How would you like to calculate your dates?</legend>
      <div class="method-options">
        <button
          type="button"
          class:chosen={method === "lmp"}
          aria-pressed={method === "lmp"}
          onclick={() => switchMethod("lmp")}>Last period</button
        ><button
          type="button"
          class:chosen={method === "due"}
          aria-pressed={method === "due"}
          onclick={() => switchMethod("due")}>Estimated due date</button
        >
      </div>
    </fieldset>
    <label for="pregnancy-date"
      >{method === "lmp"
        ? "First day of your last period"
        : "Estimated due date"}</label
    ><input
      id="pregnancy-date"
      type="date"
      required
      max={method === "lmp" ? today : undefined}
      bind:value={date}
      oninput={() => (dateEdited = true)}
      onblur={() => {
        if (!date) date = today;
      }}
      aria-describedby="date-help"
    />
    <p id="date-help" class="field-help">
      {method === "lmp"
        ? "Uses a 28-day cycle and estimates your due date 40 weeks from this date."
        : "Use the estimated due date given by your doctor or midwife."}
    </p>
    {#if date}<p class="calculation-note">
        {#await Promise.resolve().then( () => calculateProgress( { name, method, date } ) ) then preview}Estimated
          due date: <strong>{formatDate(preview.dueDate)}</strong>{:catch}Check
          the date to see your estimate.{/await}
      </p>{/if}
    {#if error}<p class="error" role="alert">{error}</p>{/if}
    <div class="actions">
      <button class="button primary" type="submit">Save my details</button
      ><button class="button secondary" type="button" onclick={oncancel}
        >Cancel</button
      >
    </div>
  </form>
</section>
