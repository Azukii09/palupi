// hooks/useActionModalAutoClose.ts
"use client";

import React, { useEffect, useRef } from "react";
import { z } from "zod";
import { useModal } from "@/providers/context/ModalContext";
import {ActionResultFrom} from "@/lib/type/actionType";

type Accessors<S extends z.ZodTypeAny, D> = {
  /** Default: (s) => s.ok */
  getOk?: (s: ActionResultFrom<S, D>) => boolean;
};

type Params<S extends z.ZodTypeAny, D> = {
  modalId: string;
  state: ActionResultFrom<S, D>;
  pending: boolean;
  formRef?: React.RefObject<HTMLFormElement | null>;
  /**
   * default: true — reset form saat modal ditutup otomatis
   */
  resetOnClose?: boolean;
  /**
   * default: 0ms — tutup langsung; set >0 untuk delay
   */
  closeDelayMs?: number;
  /**
   * default: false — kalau true, modal juga ditutup saat gagal (ok === false)
   */
  closeOnError?: boolean;
  /**
   * Opsional selector agar hook ini kompatibel untuk semua bentuk state
   */
  accessors?: Accessors<S, D>;
  /**
   * default: true — hanya menutup bila siklus submit benar-benar dimulai
   * (yakni pernah melihat pending: false -> true)
   */
  requireSubmitStart?: boolean;
};

export function useActionModalAutoClose<S extends z.ZodTypeAny, D>({
                                                                     modalId,
                                                                     state,
                                                                     pending,
                                                                     formRef,
                                                                     resetOnClose = true,
                                                                     closeDelayMs = 0,
                                                                     closeOnError = false,
                                                                     accessors,
                                                                     requireSubmitStart = true,
                                                                   }: Params<S, D>) {
  const { modals, closeModal } = useModal();
  const isOpen = modals[modalId];

  const getOk =
    accessors?.getOk ?? ((s: ActionResultFrom<S, D>) => s.ok);

  // guard untuk 1 siklus submit
  const didSubmitRef = useRef(false); // pernah lihat false -> true?
  const hasClosedRef = useRef(false); // sudah menutup modal pada siklus ini?

  // tandai saat submit dimulai (false -> true)
  useEffect(() => {
    if (pending) didSubmitRef.current = true;
  }, [pending]);

  // reset guard saat modal ditutup/dibuka ulang
  useEffect(() => {
    if (!isOpen) {
      didSubmitRef.current = false;
      hasClosedRef.current = false;
    }
  }, [isOpen]);

  // Tutup modal sekali ketika request selesai
  useEffect(() => {
    if (!isOpen) return;
    if (pending) return;

    if (requireSubmitStart && !didSubmitRef.current) return;
    if (hasClosedRef.current) return;

    const ok = getOk(state);
    const shouldClose = ok || (closeOnError && !ok);
    if (!shouldClose) return;

    hasClosedRef.current = true;
    didSubmitRef.current = false;

    if (resetOnClose) formRef?.current?.reset();

    if (closeDelayMs > 0) {
      const t = window.setTimeout(() => closeModal(modalId), closeDelayMs);
      return () => window.clearTimeout(t);
    } else {
      closeModal(modalId);
    }
  }, [
    isOpen,
    pending,
    state,                 // tergantung state terbaru
    requireSubmitStart,
    closeOnError,
    resetOnClose,
    closeDelayMs,
    getOk,
    closeModal,
    modalId,
    formRef,
  ]);
}
