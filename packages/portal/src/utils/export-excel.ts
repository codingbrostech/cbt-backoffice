import { ApiError, formatApiErrorMessage } from '~/services/mgt';

const EXTENSION_BY_CONTENT_TYPE: Readonly<Record<string, string>> = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv',
  'application/zip': 'zip'
} as const;
const DEFAULT_EXPORT_EXTENSION = 'xlsx';

const DISPOSITION_FILENAME_PATTERN = /filename\*?=(?:utf-8'')?"?([^";]+)"?/i;
const FILE_EXTENSION_PATTERN = /\.([a-z0-9]+)$/i;

/**
 * trigger browser download from blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const buildDispositionExtension = (disposition: string | null): string | undefined => {
  const [, rawFilename] = DISPOSITION_FILENAME_PATTERN.exec(disposition ?? '') ?? [];
  const filename = rawFilename ? decodeURIComponent(rawFilename.trim()) : '';
  const [, extension] = FILE_EXTENSION_PATTERN.exec(filename) ?? [];

  return extension?.toLowerCase();
};

const buildContentTypeExtension = (contentType: string | null): string | undefined => {
  const [mediaType = ''] = (contentType ?? '').split(';');
  const normalizedMediaType = mediaType.trim().toLowerCase();

  return EXTENSION_BY_CONTENT_TYPE[normalizedMediaType];
};

/**
 * File extension (without the dot) for an export response. Reads
 * `Content-Disposition` first, then `Content-Type`, and falls back to
 * DEFAULT_EXPORT_EXTENSION when neither is recognised.
 */
export const buildExportExtension = (headers: Headers): string => {
  const dispositionExtension = buildDispositionExtension(headers.get('content-disposition'));
  const contentTypeExtension = buildContentTypeExtension(headers.get('content-type'));

  return dispositionExtension ?? contentTypeExtension ?? DEFAULT_EXPORT_EXTENSION;
};

/**
 * Message to show when an export request fails. Uses the API error text
 * when available, otherwise the given fallback.
 */
export const buildExportErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof ApiError ? formatApiErrorMessage(err) : fallback;
