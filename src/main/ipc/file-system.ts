// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path';
// - NPM
import { ipcMain, shell } from 'electron';
// - Local
import {
  dirEntryExists,
  findProjectPath,
  readJsonFile,
} from '../lib/file-system';

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

  const dataPath = join(projectDir.data, 'data.json');
  const dataExists = await dirEntryExists(dataPath);

  if (!dataExists) return { success: true as const, data: { contractNo } };

  const readRes = await readJsonFile<App.ProjectDoc>(dataPath);

  if (!readRes.success) return readRes;

  return { success: true as const, data: readRes.data };
}

// MARK: Library
// -----------------------------------------------------------------------------
export default function () {
  ipcMain.handle('get:fs-folder-search', searchFolder);
  ipcMain.on('get:fs-folder-open', openFolder);
}
