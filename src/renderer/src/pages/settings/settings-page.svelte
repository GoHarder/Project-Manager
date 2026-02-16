<script lang="ts">
  import { onMount } from 'svelte';
  import z from 'zod';

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
  import { TextField } from '@moss/comp/text-field';

  import { Page, ErrorSt } from '../../components/index';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  const formSchema = z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.email(),
    server: z.string().nonempty(),
  });

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let formEle = $state<HTMLFormElement>();

  let valid = $state(false);
  let firstName = $state<string>();
  let lastName = $state<string>();
  let email = $state<string>();
  let server = $state<string>();

  // MARK: Derived
  // -----------------------------------------------------------------------------
  $effect(() => {
    const rawData = { firstName, lastName, email, server };
    valid = formSchema.safeParse(rawData).success;
  });

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
    window.api.settings.put({ firstName, lastName, email, server });
    formEle.reset();
    setPage('projects');
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------

  onMount(async () => {
    const fetchRes = await window.api.settings.get();

    if (!fetchRes.success) {
      ErrorSt.data = fetchRes.error;
      return;
    }

    firstName = fetchRes.data.firstName;
    lastName = fetchRes.data.lastName;
    email = fetchRes.data.email;
    server = fetchRes.data.server;
  });
</script>

<svelte:head>
  <title>Project Manager - Settings</title>
</svelte:head>

{#snippet slot_headline()}
  <IconButton id="main-menu" tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>Settings</h1>
{/snippet}

<Page {slot_headline}>
  <div class="elevated-card">
    <Elevation />
    <form bind:this={formEle} {onsubmit}>
      <TextField label="First name" bind:value={firstName} />
      <TextField label="Last Name" bind:value={lastName} />
      <TextField label="Work email" bind:value={email} />
      <Select label="Server" bind:value={server}>
        <Option value="https://staging-hwcalc.vantage-link.com">
          Staging server
        </Option>
        <Option value="http://localhost:5000">Local host</Option>
      </Select>
      <div class="actions">
        <Button variant="filled" disabled={!valid}>
          <Icon data-slot="icon">save</Icon>
          Save
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
