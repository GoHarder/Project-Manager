// MARK: Imports
// -----------------------------------------------------------------------------
// - NPM
import { ipcMain, shell } from 'electron';
// - Local
import { findProjectPath } from '../lib/file-system';

// MARK: Types
// -----------------------------------------------------------------------------
import { type IpcMainEvent } from 'electron';

// MARK: Handlers
// -----------------------------------------------------------------------------
async function openFolder(event: IpcMainEvent, contractNo: string) {
  const projectDir = await findProjectPath(contractNo);

  if (!projectDir.success) {
    event.reply('send:error', projectDir.error);
    return;
  }

  shell.openPath(projectDir.data);
}

async function searchFolder(_event, contractNo: string) {
  const projectDir = await findProjectPath(contractNo);

  if (!projectDir.success) return projectDir;

  shell.openPath(projectDir.data);

  return { success: true as const, data: '' };
}

// MARK: Library
// -----------------------------------------------------------------------------
export default function () {
  ipcMain.handle('get:fs-folder-search', searchFolder);
  ipcMain.on('get:fs-folder-open', openFolder);
}
