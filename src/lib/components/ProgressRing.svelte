<script lang="ts">
  let {
    weeks,
    days,
    percent,
  }: { weeks: number; days: number; percent: number } = $props();
</script>

<div
  class="progress-orbit"
  aria-label={`${weeks} weeks and ${days} days pregnant; ${Math.round(percent)} percent of 40 weeks`}
  role="img"
>
  <svg viewBox="0 0 240 240" aria-hidden="true" class="ring"
    ><circle cx="120" cy="120" r="108" class="ring-track" /><circle
      cx="120"
      cy="120"
      r="108"
      class="ring-fill"
      stroke-dasharray={`${percent * 6.786} 678.6`}
      transform="rotate(-90 120 120)"
    /></svg
  >
  <div class="ring-content">
    <div class="age">{weeks}<span>w</span> {days}<span>d</span></div>
    <p>weeks &amp; days</p>
  </div>
</div>
