const KB = 1024;
const MB = KB * KB;
const GB = MB * KB;
const TB = GB * KB;

export const SIZE_UNITS = {
  KB,
  MB,
  GB,
  TB,
};

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes >= SIZE_UNITS.GB) {
    return `${(sizeInBytes / SIZE_UNITS.GB).toFixed(2)} GB`;
  }

  if (sizeInBytes >= SIZE_UNITS.MB) {
    return `${(sizeInBytes / SIZE_UNITS.MB).toFixed(2)} MB`;
  }

  if (sizeInBytes >= SIZE_UNITS.KB) {
    return `${(sizeInBytes / SIZE_UNITS.KB).toFixed(2)} KB`;
  }

  return `${sizeInBytes} B`;
}
