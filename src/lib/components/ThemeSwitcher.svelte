<script lang="ts">
  import { onMount } from "svelte";
  import {
    initTheme,
    readThemePreference,
    setTheme,
    type ThemePreference,
  } from "../theme";
  import Icon from "./Icon.svelte";
  let preference = $state<ThemePreference>("system");
  onMount(() => {
    const stop = initTheme();
    const sync = () => {
      try {
        preference = readThemePreference(localStorage);
      } catch {
        preference = "system";
      }
    };
    sync();
    window.addEventListener("storage", sync);
    return () => {
      stop();
      window.removeEventListener("storage", sync);
    };
  });
</script>

<label class="theme-switcher"
  ><Icon name="moon" size={17} /><select
    aria-label="Appearance"
    bind:value={preference}
    onchange={() => setTheme(preference)}
    ><option value="system">System</option><option value="light">Light</option
    ><option value="dark">Dark</option></select
  ></label
>
