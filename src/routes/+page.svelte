<script lang="ts">
  import { onMount, tick } from "svelte";
  import { asset } from "$app/paths";
  import {
    addDays,
    calculateProgress,
    formatDate,
    localDate,
    type PregnancySettings as Settings,
  } from "../lib/pregnancy";
  import { loadSettings, saveSettings, clearSettings } from "../lib/storage";
  import { startDateRefresh } from "../lib/clock";
  import Icon from "../lib/components/Icon.svelte";
  import PwaStatus from "../lib/components/PwaStatus.svelte";
  import ProgressRing from "../lib/components/ProgressRing.svelte";
  import PregnancySettings from "../lib/components/PregnancySettings.svelte";
  import MonthComparison from "../lib/components/MonthComparison.svelte";
  import Timeline from "../lib/components/Timeline.svelte";
  import DataControls from "../lib/components/DataControls.svelte";
  import Glossary from "../lib/components/Glossary.svelte";
  import ThemeSwitcher from "../lib/components/ThemeSwitcher.svelte";
  let today = $state(localDate()),
    settings = $state<Settings>({
      name: "Little one",
      method: "lmp",
      date: addDays(localDate(), -157),
    }),
    hasSaved = $state(false),
    error = $state(""),
    ready = $state(false);
  let section = $state<"overview" | "settings" | "glossary">("overview");
  let progress = $derived(calculateProgress(settings, today));
  let trimesterName = $derived(
    ["First", "Second", "Third"][progress.trimester - 1],
  );
  const nav = [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "settings", label: "Pregnancy details", icon: "sliders" },
    { id: "glossary", label: "Glossary", icon: "book" },
  ] as const;
  let main: HTMLElement;
  async function go(next: typeof section) {
    section = next;
    await tick();
    main?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  onMount(() => {
    try {
      const loaded = loadSettings(localStorage);
      if (loaded.settings) {
        settings = loaded.settings;
        hasSaved = true;
      }
      error = loaded.error ?? "";
    } catch {
      error = "Browser storage is unavailable. Your details will not persist.";
    }
    ready = true;
    return startDateRefresh((date) => (today = date));
  });
  function save(next: Settings) {
    settings = next;
    hasSaved = true;
    try {
      error = saveSettings(localStorage, next).error ?? "";
    } catch {
      error =
        "Changes are not saved on this device. Download a backup to keep them.";
    }
    void go("overview");
  }
  function clear() {
    try {
      clearSettings(localStorage);
      settings = {
        name: "Little one",
        method: "lmp",
        date: addDays(today, -157),
      };
      hasSaved = false;
      error = "";
      void go("overview");
    } catch {
      error = "Your details could not be cleared. Please try again.";
    }
  }
</script>

<svelte:head
  ><title>Artemis — Pregnancy tracker</title><meta
    name="description"
    content="Track pregnancy weeks, days and your estimated due date. A private, simple pregnancy tracker that works offline."
  /></svelte:head
>
<a class="skip-link" href="#main">Skip to content</a>
<div class="app-shell">
  <header class="topbar">
    <div class="header-inner">
      <button
        class="brand"
        onclick={() => go("overview")}
        aria-label="Artemis home"
        ><span class="brand-mark"
          ><img
            src={asset("favicon.svg")}
            alt=""
            width="36"
            height="36"
          /></span
        >artemis<span class="brand-period">.</span></button
      >
      <nav class="desktop-nav" aria-label="Main navigation">
        {#each nav as item}<button
            class:active={section === item.id}
            aria-current={section === item.id ? "page" : undefined}
            onclick={() => go(item.id)}
            ><Icon name={item.icon} size={18} />{item.label}</button
          >{/each}
      </nav>
      <div class="header-actions"><ThemeSwitcher /><PwaStatus /></div>
    </div>
  </header>
  <main id="main" tabindex="-1" bind:this={main}>
    <div class="page-heading">
      <div>
        <p class="section-eyebrow">
          {section === "glossary"
            ? "A LITTLE CLARITY"
            : "YOUR PREGNANCY, DAY BY DAY"}
        </p>
        <h1>
          {section === "overview"
            ? "Your pregnancy, at a glance."
            : section === "settings"
              ? "Your pregnancy details."
              : "Pregnancy words, made simple."}
        </h1>
        <p class="muted">
          {section === "overview"
            ? "Your weeks, your dates. One clear picture."
            : section === "settings"
              ? "One simple setup. Progress updates automatically."
              : "Plain-language definitions for the terms you see here."}
        </p>
      </div>
      {#if section === "overview"}<button
          class="button secondary"
          onclick={() => go("settings")}
          ><Icon name="sliders" size={17} />{hasSaved
            ? "Edit details"
            : "Set up my pregnancy"}</button
        >{/if}
    </div>
    {#if error}<div class="error" role="alert">{error}</div>{/if}
    {#if !ready}<p class="muted" role="status">
        Loading your pregnancy…
      </p>{:else if section === "settings"}
      {#key `${hasSaved}-${settings.method}-${settings.date}-${settings.name}`}<PregnancySettings
          settings={hasSaved ? settings : undefined}
          {today}
          onsave={save}
          oncancel={() => go("overview")}
        />{/key}
      <DataControls {settings} {hasSaved} onimport={save} onclear={clear} />
    {:else if section === "glossary"}<Glossary />
    {:else}
      {#if !hasSaved}<div class="example-banner">
          <span
            ><Icon name="info" size={17} />You’re exploring an example
            pregnancy.</span
          ><button class="text-button" onclick={() => go("settings")}
            >Make it yours</button
          >
        </div>{/if}
      <section class="card pregnancy-hero">
        <div class="hero-age">
          <div>
            <span class="pill"
              >{hasSaved
                ? settings.name || "Your pregnancy"
                : "Example pregnancy"}</span
            >
            <h2>Your pregnancy today</h2>
            <p class="muted">As of {formatDate(today)}</p>
          </div>
          <ProgressRing
            weeks={progress.weeks}
            days={progress.days}
            percent={progress.percent}
          />
        </div>
        <div class="hero-details">
          <span class="section-eyebrow">ESTIMATED DUE DATE</span>
          <h2 class="due-date">{formatDate(progress.dueDate)}</h2>
          <div class="due-count">
            <Icon name="calendar" size={19} /><strong
              >{Math.abs(progress.daysRemaining)}
              {Math.abs(progress.daysRemaining) === 1 ? "day" : "days"}</strong
            ><span
              >{progress.daysRemaining < 0
                ? "past your due date"
                : progress.daysRemaining === 0
                  ? "— today"
                  : "to go"}</span
            >
          </div>
          <dl class="hero-facts">
            <div>
              <dt>Trimester</dt>
              <dd>
                {trimesterName}
                <span class="muted">· {progress.trimester} of 3</span>
              </dd>
            </div>
            <div>
              <dt>Dating from</dt>
              <dd>{formatDate(progress.startDate)}</dd>
            </div>
          </dl>
          <p class="field-help">
            An estimate, not a deadline. Your doctor or midwife can confirm your
            dates.
          </p>
        </div>
        <MonthComparison
          months28={progress.months28}
          calendarMonths={progress.calendarMonths}
          startDate={progress.startDate}
        />
      </section>
      <section class="card journey-card">
        <div class="card-heading">
          <h2>Your journey</h2>
          <span class="muted">{Math.round(progress.percent)}% of 40 weeks</span>
        </div>
        <div class="trimester-track">
          {#each [{ n: 1, title: "First trimester", range: "Weeks 0–13", start: 0, length: 98 }, { n: 2, title: "Second trimester", range: "Weeks 14–27", start: 98, length: 98 }, { n: 3, title: "Third trimester", range: "Week 28 onward", start: 196, length: 84 }] as t}<div
              class="trimester-segment"
              class:current={progress.trimester === t.n}
            >
              <div class="track-bar">
                <div
                  style={`width:${Math.min(100, Math.max(0, ((progress.elapsed - t.start) / t.length) * 100))}%`}
                ></div>
              </div>
              <strong>{t.title}</strong>
              <p class="muted">{t.range}</p>
              {#if progress.trimester === t.n}<span class="here-label"
                  >You’re here</span
                >{/if}
            </div>{/each}
        </div>
        <details class="timeline-details">
          <summary>View timeline</summary><Timeline
            startDate={progress.startDate}
            elapsed={progress.elapsed}
          />
        </details>
      </section>
    {/if}
    <footer>
      <span>Built for a little more peace of mind.</span><span
        ><Icon name="shield" size={15} />Private on this device</span
      >
    </footer>
  </main>
  <nav class="mobile-nav" aria-label="Mobile navigation">
    {#each nav as item}<button
        class:active={section === item.id}
        aria-current={section === item.id ? "page" : undefined}
        onclick={() => go(item.id)}
        ><Icon name={item.icon} size={20} /><span
          >{item.id === "settings" ? "Details" : item.label}</span
        ></button
      >{/each}
  </nav>
</div>
