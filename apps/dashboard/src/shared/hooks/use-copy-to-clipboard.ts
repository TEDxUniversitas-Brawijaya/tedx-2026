"use client";

import { tryCatch } from "@tedx-2026/utils";
import { useCallback, useEffect, useRef, useState } from "react";

type UseCopyToClipboardOptions = {
  timeout?: number;
};

export const useCopyToClipboard = (
  opts?: UseCopyToClipboardOptions
): [string | null, (value: string) => void] => {
  const { timeout = 2000 } = opts || {};
  const [state, setState] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = useCallback(
    async (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard API not supported");
      }

      const { error } = await tryCatch(navigator.clipboard.writeText(value));
      setState(value);

      if (error) {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setState(null);
      }, timeout);
    },
    [timeout]
  );

  return [state, copyToClipboard];
};
