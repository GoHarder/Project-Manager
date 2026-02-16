<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  import { type Snippet } from 'svelte';
  import { type Attachment } from 'svelte/attachments';

  type Props = {
    slot_headline: Snippet;
    children: Snippet;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Elevation } from '@moss/comp/elevation';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { children, slot_headline }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  const attachment: Attachment = (node) => {
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      node.removeEventListener('scroll', onScroll);
    };
  };

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let raised = $state(false);

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
  function onScroll(event: Event) {
    if (!(event.target instanceof HTMLDivElement)) return;
    raised = event.target.scrollTop > 80;
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<div class={{ 'app-bar': true, raised }}>
  <Elevation />
  {@render slot_headline()}
</div>

<div class="scroll" {@attach attachment}>
  {@render children()}
</div>

<style lang="scss">
  @use '../assets/scss/mixin';

  .app-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 64px;

    gap: 8px;
    padding-inline: 4px;
    --md-elevation-level: 0;
    background-color: var(--md-sys-color-surface);

    transition-duration: 200ms;
    transition-timing-function: ease-in-out;

    &.raised {
      --md-elevation-level: 2;
      background-color: var(--md-sys-color-surface-container);
    }

    :global(h1) {
      @include mixin.text-style('title-large');
    }
  }

  .scroll {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 64px);
    padding-inline: 12px;
  }
</style>
