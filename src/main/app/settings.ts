// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path';
// - NPM
import { app } from 'electron';
// - Local
import {
  dirEntryExists,
  makeDir,
  readJsonFile,
  writeJsonFile,
} from '../lib/file-system';

// MARK: Helpers
// -----------------------------------------------------------------------------
/** Creates the user settings file if it doesn't exist */
async function initSettings() {
  // Check if the file exists
  const exists = await dirEntryExists(userDataPath);
  if (exists) return { success: true as const };

  const createdRes = await makeDir(app.getPath('userData'));
  if (!createdRes.success) return createdRes;

  const settings = {
    firstName: null,
    lastName: null,
    email: null,
    server: 'https://staging-hwcalc.vantage-link.com',
  };

  return await writeJsonFile(userDataPath, settings);
}

// MARK: Library
// -----------------------------------------------------------------------------
/**
 * The path to the user settings file\
 * C:\Users\<user>\AppData\Roaming\project-manager\user-settings.json
 */
export const userDataPath = join(app.getPath('userData'), 'user-settings.json');

/** Handles loading the setting for the application */
export async function init() {
  const initRes = await initSettings();
  if (!initRes.success) return initRes;
  return await load();
}

/** Loads the user settings file into the process environment */
export async function load() {
  const loadRes = await readJsonFile<App.Settings>(userDataPath);
  if (!loadRes.success) return loadRes;
  const { firstName, lastName, email, server } = loadRes.data;

  process.env.APP_SERVER = server;
  process.env.USER_EMAIL = email || '';
  process.env.USER_NAME = `${firstName || ''} ${lastName || ''}`;

  return { success: true as const };
}
