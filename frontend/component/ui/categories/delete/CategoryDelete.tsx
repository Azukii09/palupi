import React, {useActionState, useEffect, useRef} from 'react';
import {FaTrash} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {ActionResult} from "next/dist/server/app-render/types";
import { deleteCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {useModal} from "@/providers/context/ModalContext";

export default function CategoryDelete({
  id
}:{
  id:number;
}) {
  const {modals, closeModal } = useModal();
  const modalId = `delet-category-${id}`;
  const formId = `delete-category-form-${id}`;
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
      btnName={`delete-${id}`}
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
          <div className={"bg-rose-500 p-8 rounded-full"}>
            <input type="hidden" name="id" value={id} />
            <FaTrash className={"size-14 text-white"}/>
          </div>
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
