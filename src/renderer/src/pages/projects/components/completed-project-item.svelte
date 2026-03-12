<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    project: App.ProjectDoc;
    onEmail?: () => void;
    setPage: (page: string) => void;
  };

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { IconButton } from '@moss/comp/icon-button';
  import { Icon } from '@moss/comp/icon';
  import { ListItem } from '@moss/comp/list';
  import { Menu, MenuItem, SubMenu } from '@moss/comp/menu';

  import { ProjectSt } from '../../../components/index';
  import { clipContractNo, clipDrawingTitle, clipEmailSubject } from './lib';

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { onEmail, setPage, project }: Props = $props();

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let menuOpen = $state(false);

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let canada = $derived(project.currency === 'CAD' ? 'canada' : '');

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onCopy() {
    ProjectSt.setData(project);
    setPage('copy-project');
  }

  function onEdit() {
    ProjectSt.setData(project);
    setPage('edit-project');
  }

  function onOpen() {
    window.api.fs.openProjectFolder(project.contractNo);
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
        <Icon data-slot="end">bookmark_manager</Icon>
      </MenuItem>
      <MenuItem onclick={onCopy}>
        <div data-slot="headline">Copy</div>
        <Icon data-slot="end">folder_copy</Icon>
      </MenuItem>
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
      <MenuItem onclick={() => clipDrawingTitle(project)}>
        <div data-slot="headline">Drawing title</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
      <MenuItem onclick={() => clipEmailSubject(project)}>
        <div data-slot="headline">Email subject</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
      <MenuItem onclick={() => clipContractNo(project)}>
        <div data-slot="headline">Contract number</div>
        <Icon data-slot="end">text_snippet</Icon>
      </MenuItem>
    </Menu>
  </SubMenu>
{/snippet}

<ListItem class={{ 'canada-project': canada }}>
  <Icon data-slot="start">folder_check</Icon>
  <div data-slot="headline">{project.contractNo} {project.customerName}</div>

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
