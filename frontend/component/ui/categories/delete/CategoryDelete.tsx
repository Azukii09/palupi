import React, {useActionState, useEffect, useRef} from 'react';
import {FaExclamationTriangle, FaTrash} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {ActionResult} from "next/dist/server/app-render/types";
import { deleteCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {useModal} from "@/providers/context/ModalContext";
import {Category} from "@/lib/type/api";

export default function CategoryDelete({
  data
}:{
  data:Category;
}) {
  const {modals, closeModal } = useModal();
  const modalId = `delet-category-${data.id}`;
  const formId = `delete-category-form-${data.id}`;
  const isOpen = modals[modalId];


  const [state, formAction, isPending] = useActionState<ActionResult,FormData>(deleteCategory, { ok: false, message: "" });


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
      btnVariant={"danger"}
      btnName={`delete-${data.id}`}
      btnText={`Delete`}
      btnSize={"xs"}
      btnBadge
      btnOnlyIcon
      btnIcon={<FaTrash className={"size-4"}/>}
      formId={formId}
      lockClose={isPending}
    >
      <Modal.Header>
        Delete Category
      </Modal.Header>
      <Modal.Body action={formAction} formId={formId}>
        <div className={"flex flex-col gap-2 items-center justify-center"}>
          <input type="hidden" name="id" value={data.id} />
          <FaExclamationTriangle className={"size-16 text-danger"}/>
          <p className="text-primary text-center font-medium">
            Are you sure you want to delete category
            <span className="font-bold block mt-1 text-danger text-lg">{`"${data.name}"`}</span>
            This action cannot be undone.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer
        btnVariant={"danger"}
        btnText={isPending ? "Deleting..." : "Delete"}
        btnName={"delete"}
        btnVariantType={"solid"}
        btnSize={"sm"}
        formId={formId}
        disable={isPending}
      >
        Delete Category
      </Modal.Footer>
    </Modal>
  );
}
