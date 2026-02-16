<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button';
  import { Checkbox } from '@moss/comp/checkbox';
  import { Elevation } from '@moss/comp/elevation';
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { Option, Select } from '@moss/comp/select';
  import { NumberField, TextField } from '@moss/comp/text-field';

  import { Page, ProjectSt } from '../../components/index';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  /**
   * Formats a data string
   * @param dateStr The string to format
   */
  function dateString(dateStr: string) {
    const formatter = new Intl.DateTimeFormat('en-US');
    const date = new Date(dateStr);
    try {
      return formatter.format(date);
    } catch (error) {
      return 'Invalid date';
    }
  }

  $inspect(ProjectSt.data);

  // MARK: State
  // -----------------------------------------------------------------------------
  // MARK: Derived
  // -----------------------------------------------------------------------------
  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    setTimeout(() => {
      const snap = $state.snapshot(ProjectSt.data);
      window.api.projects.put(snap);
      setPage('projects');
    }, 1000);
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<svelte:head>
  <title>Project Manager - Edit project {ProjectSt.data.contractNo}</title>
</svelte:head>

{#snippet dateSpan(label: string, date: string | undefined)}
  {#if date}
    <span>{label}:</span>
    <span>{dateString(date)}</span>
  {/if}
{/snippet}

{#snippet slot_headline()}
  <IconButton id="main-menu" tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>Edit project</h1>
{/snippet}

<Page {slot_headline}>
  <div class="cards">
    <div class="elevated-card">
      <Elevation />
      <form {onsubmit}>
        <TextField
          label="Contract number"
          value={ProjectSt.data.contractNo}
          readonly
        />
        <TextField
          label="Customer name"
          bind:value={ProjectSt.data.customerName}
        />
        <TextField
          label="Purchase order number"
          bind:value={ProjectSt.data.poNo}
        />
        <NumberField
          label="Price"
          bind:value={ProjectSt.data.price}
          prefix-text="$"
          min="0"
          step="0.01"
        />
        <TextField label="Work Email" bind:value={ProjectSt.data.user} />
        <Select label="Currency" bind:value={ProjectSt.data.currency}>
          <Option value="USD">USD</Option>
          <Option value="CAD">CAD</Option>
        </Select>
        <div class="option">
          <Checkbox id="bookmarked" bind:checked={ProjectSt.data.bookmarked} />
          <label for="bookmarked">Bookmarked</label>
        </div>
        <div class="actions">
          <Button variant="filled">
            <Icon data-slot="icon">save</Icon>
            Save
          </Button>
        </div>
      </form>
    </div>

    <div class="elevated-card data">
      <span>Properties</span><span></span>
      {@render dateSpan('Created', ProjectSt.data.created)}
      {@render dateSpan('Completed', ProjectSt.data.completed)}
      {@render dateSpan('Released', ProjectSt.data.released)}
    </div>
  </div>
</Page>

<style lang="scss">
  .elevated-card {
    max-width: 400px;
  }

  .cards {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
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

  .data {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(10, 20px);
    gap: 8px;
  }
</style>
