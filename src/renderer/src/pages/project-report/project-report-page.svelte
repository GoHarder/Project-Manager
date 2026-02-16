<script lang="ts">
  import { onMount } from 'svelte';

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Elevation } from '@moss/comp/elevation';
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';

  import { Page, ErrorSt } from '../../components/index';

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

  /**
   * Creates a price string from a number
   * @param price The price to format
   */
  function priceString(price: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return formatter.format(price);
  }

  // MARK: State
  // -----------------------------------------------------------------------------
  let report = $state<App.ProjectReport>({
    thisWeek: { monday: '', projects: [], total: { USD: 0, CAD: 0 } },
    lastWeek: { monday: '', projects: [], total: { USD: 0, CAD: 0 } },
  });

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
  function copyTable(projects: App.ProjectDoc[]) {
    const lines = projects.map((project) => {
      const { completed, contractNo, customerName, price, user, currency } =
        project;
      return `${dateString(completed)}\t${priceString(price)} ${currency}\t${contractNo}\t${customerName}\t${user}`;
    });

    const text = lines.join('\n');

    navigator.clipboard.writeText(text);
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(async () => {
    const res = await window.api.projects.getReport();

    if (!res.success) {
      ErrorSt.data = res.error;
      return;
    }

    res.data.lastWeek.projects.map((row) => {
      row.user = row.user.replace(/@.*$/, '');
      return row;
    });

    res.data.thisWeek.projects.map((row) => {
      row.user = row.user.replace(/@.*$/, '');
      return row;
    });

    report = res.data;
  });
</script>

<svelte:head>
  <title>Project Manager - Project report</title>
</svelte:head>

{#snippet slot_headline()}
  <IconButton tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>Project report</h1>
{/snippet}

{#snippet tableRow(project: App.ProjectDoc)}
  <tr>
    <td>{dateString(project.completed)}</td>
    <td>{project.contractNo}</td>
    <td>{project.customerName}</td>
    <td>{project.user}</td>
    <td>{priceString(project.price)}</td>
    <td>{project.currency}</td>
  </tr>
{/snippet}

{#snippet reportTable(section: App.ProjectReport['thisWeek' | 'lastWeek'])}
  <!-- {#if section.projects.length > 0} -->
  <div class="elevated-card">
    <Elevation />
    <table>
      <caption>
        <span class="caption">
          Week of {dateString(section.monday)}
          <IconButton
            tooltip="Copy table"
            onclick={() => {
              copyTable(section.projects);
            }}
          >
            <Icon>backup_table</Icon>
          </IconButton>
        </span>
      </caption>
      <thead>
        <tr>
          <th>Date</th>
          <th>Contract</th>
          <th>Customer</th>
          <th>Engineer</th>
          <th>Price</th>
          <th>Units </th>
        </tr>
      </thead>
      <tbody>
        {#each section.projects as project (project._id)}
          {@render tableRow(project)}
        {/each}
      </tbody>
      <tfoot>
        {#if section.total.USD}
          <tr>
            <th class="total" scope="row" colspan="4">Total: </th>
            <th>{priceString(section.total.USD)}</th>
            <th>USD</th>
          </tr>
        {/if}
        {#if section.total.CAD}
          <tr>
            <th class="total" scope="row" colspan="4">Total: </th>
            <th>{priceString(section.total.CAD)}</th>
            <th>CAD</th>
          </tr>
        {/if}
      </tfoot>
    </table>
  </div>
  <!-- {/if} -->
{/snippet}

<Page {slot_headline}>
  <div class="tables">
    {@render reportTable(report.lastWeek)}
    {@render reportTable(report.thisWeek)}
  </div>
</Page>

<style lang="scss">
  @use '../../assets//scss//mixin';

  .tables {
    --grid-max-col-qty: 2;
    --grid-gap: 8px;
    --grid-min-col-width: 500px;

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

    table {
      width: 100%;
      border-collapse: collapse;
    }

    .caption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      @include mixin.text-style('title-medium');
    }

    th {
      text-align: left;
      @include mixin.text-style('title-small');
    }

    th,
    td {
      padding-block: 6px;
    }
    .total {
      text-align: right;
    }
  }
</style>
