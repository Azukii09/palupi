// components/toast/useActionToast.ts
"use client";
import { useEffect, useRef } from "react";
import { useToast } from "@/providers/context/ToastProvider";

/** Selector opsional agar hook ini bisa dipakai di state apa pun */
type Accessors<R> = {
  /** Cara membaca status sukses; default: (r as any).ok */
  getOk?: (r: R) => boolean;
  /**
   * Pesan default ketika error/success (dipakai jika opts.success/error.description tidak ada).
   * Default: jika gagal ambil _form[0] kalau ada; jika sukses undefined.
   */
  getMessage?: (r: R) => string | undefined;
};

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
  accessors?: Accessors<R>;
};

/**
 * Generic toast hook — tak mengasumsikan bentuk state.
 * Kamu beri selector getOk/getMessage supaya kompatibel dengan state apa pun.
 */
export function useActionToast<R>(
  result: R,
  pending: boolean,
  opts: Options<R>
) {
  const { showToast } = useToast();
  const requireSubmitStart = opts.requireSubmitStart ?? true;

  // selector dengan fallback super-permisif
  const getOk =
    opts.accessors?.getOk ??
    ((r: R) => (r as unknown as { ok?: boolean }).ok);

  const getMessage =
    opts.accessors?.getMessage ??
    ((r: R) => {
      // fallback generik (best effort): coba r['message'] dulu
      const m = (r as unknown as { message?: string }).message;
      return typeof m === "string" && m.length ? m : undefined;
    });

  // track transisi submit
  const prevPending = useRef<boolean>(pending);
  const didSubmitRef = useRef(false);      // submit dimulai?
  const shownForSubmitRef = useRef(false); // toast sudah ditembak untuk siklus ini?

  // deteksi start submit (false -> true)
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

    if (requireSubmitStart && !didSubmitRef.current) return;
    if (shownForSubmitRef.current) return;

    shownForSubmitRef.current = true;
    didSubmitRef.current = false;

    const ok = getOk(result);

    if (ok) {
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
        typeof e.description === "function"
          ? e.description(result)
          : e.description;

      const desc = descRaw ?? getMessage(result);

      if (!desc && !e.title) return; // tidak ada konten untuk ditampilkan

      showToast({
        title: e.title ?? "Failed",
        description: desc,
        variant: "error",
        duration: e.duration ?? 4500,
      });
    }
  }, [
    pending,
    result, // aman: selector yang menentukan apa yg dibaca
    requireSubmitStart,
    opts.success.title,
    opts.success.description,
    opts.success.duration,
    opts.error?.title,
    opts.error?.description,
    opts.error?.duration,
    getOk,
    getMessage,
    showToast,
  ]);
}
