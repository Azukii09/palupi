import React, {useActionState, useEffect} from 'react';
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
  const { closeModal } = useModal();
  const modalId = `delet-category-${id}`;
  const formId = `delete-category-form-${id}`;

  const [state, formAction, isPending] = useActionState<ActionResult,FormData>(deleteCategory, { ok: false, message: "" });


  useEffect(() => {
    if (state.ok) {
      closeModal(modalId);
    }
  }, [state.ok, closeModal, modalId]);

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
        btnText={"Delete"}
        btnName={"delete"}
        btnVariantType={"solid"}
        btnSize={"sm"}
        formId={formId}
      >
        Delete Category
      </Modal.Footer>
    </Modal>
  );
}
