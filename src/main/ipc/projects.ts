// MARK: Imports
// -----------------------------------------------------------------------------
import { join } from 'node:path';
// - NPM
import { ipcMain, net } from 'electron';
// - Local
import { handleError } from '../lib/error';
import {
  // copyDir,
  deleteDir,
  findProjectPath,
  getProjectDir,
  makeDir,
  writeJsonFile,
} from '../lib/file-system';

// MARK: Types
// -----------------------------------------------------------------------------
import { type IpcMainEvent } from 'electron';

// MARK: Helpers
// -----------------------------------------------------------------------------
/** Fetches the projects from the server */
async function fetchProjects() {
  const { APP_SERVER, USER_EMAIL } = process.env;
  let resBody: any;

  try {
    const res = await net.fetch(
      `${APP_SERVER}/api/contracts/eng/${USER_EMAIL}`,
    );

    if (res.body && res.status !== 204) resBody = await res.json();
    if (!res.ok) {
      return {
        success: false as const,
        error: {
          name: 'HTTPError',
          message: resBody.message || 'Unknown Error',
          code: `${res.status}`,
        },
      } satisfies App.MainError;
    }
  } catch (error) {
    return handleError(error);
  }

  return { success: true as const, data: resBody as App.ProjectDoc[] };
}

// MARK: Handlers
// -----------------------------------------------------------------------------
/**
 * Handles the `post:projects` IPC event
 * @param event An Electron IPC event
 * @param project The project to post
 */
async function postProject(event: IpcMainEvent, project: App.ProjectDoc) {
  const { APP_SERVER, USER_EMAIL } = process.env;
  const { contractNo, customerName, poNo, price, currency } = project;
  const baseDir = getProjectDir(contractNo);
  const dirName = `${contractNo} ${customerName}`;
  const reqBody = {
    customerName,
    contractNo,
    poNo,
    price,
    currency,
    user: USER_EMAIL,
  };

  let resBody: any;

  try {
    const res = await net.fetch(`${APP_SERVER}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (res.body && res.status !== 204) resBody = await res.json();
    if (!res.ok) {
      event.reply('send:error', {
        name: 'HTTPError',
        message: resBody.message || 'Unknown Error',
        code: `${res.status}`,
      });
      return;
    }
  } catch (error) {
    event.reply('send:error', handleError(error).error);
    return;
  }

  project = {
    ...project,
    bookmarked: false,
    completed: null,
    created: new Date().toISOString(),
    released: null,
  };

  const makeRes = await makeDir(join(baseDir, dirName));
  if (!makeRes.success) {
    event.reply('send:error', makeRes.error);
    return;
  }

  const writeRes = await writeJsonFile(
    join(baseDir, dirName, 'data.json'),
    project,
  );
  if (!writeRes.success) {
    event.reply('send:error', writeRes.error);
    return;
  }

  const fetchRes = await fetchProjects();
  if (!fetchRes.success) {
    event.reply('send:error', fetchRes.error);
    return;
  }

  event.reply('send:projects', fetchRes.data);
}

// async function postProjectCopy(event: IpcMainEvent, project: App.ProjectDoc) {}

/**
 * Handles the `get:projects` IPC event
 * @param event An Electron IPC event
 */
async function getProjects(event: IpcMainEvent) {
  const fetchRes = await fetchProjects();

  if (!fetchRes.success) {
    event.reply('send:error', fetchRes.error);
    return;
  }

  event.reply('send:projects', fetchRes.data);
}

/** Handles the `get:projects-report` IPC event */
async function getReport() {
  const { APP_SERVER } = process.env;
  let resBody: any;

  try {
    const res = await net.fetch(`${APP_SERVER}/api/contracts/report`);

    if (res.body && res.status !== 204) resBody = await res.json();
    if (!res.ok) {
      return {
        success: false as const,
        error: {
          name: 'HTTPError',
          message: resBody.message || 'Unknown Error',
          code: `${res.status}`,
        },
      } satisfies App.MainError;
    }
  } catch (error) {
    return handleError(error);
  }

  return { success: true as const, data: resBody as App.ProjectReport };
}

async function putProject(event: IpcMainEvent, update: App.ProjectDoc) {
  const { APP_SERVER } = process.env;
  let resBody: any;

  try {
    const res = await net.fetch(`${APP_SERVER}/api/contracts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });

    if (res.body && res.status !== 204) resBody = await res.json();
    if (!res.ok) {
      event.reply('send:error', {
        name: 'HTTPError',
        message: resBody.message || 'Unknown Error',
        code: `${res.status}`,
      });
      return;
    }
  } catch (error) {
    event.reply('send:error', handleError(error).error);
    return;
  }

  const findRes = await findProjectPath(update.contractNo);

  if (!findRes.success) {
    event.reply('send:error', findRes.error);
    return;
  }

  const writeRes = await writeJsonFile(join(findRes.data, 'data.json'), update);

  if (!writeRes.success) {
    event.reply('send:error', writeRes.error);
    return;
  }

  const fetchRes = await fetchProjects();
  if (!fetchRes.success) {
    event.reply('send:error', fetchRes.error);
    return;
  }

  event.reply('send:projects', fetchRes.data);
}

async function deleteProject(event: IpcMainEvent, contractNo: string) {
  const { APP_SERVER } = process.env;
  let resBody: any;

  try {
    const res = await net.fetch(
      `${APP_SERVER}/api/contracts/contract/${contractNo}`,
      { method: 'DELETE' },
    );
    if (res.body && res.status !== 204) resBody = await res.json();
    if (!res.ok) {
      event.reply('send:error', {
        name: 'HTTPError',
        message: resBody.message || 'Unknown Error',
        code: `${res.status}`,
      });
      return;
    }
  } catch (error) {
    event.reply('send:error', handleError(error).error);
    return;
  }

  const findRes = await findProjectPath(contractNo);

  if (!findRes.success) {
    event.reply('send:error', findRes.error);
    return;
  }

  const delRes = await deleteDir(findRes.data);

  if (!delRes.success) {
    event.reply('send:error', delRes.error);
    return;
  }

  const fetchRes = await fetchProjects();

  if (!fetchRes.success) {
    event.reply('send:error', fetchRes.error);
    return;
  }

  event.reply('send:projects', fetchRes.data);
}

// MARK: Library
// -----------------------------------------------------------------------------
export default function () {
  ipcMain.on('post:projects', postProject);
  ipcMain.on('get:projects', getProjects);
  ipcMain.handle('get:projects-report', getReport);
  ipcMain.on('put:projects', putProject);
  ipcMain.on('delete:projects', deleteProject);
}
