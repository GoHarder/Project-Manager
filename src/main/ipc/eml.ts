// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path';
// - NPM
import { dialog, ipcMain } from 'electron';
import { findProjectPath, readFile, writeFile } from '../lib/file-system';

// MARK: Types
// -----------------------------------------------------------------------------
import { type IpcMainEvent } from 'electron';

// MARK: Globals
// -----------------------------------------------------------------------------
const boundary = '--boundary_area_0';

const templates = [
  {
    drawings: true,
    orderChange: true,
    hasSheave: false,
    file: 'dwgs-changes.html',
  },
  {
    drawings: false,
    orderChange: true,
    hasSheave: false,
    file: 'no-dwgs-changes.html',
  },
  {
    drawings: true,
    orderChange: false,
    hasSheave: false,
    file: 'dwgs-no-changes.html',
  },
  {
    drawings: false,
    orderChange: false,
    hasSheave: false,
    file: 'no-dwgs-no-changes.html',
  },
];

// MARK: Helpers
// -----------------------------------------------------------------------------
function createHeader(subject: string) {
  return (
    `Subject: ${subject}\n` +
    `X-Unsent: 1\n` +
    `Content-Type: multipart/mixed; boundary=${boundary}\n\n`
  );
}

async function loadHtml(template: string, changes: string) {
  const lines = changes.split('\n').map((line) => {
    return `<li><span class="bold">${line}</span></li>`;
  });
  const path = join(
    import.meta.dirname,
    '../../resources/email-templates',
    template,
  );
  const readRes = await readFile(path, 'utf8');

  if (!readRes.success) return readRes;

  readRes.data = readRes.data.replace('{changes}', lines.join('\n'));

  return {
    success: true as const,
    data: `--${boundary}\nContent-Type: text/html; charset=UTF-8\n\n${readRes.data}\n`,
  };
}

async function loadPdf(contractNo: string, defaultPath: string) {
  const res = await dialog.showOpenDialog({
    title: 'Select PDF attachments',
    defaultPath,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    properties: ['openFile', 'multiSelections'],
  });
  const errors: App.MainError[] = [];

  if (res.canceled) return { success: true as const, data: '' };

  let data = '';
  for (let i = 0; i < res.filePaths.length; i++) {
    const path = res.filePaths[i];
    const fileName = `Customer ${contractNo} dwgs ${i + 1}`;
    const readRes = await readFile(path, 'base64');

    if (!readRes.success) {
      errors.push(readRes);
      continue;
    }

    data +=
      `--${boundary}\n` +
      `Content-Type: application/pdf; name=${fileName}.pdf\n` +
      `Content-Transfer-Encoding: base64\n` +
      `Content-Disposition: attachment\n\n` +
      `${readRes.data}\n`;

    if (i + 1 !== res.filePaths.length) data += '\n';
  }

  if (errors.length > 0) return errors[0];

  return { success: true as const, data };
}

// MARK: Handlers
// -----------------------------------------------------------------------------
async function buildEml(
  event: IpcMainEvent,
  project: App.ProjectDoc,
  options: App.EmailOptions,
) {
  const { customerName, contractNo, poNo } = project;
  const { customerDrawings, orderChange, hasSheave, changes } = options;

  const findPath = await findProjectPath(contractNo);
  if (!findPath.success) {
    event.reply('send:error', findPath.error);
    return;
  }

  const subject = `${customerName} PO ${poNo} - HW ${contractNo}`;
  const end = `--${boundary}--`;
  const template = templates.find((row) => {
    if (row.drawings !== customerDrawings) return false;
    if (row.orderChange !== orderChange) return false;
    if (row.hasSheave !== hasSheave) return false;
    return true;
  });

  let emlData = createHeader(subject);

  if (!template) {
    event.reply('send:error', {
      name: 'Email error',
      message: 'Email template not found',
    });
    return;
  }

  const load1 = await loadHtml(template.file, changes);

  if (!load1.success) {
    event.reply('send:error', load1.error);
    return;
  }

  emlData += load1.data;

  if (options.customerDrawings) {
    const load2 = await loadPdf(contractNo, findPath.data);

    if (!load2.success) {
      event.reply('send:error', load2.error);
      return;
    }

    emlData += load2.data;
  }

  emlData += end;

  const writeRes = await writeFile(
    join(findPath.data, `${subject}.eml`),
    emlData,
  );

  if (!writeRes.success) {
    event.reply('send:error', writeRes.error);
    return;
  }
}

// MARK: Library
// -----------------------------------------------------------------------------
export default function () {
  ipcMain.on('get:email', buildEml);
}
