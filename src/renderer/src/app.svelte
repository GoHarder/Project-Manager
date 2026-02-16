<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';

  // MARK: Types
  // -----------------------------------------------------------------------------
  // MARK: Components
  // -----------------------------------------------------------------------------
  import EditProject from './pages/edit-project/edit-project-page.svelte';
  import NewProject from './pages/new-project/new-project-page.svelte';
  import ProjectReport from './pages/project-report/project-report-page.svelte';
  import Projects from './pages/projects/projects-page.svelte';
  import Settings from './pages/settings/settings-page.svelte';

  import { ErrorSt } from './components/index';

  import { Button } from '@moss/comp/button';
  import { Dialog } from '@moss/comp/dialog';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  // MARK: Globals
  // -----------------------------------------------------------------------------
  const pageMap = new SvelteMap([
    ['edit-project', EditProject],
    ['new-project', NewProject],
    ['project-report', ProjectReport],
    ['projects', Projects],
    ['settings', Settings],
  ]);

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let pageName = $state('projects');

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let Page = $derived(pageMap.get(pageName));
  let dialogOpen = $state(false);
  let error = $state<App.MainError['error']>();

  // MARK: Effects
  // -----------------------------------------------------------------------------
  $effect(() => {
    if (!ErrorSt.data) return;
    error = ErrorSt.data;
    dialogOpen = true;
  });

  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function setPage(update: string) {
    pageName = update;
  }

  window.api.listen.error((update) => {
    if (!update) return;
    error = update.error;
    dialogOpen = true;
  });

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<Dialog bind:open={dialogOpen}>
  <div data-slot="headline">{error?.name || 'Unknown Error'}</div>

  <div data-slot="content">
    {#if error?.code}
      <p>Code: {error.code}</p>
    {/if}
    <p>{error?.message || 'Unknown Error'}</p>
  </div>
  <div data-slot="actions">
    <Button onclick={() => (dialogOpen = false)}>Ok</Button>
  </div>
</Dialog>

<Page {setPage} />
