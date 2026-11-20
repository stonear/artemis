<script lang="ts">
  import Icon from "./Icon.svelte";
  const terms = [
    {
      term: "28-day months",
      definition:
        "A counting shortcut: one block of four 7-day weeks. Divide elapsed days by 28 for completed blocks and remaining days. Forty weeks makes 10 of these blocks. This is separate from the 28-day menstrual-cycle assumption used in last-period dating.",
    },
    {
      term: "Calendar months elapsed",
      definition:
        "Completed calendar months and remaining days from your pregnancy dating start. Months have 28–31 days. Each month is anchored to the starting day, or the last day when a shorter month has no matching date. This counts elapsed time, not time since conception.",
    },
    {
      term: "Gestational age",
      definition:
        "How far along a pregnancy is, counted in completed weeks and days from the first day of the last menstrual period. It is not the time since conception.",
    },
    {
      term: "Weeks and days",
      definition:
        "The number of full weeks, plus the remaining days. For example, 22 weeks and 3 days means 157 days of gestational age.",
    },
    {
      term: "Last menstrual period (LMP)",
      definition:
        "The first day of your last period. Artemis adds 280 days to this date to estimate a due date, assuming a 28-day cycle.",
    },
    {
      term: "Estimated due date (EDD)",
      definition:
        "The date a pregnancy reaches 40 weeks. It is an estimate of timing, not a prediction of the exact day a baby will arrive.",
    },
    {
      term: "Trimester",
      definition:
        "One of three stages of pregnancy. This app uses weeks 0–13 for the first, 14–27 for the second, and week 28 onward for the third.",
    },
    {
      term: "Dating scan",
      definition:
        "An ultrasound used to estimate how far along a pregnancy is. If your doctor or midwife gives you a revised due date, enter it in Pregnancy details.",
    },
  ];
</script>

<section class="card glossary-intro">
  <span class="icon-badge"><Icon name="book" size={24} /></span>
  <div>
    <h2>Understand your dates</h2>
    <p class="muted">A quick guide to the terms on your dashboard.</p>
    <p class="glossary-formula">
      Completed weeks × 7 + remaining days = gestational age in days
    </p>
  </div>
</section>
<div class="glossary-grid">
  {#each terms as entry}<article class="card glossary-card">
      <h2>{entry.term}</h2>
      <p class="muted">{entry.definition}</p>
    </article>{/each}
</div>
<p class="glossary-note">
  Learn more from <a
    href="https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/"
    target="_blank"
    rel="noreferrer">NHS pregnancy dating</a
  >
  and
  <a
    href="https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy"
    target="_blank"
    rel="noreferrer">ACOG’s pregnancy guide</a
  >. Your doctor or midwife can confirm your dates.
</p>
