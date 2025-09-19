"use client";
import React, {useActionState, useEffect, useRef} from "react";
import Modal from "@/component/util/base/Modal";
import { useModal } from "@/providers/context/ModalContext";
import {useTranslations} from "next-intl";
import {ActionResult} from "next/dist/server/app-render/types";
import {createCategory} from "@/app/[locale]/(admin)/master/categories/actions";

export default function CategoryCreate() {
  const { modals, closeModal } = useModal();
  const modalId = "demo-create-category";
  const formId = "create-category-form";
  const isOpen = modals[modalId];

  const tCategory = useTranslations('Category')

  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(createCategory, { ok: false, message: "" });


  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const didSubmitRef = useRef(false);
  const hasClosedRef = useRef(false);

  // Tandai ketika submit dimulai
  useEffect(() => {
    if (isPending) didSubmitRef.current = true;
  }, [isPending]);

  // Reset guards saat modal ditutup / dibuka lagi
  useEffect(() => {
    if (!isOpen) {
      didSubmitRef.current = false;
      hasClosedRef.current = false;
    }
  }, [isOpen]);

  // Tutup modal sekali setelah submit sukses
  useEffect(() => {
    const shouldClose =
      isOpen &&                 // hanya saat modal terbuka
      !isPending &&             // request sudah selesai
      state.ok &&               // berhasil
      didSubmitRef.current &&   // memang hasil dari submit terakhir
      !hasClosedRef.current;    // belum pernah ditutup di siklus ini

    if (shouldClose) {
      hasClosedRef.current = true;
      didSubmitRef.current = false;
      formRef.current?.reset(); // opsional: bersihkan input
      closeModal(modalId);
    }
  }, [isOpen, isPending, state.ok, closeModal, modalId]);


  return (
    <Modal
      id={modalId}
      modalSize="sm"
      btnVariant="primary"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText="New Category"
      btnSize="sm"
      formId={formId}
      lockClose={isPending}
    >
      <Modal.Header>New Category</Modal.Header>

      <Modal.Body formId={formId} action={formAction}>
        {/* name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-1"
        >
          {tCategory('form.name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Beverages"
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        {!state.ok && "message" in state && state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}
      </Modal.Body>

      {/* onClose di-inject otomatis */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText={isPending ? "Saving..." : "Save"}
        btnSize="sm"
        formId={formId}
        disable={isPending}
      >
        <span className="text-xs text-primary/70">
          Create Category
        </span>
      </Modal.Footer>
    </Modal>
  );
}
