import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  email: {
    get: (project, options) => ipcRenderer.send('get:email', project, options),
  },
  fs: {
    openFolder: (path: string) => ipcRenderer.send('get:fs-folder-open', path),
    openProjectFolder: (contractNo: string) =>
      ipcRenderer.send('get:fs-folder-open-project', contractNo),
    searchFolder: (contractNo: string) =>
      ipcRenderer.invoke('get:fs-folder-search', contractNo),
  },
  listen: {
    error: (cb) => ipcRenderer.on('send:error', (_event, update) => cb(update)),
    projects: (cb) =>
      ipcRenderer.on('send:projects', (_event, update) => cb(update)),
  },
  projects: {
    post: (project) => ipcRenderer.send('post:projects', project),
    postCopy: (contractNo, project) =>
      ipcRenderer.send('post:projects-copy', contractNo, project),
    get: () => ipcRenderer.send('get:projects'),
    getReport: () => ipcRenderer.invoke('get:projects-report'),
    put: (project) => ipcRenderer.send('put:projects', project),
    delete: (contractNo: string) =>
      ipcRenderer.send('delete:projects', contractNo),
  },
  settings: {
    get: () => ipcRenderer.invoke('get:settings'),
    put: (update: App.Settings) => ipcRenderer.send('put:settings', update),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
