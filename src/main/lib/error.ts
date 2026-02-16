// MARK: Imports
// -----------------------------------------------------------------------------
import { isNativeError } from 'node:util/types';

// MARK: Types
// -----------------------------------------------------------------------------
interface SystemError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  path?: string;
  address?: string;
  port?: number;
}

// MARK: Helpers
// -----------------------------------------------------------------------------
/**
 * Verifies if the value is a SystemError
 * @param value The value to verify
 */
function isSystemError(value: unknown): value is SystemError {
  if (!isNativeError(value)) return false;
  const keys = ['code', 'errno', 'syscall'];
  return keys.every((key) => {
    const test1 = typeof value[key] === 'string';
    const test2 = typeof value[key] === 'number';
    return test1 || test2;
  });
}

// MARK: Library
// -----------------------------------------------------------------------------
export function handleError(value: unknown) {
  if (isSystemError(value) || isNativeError(value)) {
    return { success: false as const, error: value };
  }

  return {
    success: false as const,
    error: { name: 'UnknownError', message: String(value) },
  };
}
