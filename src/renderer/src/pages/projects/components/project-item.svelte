<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    project: App.ProjectDoc;
    'can-complete'?: boolean;
    onEmail?: () => void;
    onDelete?: () => void;
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Divider } from '@moss/comp/divider';
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { ListItem } from '@moss/comp/list';
  import { Menu, MenuItem, SubMenu } from '@moss/comp/menu';

  import { ProjectSt } from '../../../components/index';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let {
    onEmail,
    onDelete,
    setPage,
    'can-complete': canComplete = false,
    project,
  }: Props = $props();

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

  // MARK: State
  // -----------------------------------------------------------------------------
  let menuOpen = $state(false);

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let iconText = $derived(project.completed ? 'folder_check' : 'folder');

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function clipContractNo() {
    navigator.clipboard.writeText(project.contractNo);
  }

  function clipEmailSubject() {
    navigator.clipboard.writeText(
      `${project.customerName} PO ${project.poNo} - HW ${project.contractNo}`,
    );
  }

  function clipDrawingTitle() {
    navigator.clipboard.writeText(
      `${project.customerName} - ${project.contractNo} QTY: 0`.toUpperCase(),
    );
  }

  function onComplete() {
    project.completed = new Date().toISOString();
    const snap = $state.snapshot(project);
    window.api.projects.put(snap);
  }

  function onEdit() {
    ProjectSt.data = project;
    setPage('edit-project');
  }

  function onOpen() {
    window.api.fs.openFolder(project.contractNo);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

{#snippet projectMenu()}
  <MenuItem onclick={onOpen}>
    <div data-slot="headline">Open folder</div>
    <Icon data-slot="end">folder_open</Icon>
  </MenuItem>
  <MenuItem onclick={onEmail}>
    <div data-slot="headline">New email</div>
    <Icon data-slot="end">email</Icon>
  </MenuItem>
{/snippet}

{#snippet editMenu()}
  <SubMenu>
    <MenuItem data-slot="item">
      <div data-slot="headline">Edit</div>
      <Icon data-slot="end">arrow_right</Icon>
    </MenuItem>
    <Menu data-slot="menu">
      <MenuItem onclick={onEdit}>
        <div data-slot="headline">Properties</div>
        <Icon data-slot="end">edit</Icon>
      </MenuItem>
      <MenuItem disabled>
        <div data-slot="headline">Copy</div>
        <Icon data-slot="end">folder_copy</Icon>
      </MenuItem>
      {#if canComplete}
        <MenuItem onclick={onComplete}>
          <div data-slot="headline">Complete</div>
          <Icon data-slot="end">folder_check</Icon>
        </MenuItem>
      {/if}
      {#if onDelete}
        <Divider role="separator" tabindex="-1" />
        <MenuItem onclick={onDelete}>
          <div data-slot="headline">Delete</div>
          <Icon data-slot="end">folder_delete</Icon>
        </MenuItem>
      {/if}
    </Menu>
  </SubMenu>
{/snippet}

{#snippet clipboardMenu()}
  <SubMenu>
    <MenuItem data-slot="item">
      <div data-slot="headline">Clipboard</div>
      <Icon data-slot="end">arrow_right</Icon>
    </MenuItem>
    <Menu data-slot="menu">
      <MenuItem onclick={clipDrawingTitle}>
        <div data-slot="headline">Drawing title</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
      <MenuItem onclick={clipEmailSubject}>
        <div data-slot="headline">Email subject</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
      <MenuItem onclick={clipContractNo}>
        <div data-slot="headline">Contract number</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
    </Menu>
  </SubMenu>
{/snippet}

<ListItem>
  <Icon data-slot="start">{iconText}</Icon>
  <div data-slot="headline">{project.contractNo} {project.customerName}</div>

  {#if !project.completed}
    <div data-slot="supporting-text">Created {dateString(project.created)}</div>
  {/if}

  <span data-slot="end" style="position: relative">
    <IconButton
      id="button-{project.contractNo}"
      tooltip="Menu"
      onclick={toggleMenu}
    >
      <Icon>more_vert</Icon>
    </IconButton>
    <Menu
      anchor="button-{project.contractNo}"
      bind:open={menuOpen}
      anchor-corner="start-end"
      menu-corner="end-end"
    >
      {@render projectMenu()}
      {@render editMenu()}
      {@render clipboardMenu()}
    </Menu>
  </span>
</ListItem>

<!-- <style lang="scss">
</style> -->
