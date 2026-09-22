import type { TPaymentEntryImageKey } from '~/constants/payment';
import { userSessionStore } from '~/store/user-session-store';
import { getEnv } from '~/utils/env';

export interface IUploadFileResult {
  path: string;
  size: number;
  mime: string;
}

export interface IUploadFileOptions {
  path?: string;
  type?: 'imgRect' | 'imgWide' | 'imgVert' | TPaymentEntryImageKey;
  lang?: string;
}

export interface IImageFileEntry {
  key: string;
  value: string;
  file?: File;
}

export interface IUseFileUploadResult {
  uploadFile: (file: File, options?: IUploadFileOptions) => Promise<IUploadFileResult>;
  uploadImageFiles: (
    folderPath: string,
    imageFiles: IImageFileEntry[]
  ) => Promise<Record<string, string>>;
}

const EMPTY_RESULT: IUploadFileResult = { path: '', size: 0, mime: '' };

const isUploadFileResult = (value: unknown): value is IUploadFileResult =>
  typeof value === 'object' && value !== null && typeof Reflect.get(value, 'path') === 'string';

const uploadFile = async (file: File, options?: IUploadFileOptions): Promise<IUploadFileResult> => {
  const { token } = userSessionStore.state;
  const { mgtBaseUrl } = getEnv();
  const formData = new FormData();

  formData.append('file', file);
  if (options?.type) formData.append('type', options.type);
  if (options?.lang) formData.append('lang', options.lang);

  try {
    const response = await fetch(`${mgtBaseUrl}/${options?.path ?? ''}`, {
      method: 'POST',
      body: formData,
      headers: { ...(token && { Authorization: `Bearer ${token}` }) }
    });
    const data: unknown = await response.json();

    return isUploadFileResult(data) ? data : EMPTY_RESULT;
  } catch {
    return EMPTY_RESULT;
  }
};

/**
 * Uploads every entry that carries a file and keeps the stored path of the
 * others, keyed by entry key.
 */
const uploadImageFiles = async (
  folderPath: string,
  imageFiles: IImageFileEntry[]
): Promise<Record<string, string>> => {
  const image: Record<string, string> = {};

  for (const { key, value, file } of imageFiles) {
    if (file) {
      const { path } = await uploadFile(file, { path: folderPath });
      image[key] = path;
    } else {
      image[key] = value;
    }
  }

  return image;
};

export const useFileUpload = (): IUseFileUploadResult => ({ uploadFile, uploadImageFiles });
