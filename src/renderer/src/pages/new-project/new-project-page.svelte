<script lang="ts">
  // import z from 'zod';
  import { projectFormSchema } from '../../lib/zod-schema';

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button';
  import { Elevation } from '@moss/comp/elevation';
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { Option, Select } from '@moss/comp/select';
  import { NumberField, TextField } from '@moss/comp/text-field';

  import { Page } from '../../components/index';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let formEle = $state<HTMLFormElement>();

  let valid = $state(false);
  let customerName = $state<string>();
  let contractNo = $state<string>();
  let poNo = $state<string>();
  let price = $state<number>();
  let currency = $state<string>('USD');

  // MARK: Derived
  // -----------------------------------------------------------------------------
  // MARK: Effects
  // -----------------------------------------------------------------------------
  $effect(() => {
    const rawData = { customerName, contractNo, poNo, price, currency };
    valid = projectFormSchema.safeParse(rawData).success;
  });

  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onsubmit(event: SubmitEvent) {
    event.preventDefault();

    window.api.projects.post({
      customerName: customerName.trim(),
      contractNo: contractNo.trim(),
      poNo: poNo.trim(),
      price,
      currency,
    });

    formEle.reset();
    setPage('projects');
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<svelte:head>
  <title>Project Manager - New project</title>
</svelte:head>

{#snippet slot_headline()}
  <IconButton id="main-menu" tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>New project</h1>
{/snippet}

<Page {slot_headline}>
  <div class="elevated-card">
    <Elevation />
    <form bind:this={formEle} {onsubmit}>
      <TextField label="Customer name" bind:value={customerName} />
      <TextField label="Contract number" bind:value={contractNo} />
      <TextField label="Purchase order number" bind:value={poNo} />
      <NumberField
        label="Price"
        bind:value={price}
        prefix-text="$"
        min="0"
        step="0.01"
      />
      <Select label="Currency" bind:value={currency}>
        <Option value="USD">USD</Option>
        <Option value="CAD">CAD</Option>
      </Select>
      <div class="actions">
        <Button variant="filled" disabled={!valid}>
          <Icon data-slot="icon">create_new_folder</Icon>
          Create
        </Button>
      </div>
    </form>
  </div>
</Page>

<style lang="scss">
  .elevated-card {
    max-width: 400px;
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
</style>
