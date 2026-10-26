import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { firebaseStorage } from './firebase';

// Keep in sync with the size limit in `storage.rules`.
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const CONTENT_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  m4v: 'video/x-m4v',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  wav: 'audio/wav',
  caf: 'audio/x-caf',
  aif: 'audio/aiff',
  aiff: 'audio/aiff',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  heic: 'image/heic',
  webp: 'image/webp',
};

function extensionOf(uri: string): string {
  const clean = uri.split('?')[0].split('#')[0];
  const dot = clean.lastIndexOf('.');
  return dot === -1 ? '' : clean.slice(dot + 1).toLowerCase();
}

export class UploadTooLargeError extends Error {
  constructor(bytes: number) {
    super(`This file is ${Math.round(bytes / 1024 / 1024)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
  }
}

export class UnsupportedFileError extends Error {
  constructor(ext: string) {
    super(ext ? `.${ext} files aren’t supported. Try an MP4, MOV, MP3, M4A, WAV, JPG or PNG.` : 'Unrecognized file type.');
  }
}

/**
 * Uploads a local file (`file://…` from the image/document pickers) to
 * Firebase Storage under `storagePathWithoutExt` and returns its public
 * download URL, which is what gets saved on the Firestore doc.
 */
export async function uploadLocalFile(
  localUri: string,
  storagePathWithoutExt: string,
  onProgress?: (fraction: number) => void,
): Promise<string> {
  const ext = extensionOf(localUri);
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    throw new UnsupportedFileError(ext);
  }

  const blob = await (await fetch(localUri)).blob();
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new UploadTooLargeError(blob.size);
  }

  const storageRef = ref(firebaseStorage(), `${storagePathWithoutExt}.${ext}`);
  const task = uploadBytesResumable(storageRef, blob, { contentType });

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0),
      reject,
      () => resolve(),
    );
  });

  return getDownloadURL(task.snapshot.ref);
}
