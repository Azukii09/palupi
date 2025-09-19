'use client'
import React, {useActionState, useEffect, useRef} from 'react';
import {HiOutlinePencilAlt} from "react-icons/hi";
import Modal from "@/component/util/base/Modal";
import {useModal} from "@/providers/context/ModalContext";
import {updateCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {ActionResult} from "next/dist/server/app-render/types";
import {Category} from "@/lib/type/api";

export default function CategoryEdit({
  data,
}:{
  data:Category;
}) {

  const {modals, closeModal } = useModal();
  const modalId = `demo-create-category-${data.id}`;
  const formId = `edit-category-form-${data.id}`;
  const isOpen = modals[modalId];

  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(updateCategory, { ok:false, message:"" });


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
      btnVariant="warning"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText="Edit Category"
      btnSize="sm"
      btnIcon={<HiOutlinePencilAlt className={"size-4"}/>}
      btnOnlyIcon
      btnBadge
      formId={formId}
    >
      <Modal.Header>Edit Category</Modal.Header>

      <Modal.Body formId={formId} action={formAction}>
        {/* name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-1 text-start"
        >
          Category Name
        </label>
        <input type="hidden" name="id" value={data.id} />
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={data.name}
          placeholder="e.g. Beverages"
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
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
          Edit Category
        </span>
      </Modal.Footer>
    </Modal>
  );
}
