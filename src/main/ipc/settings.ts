// MARK: Imports
// -----------------------------------------------------------------------------
// - NPM
import { ipcMain } from 'electron';
// - Local
import { load, userDataPath } from '../app/settings';
import { readJsonFile, writeJsonFile } from '../lib/file-system';

// MARK: Types
// -----------------------------------------------------------------------------
import { type IpcMainEvent } from 'electron';

// MARK: Handlers
// -----------------------------------------------------------------------------
async function getSettings() {
  const readRes = await readJsonFile<App.Settings>(userDataPath);
  if (!readRes.success) return readRes;

  for (const key in readRes.data) {
    if (readRes.data[key] !== null) continue;
    readRes.data[key] = '';
  }

  return readRes;
}

async function putSettings(event: IpcMainEvent, update: App.Settings) {
  const writeRes = await writeJsonFile<App.Settings>(userDataPath, update);
  if (!writeRes.success) {
    event.reply('send:error', writeRes.error);
    return;
  }

  const loadRes = await load();
  if (!loadRes.success) event.reply('send:error', loadRes.error);
}

// MARK: Library
// -----------------------------------------------------------------------------
export default function () {
  ipcMain.handle('get:settings', getSettings);
  ipcMain.on('put:settings', putSettings);
}
