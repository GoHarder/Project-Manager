import { extname, join } from 'node:path';
import { cp } from 'node:fs/promises';

const sandboxDir = join(import.meta.dirname, 'copy-test');

const src = join(sandboxDir, '625301 Metro Elevator');

const dest = join(sandboxDir, '625301 Metro Elevator Copy');

function filter(src: string, dest: string) {
  const ext = extname(src);
  const validExts = ['.pdf'];
  if (!ext) return true;
  return validExts.includes(ext);
}

try {
  const result = await cp(src, dest, { recursive: true, filter });
  console.log(result);
} catch (error) {
  console.log(error);
  process.exit(1);
}
