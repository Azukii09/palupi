// components/toast/useActionToast.ts
"use client";
import { useEffect, useRef } from "react";
import { useToast } from "@/providers/context/ToastProvider";

// Result minimal yang didukung
export type ActionResultLike = { ok: boolean; message?: string };

type SuccessCfg<R> = {
  title: string;
  /** Deskripsi sukses: string statis atau diambil dari result */
  description?: string | ((r: R) => string | undefined);
  duration?: number; // default 3000
};

type ErrorCfg<R> = {
  title?: string;    // default "Failed"
  /** Deskripsi gagal: string statis atau dari result */
  description?: string | ((r: R) => string | undefined);
  duration?: number; // default 4500
};

type Options<R> = {
  success: SuccessCfg<R>;
  error?: ErrorCfg<R>;
};

/**
 * Menampilkan toast ketika aksi selesai (pending → false).
 * Dijamin hanya sekali per siklus submit.
 */
export function useActionToast<R extends ActionResultLike>(
  result: R,
  pending: boolean,
  opts: Options<R>
) {
  const { showToast } = useToast();

  // track siklus submit untuk cegah toast ganda
  const prevPending = useRef(pending);
  const cycle = useRef(0);
  const shownCycle = useRef<number | null>(null);

  // deteksi mulai submit (false -> true)
  useEffect(() => {
    if (pending && !prevPending.current) {
      cycle.current += 1;
      shownCycle.current = null;
    }
    prevPending.current = pending;
  }, [pending]);

  // tampilkan saat selesai
  useEffect(() => {
    if (pending) return;

    const currentCycle = cycle.current;
    if (shownCycle.current === currentCycle) return; // sudah tampil untuk siklus ini
    shownCycle.current = currentCycle;

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
      const errCfg = opts.error ?? {};
      const descRaw =
        typeof errCfg.description === "function"
          ? errCfg.description(result)
          : errCfg.description;

      const desc = descRaw ?? result.message;

      showToast({
        title: errCfg.title ?? "Failed",
        description: desc,
        variant: "error",
        duration: errCfg.duration ?? 4500,
      });
    }

    // Disarankan memoize `opts` di pemanggil agar stable.
    // Depend hanya pada primitif agar tidak memicu re-run tak perlu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pending,
    result.ok,
    result.message,
    opts.success.title,
    opts.success.duration,
    opts.success.description,
    opts.error?.title,
    opts.error?.duration,
    opts.error?.description,
    showToast,
  ]);
}
