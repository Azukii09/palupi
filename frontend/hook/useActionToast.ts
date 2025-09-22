// components/toast/useActionToast.ts
"use client";
import { useEffect, useRef } from "react";
import { useToast } from "@/providers/context/ToastProvider";

export type ActionResultLike = { ok: boolean; message?: string };

type SuccessCfg<R> = {
  title: string;
  description?: string | ((r: R) => string | undefined);
  duration?: number;
};

type ErrorCfg<R> = {
  title?: string;
  description?: string | ((r: R) => string | undefined);
  duration?: number;
};

type Options<R> = {
  success: SuccessCfg<R>;
  error?: ErrorCfg<R>;
  /** default: true → tidak menembak di mount awal */
  requireSubmitStart?: boolean;
};

export function useActionToast<R extends ActionResultLike>(
  result: R,
  pending: boolean,
  opts: Options<R>
) {
  const { showToast } = useToast();
  const requireSubmitStart = opts.requireSubmitStart ?? true;

  // track transisi submit
  const prevPending = useRef<boolean>(pending);
  const didSubmitRef = useRef(false);         // sudah melihat false -> true?
  const shownForSubmitRef = useRef(false);    // sudah tembak toast untuk submit ini?

  // deteksi mulai submit (false -> true)
  useEffect(() => {
    if (!prevPending.current && pending) {
      didSubmitRef.current = true;
      shownForSubmitRef.current = false;
    }
    prevPending.current = pending;
  }, [pending]);

  // tembak saat selesai (true -> false)
  useEffect(() => {
    if (pending) return;

    // jika diminta, jangan tembak kecuali submit sempat dimulai
    if (requireSubmitStart && !didSubmitRef.current) return;
    if (shownForSubmitRef.current) return;

    shownForSubmitRef.current = true;
    didSubmitRef.current = false;

    if (result.ok) {
      const desc =
        typeof opts.success.description === "function"
          ? opts.success.description(result)
          : opts.success.description;

      showToast({
        title: opts.success.title,
        description: desc,
        variant: "success",
        duration: opts.success.duration ?? 3000,
      });
    } else {
      const e = opts.error ?? {};
      const descRaw =
        typeof e.description === "function" ? e.description(result) : e.description;
      const desc = descRaw ?? result.message;

      // Kalau message kosong, boleh skip (opsional)
      if (!desc && !e.title) return;

      showToast({
        title: e.title ?? "Failed",
        description: desc,
        variant: "error",
        duration: e.duration ?? 4500,
      });
    }
  }, [
    pending,
    result.ok,
    result.message,
    requireSubmitStart,
    opts.success.title,
    opts.success.description,
    opts.success.duration,
    opts.error?.title,
    opts.error?.description,
    opts.error?.duration,
    showToast,
  ]);
}
