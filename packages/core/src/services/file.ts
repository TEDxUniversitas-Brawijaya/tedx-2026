import type { R2, R2Folder } from "@tedx-2026/storage";
import type { File } from "@tedx-2026/types";
import { AppError } from "../errors";
import type { BaseContext } from "../types/context";

export type FileServices = {
  getAllFiles: () => Promise<File[]>;
  getFile: (key: string) => Promise<File | null>;
  uploadFile: (
    fileName: string,
    body: ArrayBuffer,
    folder: R2Folder,
    options?: {
      maxSizeMB?: number;
    }
  ) => Promise<File>;
  deleteFile: (keys: string | string[]) => Promise<void>;
};

type CreateFileServiceCtx = {
  r2: R2;
  CDN_DOMAIN: string;
} & BaseContext;

export const createFileService = (ctx: CreateFileServiceCtx): FileServices => ({
  getAllFiles: async () => {
    const listResponse = await ctx.r2.list();
    return listResponse.objects.map((obj) => ({
      key: obj.key,
      url: getFileURL(ctx.CDN_DOMAIN, obj.key),
      etag: obj.etag,
      size: obj.size,
      uploadedAt: obj.uploaded,
    }));
  },
  getFile: async (key) => {
    const obj = await ctx.r2.get(key);
    if (!obj) {
      return null;
    }

    return {
      key: obj.key,
      url: getFileURL(ctx.CDN_DOMAIN, obj.key),
      etag: obj.etag,
      size: obj.size,
      uploadedAt: obj.uploaded,
    };
  },
  uploadFile: async (fileName, body, folder, options) => {
    const {
      maxSizeMB = 5, // Default max size is 5 MB
    } = options || {};
    // Ensure filename does not contain path traversal characters
    if (fileName.includes("..") || fileName.includes("/")) {
      throw new AppError("BAD_REQUEST", "Invalid file name", {
        details: { fileName },
      });
    }

    if (body.byteLength > maxSizeMB * 1024 * 1024) {
      throw new AppError(
        "PAYLOAD_TOO_LARGE",
        `File size exceeds ${maxSizeMB} MB`,
        {
          details: { fileName, size: body.byteLength },
        }
      );
    }

    const key = `${folder}/${fileName}`;
    const result = await ctx.r2.put(key, body);
    if (!result) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Failed to upload file", {
        details: { key },
      });
    }

    return {
      key: result.key,
      url: getFileURL(ctx.CDN_DOMAIN, result.key),
      etag: result.etag,
      size: result.size,
      uploadedAt: result.uploaded,
    };
  },
  deleteFile: async (keys) => {
    await ctx.r2.delete(keys);
  },
});

// Helpers
const getFileURL = (domain: string, key: string) => {
  return `https://${domain}/${key}`;
};
