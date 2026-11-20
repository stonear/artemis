# Artemis

A simple, private pregnancy tracker built with SvelteKit and Bun. Set your dates once, then see your pregnancy age update day by day.

## Why Artemis?

Pregnancy comes with a lot of dates and unfamiliar words. Artemis gives you a calm place to see where you are, without an account or a daily check-in. The name reflects the app’s moon-inspired identity: a small companion for a changing journey.

## What is Artemis?

Artemis is a local-first pregnancy PWA. Enter the first day of your last period or an estimated due date from your doctor or midwife. The dashboard shows completed weeks and days, trimester, estimated due date, and time remaining. The figures are estimates for personal tracking.

## Run locally

Install Bun, then run:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the localhost URL printed by Vite. Use **Set up my pregnancy** to replace the labelled example with your own details. New date fields default to today; editing keeps your saved dates.

```sh
bun test
bun run check
bun run build
bun run preview
```

Production files are written to `build/`. The GitHub Pages workflow builds with the repository path and checks lint, formatting, types, tests, and the production build before deployment. In **Settings → Pages**, choose **GitHub Actions** as the publishing source. Push to `main` to publish; pull requests run checks without deploying.

## What you can do

- See pregnancy age in weeks and days, trimester, and estimated due date.
- Open a dated timeline of pregnancy milestones.
- Edit your dates and nickname; download or restore a validated JSON backup.
- Choose light, dark, or system appearance.
- Install the app, use it offline, and choose when to accept updates.
- Look up plain-language definitions in the glossary.

## Automatic progress

Progress recalculates on load, at local midnight, and when the app regains focus or visibility. Your device’s local calendar determines today. Daylight-saving changes do not add or subtract a day.

Last-period mode adds 280 days (40 weeks), assuming a 28-day cycle. Due-date mode counts back from your entered date. For example, 22 weeks and 3 days means 157 days of gestational age. Trimesters are weeks 0–13, 14–27, and 28 onward. Age keeps counting beyond the due date; the progress bar stops at 100%. The app does not assume a birth has occurred.

**Due dates are estimates.** For other cycle lengths or revised dating, use the estimated due date provided by your doctor or midwife. Artemis provides tracking, not medical advice. Read more from [NHS](https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/) and [ACOG](https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy).

## Your data

Settings are stored only in this browser under `artemis.pregnancy.v1`. There is no account, server database, analytics, or automatic cross-device synchronization. Clearing browser storage removes your details. The labelled example is never saved automatically. Appearance is stored separately under `artemis-theme`; **System** follows your device.

In **Pregnancy details**, download a backup before switching devices or clearing storage. Import validates the file before offering a replacement preview. Invalid backups leave current settings intact. Storage errors appear visibly; download a backup if saving fails. Backup files contain your nickname and pregnancy dates, so keep them private. Clearing personal details requires confirmation.

## PWA

Service workers require HTTPS or localhost. The production build caches application code, fonts, icons, and the shell. After the first online visit, allow installation to finish and reload once before using offline. Development mode does not cache the production shell.

On supported desktop and Android browsers, use **Install app**. On iPhone or iPad, open in Safari and choose **Share → Add to Home Screen**. The app shows offline status and prompts before activating a new version. Use **Update now** when ready.

The icon set includes light and dark blueprint artwork, an Apple touch icon, a maskable icon, and a transparent monochrome icon for supported tinted or pinned-icon surfaces. The favicon follows the app’s appearance. The header keeps the purple brand icon in both themes. Installed icon tinting is controlled by the browser and operating system; app appearance does not force a Home Screen tint. Monochrome icon hints follow the [Web App Manifest specification](https://www.w3.org/TR/appmanifest/#purpose-member).

To build under the GitHub Pages repository path:

```sh
GITHUB_PAGES=true GITHUB_REPOSITORY=stonear/artemis bun run build
```

## License

Artemis is licensed under the GNU General Public License, version 3 or later. See [LICENSE](LICENSE).

## Maintenance

`bun run check` validates Svelte and TypeScript. `bun test` covers calculations, storage, clock refresh, installation visibility, and themes. `bun run format` applies formatting; `bun run format:check` verifies it. The CI workflow uses Bun canary for its built-in `bun lint` command. The lockfile keeps dependency versions reproducible.

## Structure

- `src/lib/pregnancy.ts`: validation, dates, gestational age, and trimesters.
- `src/lib/storage.ts`: versioned settings and validated backups.
- `src/lib/clock.ts`: midnight and resume refresh.
- `src/lib/theme.ts`: light, dark, and system appearance.
- `src/lib/components/`: forms, progress ring, timeline, glossary, backups, and PWA controls.
- `src/routes/+page.svelte`: dashboard and navigation.
- `src/service-worker/`: offline shell caching and explicit update activation.
- `static/`: manifest and app icons.

Design and verification notes are in `docs/superpowers/`.
