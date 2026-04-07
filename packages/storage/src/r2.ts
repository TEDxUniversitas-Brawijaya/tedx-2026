import type { R2Bucket } from "@cloudflare/workers-types";

type ObjectMetadata = {
  key: string;
  etag: string;
  uploaded: Date;
  size: number;
};

type ObjectContent = ObjectMetadata & {
  arrayBuffer(): Promise<ArrayBuffer>;
  bytes(): Promise<Uint8Array>;
  arrayBuffer(): Promise<ArrayBuffer>;
  bytes(): Promise<Uint8Array<ArrayBufferLike>>;
};

type ListOptions = {
  limit?: number | undefined;
  prefix?: string | undefined;
  cursor?: string | undefined;
  delimiter?: string | undefined;
  startAfter?: string | undefined;
};

type ListResponse = {
  objects: ObjectMetadata[];
  delimitedPrefixes: string[];
} & (
  | {
      truncated: true;
      cursor: string;
    }
  | {
      truncated: false;
    }
);

export type R2 = {
  head: (key: string) => Promise<ObjectMetadata | null>;
  get: (key: string) => Promise<ObjectContent | null>;
  put: (key: string, value: ArrayBuffer) => Promise<ObjectMetadata | null>;
  delete: (keys: string | string[]) => Promise<void>;
  list(options?: ListOptions): Promise<ListResponse>;
};

export const createR2 = (r2: R2Bucket): R2 => ({
  head: async (key) => await r2.head(key),
  get: async (key) => await r2.get(key),
  put: async (key, value) => await r2.put(key, value),
  delete: async (keys) => await r2.delete(keys),
  list: async (options) => await r2.list(options),
});

export type R2BucketType = R2Bucket;
