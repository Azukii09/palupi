// hooks/useActionModalAutoClose.ts
"use client";

import React, { useEffect, useRef } from "react";
import { useModal } from "@/providers/context/ModalContext";

// Samakan dengan tipe hasil action kamu
export type ActionResult = { ok: true,message:string,data?:unknown } | { ok: false; message: string };

type Params = {
  modalId: string;
  state: ActionResult;
  pending: boolean;
  formRef?: React.RefObject<HTMLFormElement | null>;
  resetOnClose?: boolean;   // default: true
  closeDelayMs?: number;    // default: 0 (langsung tutup)
};

export function useActionModalAutoClose({
  modalId,
  state,
  pending,
  formRef,
  resetOnClose = true,
  closeDelayMs = 0,
}: Params) {
  const { modals, closeModal } = useModal();
  const isOpen = modals[modalId];

  // guard: menandai submit terakhir & mencegah close berulang
  const didSubmitRef = useRef(false);
  const hasClosedRef = useRef(false);

  // tandai ketika submit dimulai
  useEffect(() => {
    if (pending) didSubmitRef.current = true;
  }, [pending]);

  // reset guard saat modal ditutup / dibuka kembali
  useEffect(() => {
    if (!isOpen) {
      didSubmitRef.current = false;
      hasClosedRef.current = false;
    }
  }, [isOpen]);

  // tutup modal sekali setelah submit sukses
  useEffect(() => {
    const shouldClose =
      isOpen &&                 // hanya kalau modal sedang terbuka
      !pending &&               // request sudah selesai
      state.ok &&               // action sukses
      didSubmitRef.current &&   // memang dari submit terakhir
      !hasClosedRef.current;    // belum pernah ditutup di siklus ini

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
  }, [isOpen, pending, state.ok, resetOnClose, closeDelayMs, closeModal, modalId, formRef]);
}
