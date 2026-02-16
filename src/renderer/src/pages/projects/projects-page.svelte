<script lang="ts">
  import { onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import z from 'zod';

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button';
  import { Checkbox } from '@moss/comp/checkbox';
  import { Dialog } from '@moss/comp/dialog';
  import { Divider } from '@moss/comp/divider';
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { List } from '@moss/comp/list';
  import { Menu, MenuItem } from '@moss/comp/menu';
  import { TextField } from '@moss/comp/text-field';

  import { Page, ErrorSt } from '../../components/index';
  import { ProjectItem } from './components/index';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  const dialogMap = new SvelteMap([
    ['email', emailDialog],
    ['delete', deleteDialog],
  ]);

  const searchSchema = z.string().min(6);

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let projects = $state<App.ProjectDoc[]>([]);
  let selected = $state<App.ProjectDoc>();
  let menuOpen = $state(false);

  let dialogName = $state('delete');
  let dialogOpen = $state(false);

  let customerDrawings = $state(false);
  let orderChange = $state(false);
  let hasSheave = $state(false);
  let changes = $state<string>('');

  let searchOpen = $state(false);
  let search = $state<string>();

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let completedProjects = $derived(
    projects.filter((project) => project.completed !== null),
  );

  let liveProjects = $derived(
    projects.filter((project) => project.completed === null),
  );

  let validSearch = $derived(searchSchema.safeParse(search).success);

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onDelete() {
    dialogOpen = false;
    const snap = $state.snapshot(selected);
    window.api.projects.delete(snap.contractNo);
  }

  async function onSearch() {
    const result = await window.api.fs.searchFolder(search);
    if (!result.success) {
      ErrorSt.data = result.error;
      return;
    }
    search = undefined;
    searchOpen = false;
  }

  function promptDialog(name: string, contractNo: string) {
    selected = projects.find((project) => project.contractNo === contractNo);
    dialogName = name;
    dialogOpen = true;
  }

  function onEmail() {
    dialogOpen = false;
    const snap = $state.snapshot(selected);
    window.api.email.get(snap, {
      customerDrawings,
      orderChange,
      hasSheave,
      changes,
    });
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  // TODO: 2-05-2026 10:51 AM
  // Every time you load this component it adds another event listener
  // NOTE: This may only happen when in development mode
  window.api.listen.projects((update) => {
    projects = update;
  });

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(() => {
    if (projects.length === 0) window.api.projects.get();
  });
</script>

{#snippet deleteDialog()}
  <Dialog bind:open={dialogOpen}>
    <div data-slot="headline">Delete project?</div>

    <div data-slot="content">
      <p>
        {selected?.contractNo}
        {selected?.customerName} will be deleted.
      </p>
    </div>

    <div data-slot="actions">
      <Button onclick={() => (dialogOpen = false)}>Cancel</Button>
      <Button onclick={onDelete}>Delete</Button>
    </div>
  </Dialog>
{/snippet}

{#snippet emailDialog()}
  <Dialog bind:open={dialogOpen}>
    <div data-slot="headline">New Email</div>

    <form data-slot="content" id="email-form" method="dialog">
      <Divider />
      <div class="option">
        <Checkbox id="cust-dwg" bind:checked={customerDrawings} />
        <label for="cust-dwg">Customer drawings</label>
      </div>
      <div class="option">
        <Checkbox id="order-chng" bind:checked={orderChange} />
        <label for="order-chng">Order changes</label>
      </div>
      <div class="option">
        <Checkbox
          id="has-sheave"
          bind:checked={hasSheave}
          disabled={customerDrawings}
        />
        <label for="has-sheave">Traction sheave</label>
      </div>
      <Divider />

      {#if orderChange}
        <div class="changes">
          <TextField
            bind:value={changes}
            style="resize: vertical"
            label="Changes"
            type="textarea"
            rows={5}
            cols={80}
          />
        </div>
        <Divider />
      {/if}
    </form>

    <div data-slot="actions">
      <Button form="email-form">Cancel</Button>
      <Button form="email-form" onclick={onEmail}>Ok</Button>
    </div>
  </Dialog>
{/snippet}

<svelte:head>
  <title>Project Manager - Projects</title>
</svelte:head>

{@render dialogMap.get(dialogName)()}

{#snippet slot_headline()}
  {#if searchOpen}
    <IconButton tooltip="Back" onclick={() => (searchOpen = false)}>
      <Icon>arrow_back</Icon>
    </IconButton>
    <TextField bind:value={search} placeholder="Search contract" type="search">
      <IconButton
        onclick={onSearch}
        tooltip="Search"
        data-slot="trailing-icon"
        disabled={!validSearch}
      >
        <Icon>search</Icon>
      </IconButton>
    </TextField>
  {:else}
    <span style="position: relative">
      <IconButton id="main-menu" tooltip="Menu" onclick={toggleMenu}>
        <Icon>menu</Icon>
      </IconButton>
      <Menu anchor="main-menu" bind:open={menuOpen}>
        <MenuItem onclick={() => setPage('new-project')}>
          <div data-slot="headline">New project</div>
          <Icon data-slot="start">create_new_folder</Icon>
        </MenuItem>
        <MenuItem onclick={() => setPage('project-report')}>
          <div data-slot="headline">Project report</div>
          <Icon data-slot="start">table</Icon>
        </MenuItem>
        <MenuItem onclick={() => setPage('settings')}>
          <div data-slot="headline">Settings</div>
          <Icon data-slot="start">settings</Icon>
        </MenuItem>
        <Divider role="separator" tabindex="-1" />
        <MenuItem>
          <div data-slot="headline">Exit</div>
          <Icon data-slot="start">close</Icon>
        </MenuItem>
      </Menu>
    </span>
    <h1>Projects</h1>
    <IconButton
      tooltip="Search projects"
      style="margin-inline-start: auto"
      onclick={() => (searchOpen = true)}
    >
      <Icon>search</Icon>
    </IconButton>
  {/if}
{/snippet}

<Page {slot_headline}>
  <div class="cards">
    <div class="card">
      <h2>Live projects</h2>
      <List>
        {#each liveProjects as project (project._id)}
          <ProjectItem
            {project}
            {setPage}
            can-complete
            onDelete={() => promptDialog('delete', project.contractNo)}
            onEmail={() => promptDialog('email', project.contractNo)}
          />
        {/each}
      </List>
    </div>
    <div class="card">
      <h2>Completed projects</h2>
      <List>
        {#each completedProjects as project (project._id)}
          <ProjectItem
            {project}
            {setPage}
            onEmail={() => promptDialog('email', project.contractNo)}
          />
        {/each}
      </List>
    </div>
  </div>
</Page>

<style lang="scss">
  @use '../../assets/scss/mixin';
  .cards {
    --grid-max-col-qty: 2;
    --grid-gap: 8px;
    --grid-min-col-width: 400px;

    --grid-col-width-calc: calc(
      (100% - var(--grid-gap) * var(--grid-max-col-qty)) /
        var(--grid-max-col-qty)
    );
    --grid-col-min-size-calc: min(
      100%,
      max(var(--grid-min-col-width), var(--grid-col-width-calc))
    );

    display: grid;
    gap: var(--grid-gap);
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--grid-col-min-size-calc), 1fr)
    );
  }

  .card {
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-medium);
    border-color: var(--md-sys-color-outline-variant);
    border-width: 1px;
    border-style: solid;
    padding-block: 12px;

    h2 {
      @include mixin.text-style('title-medium');
      margin-block: 0;
      padding-inline: 16px;
    }
  }

  .option {
    display: grid;
    align-items: center;
    justify-items: center;
    min-width: 512px;

    grid-template-columns: 40px 1fr;
    height: 40px;

    label {
      justify-self: start;
    }
  }

  .changes {
    margin-block: 12px;
  }
</style>
