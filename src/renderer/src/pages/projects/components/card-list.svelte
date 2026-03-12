<script lang="ts">
  import { type Snippet } from 'svelte';

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    children: Snippet;
    label: string;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { List } from '@moss/comp/list';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { children, label }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let selected = $state(false);

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let tooltip = $derived(selected ? 'Expand' : 'Collapse');

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<div class="card">
  <div class="card-title">
    <h2>{label}</h2>
    <IconButton bind:selected toggle {tooltip}>
      <Icon>collapse_content</Icon>
      <Icon data-slot="selected">expand_content</Icon>
    </IconButton>
  </div>

  {#if !selected}
    <List>
      {@render children()}
    </List>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/scss/mixin';

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
    }
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 16px;
  }
</style>
