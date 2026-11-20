<script lang="ts">
  import { formatDate } from "../pregnancy";
  let {
    months28,
    calendarMonths,
    startDate,
  }: {
    months28: { months: number; days: number };
    calendarMonths: { months: number; days: number };
    startDate: string;
  } = $props();
</script>

<div class="month-comparison">
  <h3>Months elapsed</h3>
  <dl class="month-counts">
    <div>
      <dt>28-day months <span>(4 weeks each)</span></dt>
      <dd>
        {months28.months}
        {months28.months === 1 ? "month" : "months"}
        <span>{months28.days} {months28.days === 1 ? "day" : "days"}</span>
      </dd>
    </div>
    <div>
      <dt>Calendar months <span>(actual dates)</span></dt>
      <dd>
        {calendarMonths.months}
        {calendarMonths.months === 1 ? "month" : "months"}
        <span
          >{calendarMonths.days}
          {calendarMonths.days === 1 ? "day" : "days"}</span
        >
      </dd>
    </div>
  </dl>
  <details class="month-explanation">
    <summary>Why are these different?</summary>
    <div>
      <p>
        Some people treat a pregnancy “month” as 28 days because <a
          href="https://www.acog.org/womens-health/experts-and-stories/ask-acog/how-long-does-pregnancy-last"
          target="_blank"
          rel="noreferrer">healthcare providers track pregnancy in weeks</a
        >, and <strong>4 weeks × 7 days = 28 days</strong>. This is a counting
        shortcut.
      </p>
      <p>
        <strong>Calendar months have 28–31 days.</strong> For example, January 1 to
        February 1 is 1 calendar month, but 1 28-day month and 3 days. So 40 weeks
        equals 10 four-week blocks, rather than 10 calendar months.
      </p>
      <p>
        Both counts start from your pregnancy dating start, <strong
          >{formatDate(startDate)}</strong
        >. Calendar months use the same day of the month; if it doesn’t exist,
        they use the last day of that month. For example, January 31 to February
        28, 2026 counts as 1 calendar month.
      </p>
      <p>
        Weeks and days remain the main measure of gestational age. These month
        views do not change your estimated due date.
      </p>
    </div>
  </details>
</div>
