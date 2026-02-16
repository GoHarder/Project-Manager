// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path';
import {
  access,
  cp,
  mkdir,
  readdir,
  readFile as nReadFile,
  rm,
  writeFile as nWriteFile,
} from 'node:fs/promises';
// - Local
import { handleError } from './error';

// MARK: Types
// -----------------------------------------------------------------------------
import { type PathLike, type CopyOptions } from 'node:fs';

// MARK: Library
// -----------------------------------------------------------------------------
/**
 * Asynchronously copies the entire directory structure from `src` to `dest`,
 * including subdirectories and files.
 * @param source Source path to copy.
 * @param destination Destination path to copy to.
 * @param opts Optional modifiers that specify the behavior of the copy operation.
 */
export async function copyDir(
  source: string | URL,
  destination: string | URL,
  opts?: CopyOptions,
) {
  try {
    await cp(source, destination, opts);
    return { success: true as const };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Deletes a directory and all of its contents recursively
 * @param path The path to the directory
 */
export async function deleteDir(path: PathLike) {
  try {
    await rm(path, { recursive: true, force: true });
    return { success: true as const };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Checks if a directory entry exists
 * @param path The path to check
 */
export async function dirEntryExists(path: PathLike) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the project directory
 * @param contractNo The contract number of the project
 */
export async function findProjectPath(contractNo: string) {
  const dir = getProjectDir(contractNo);
  const readRes = await readDir(dir);

  if (!readRes.success) return readRes;

  const folder = readRes.data.find((file) => file.startsWith(contractNo));

  if (!folder) {
    return {
      success: false as const,
      error: {
        name: 'Not found',
        message: `Couldn't find folder starting with ${contractNo}`,
      },
    };
  }

  return { success: true as const, data: join(dir, folder) };
}

/**
 * Gets the project base directory
 * @param contractNo The contract number of the project
 */
export function getProjectDir(contractNo: string) {
  const root = 'R:\\ENGINEERING JOBS_FINAL';
  const dir1 = contractNo.replace(/\d{4}$/, 'xxxx');
  const dir2 = contractNo.replace(/\d{3}$/, 'xxx');
  return join(root, dir1, dir2);
}

/**
 * Asynchronously creates a new directory
 * @param path The path to the new directory
 */
export async function makeDir(path: PathLike) {
  try {
    await mkdir(path, { recursive: true });
    return { success: true as const };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Asynchronously reads the names of the entries in a directory.
 * @param path The path to the directory
 */
export async function readDir(path: PathLike) {
  try {
    const data = await readdir(path);
    return { success: true as const, data };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Asynchronously reads the entire contents of a file.
 * @param path The path to the file
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export async function readFile(
  path: PathLike,
  options: BufferEncoding,
): Promise<App.MainError | { success: true; data: string }>;
export async function readFile(
  path: PathLike,
  options?: BufferEncoding,
): Promise<
  App.MainError | { success: true; data: string | Buffer<ArrayBuffer> }
> {
  try {
    const data = await nReadFile(path, options);
    return { success: true as const, data };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Asynchronously reads the entire contents of a JSON file.
 * @param path The path to the file
 */
export async function readJsonFile<Data>(
  path: PathLike,
): Promise<App.MainError | { success: true; data: Data }> {
  try {
    const readRes = await readFile(path, 'utf8');
    if (!readRes.success) return readRes;
    const data = JSON.parse(readRes.data) as Data;
    return { success: true as const, data };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * @param path The path to the file
 * @param data The data to write into the file
 */
export async function writeFile(path: PathLike, data: string) {
  try {
    await nWriteFile(path, data);
    return { success: true as const };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Asynchronously writes data to a JSON file, replacing the file if it already exists.
 * @param path The path to the file
 * @param data The data to stringify and write
 */
export async function writeJsonFile<Data = any>(path: PathLike, data: Data) {
  try {
    const str = JSON.stringify(data, null, 2);
    return await writeFile(path, str);
  } catch (error) {
    return handleError(error);
  }
}
