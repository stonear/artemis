<script lang="ts">
  import { addDays, formatDate } from "../pregnancy";
  let { startDate, elapsed }: { startDate: string; elapsed: number } = $props();
  const milestones = [
    {
      week: 0,
      title: "Your starting point",
      description:
        "Pregnancy dating begins on the first day of your last period.",
    },
    {
      week: 14,
      title: "Second trimester",
      description: "A new chapter in your pregnancy timeline.",
    },
    {
      week: 28,
      title: "Third trimester",
      description: "The next stretch of your journey begins.",
    },
    {
      week: 40,
      title: "Estimated due date",
      description:
        "An estimate to plan around. Every pregnancy has its own timing.",
    },
  ];
</script>

<div class="milestones">
  {#each milestones as m}<div
      class="milestone"
      class:reached={elapsed >= m.week * 7}
    >
      <div class="milestone-dot">
        {#if elapsed >= m.week * 7}✓{:else}<span></span>{/if}
      </div>
      <div class="milestone-text">
        <div class="milestone-heading">
          <h3>{m.title}</h3>
          <span>Week {m.week}</span>
        </div>
        <p>{formatDate(addDays(startDate, m.week * 7))}</p>
        <p class="muted milestone-description">{m.description}</p>
      </div>
    </div>{/each}
</div>
