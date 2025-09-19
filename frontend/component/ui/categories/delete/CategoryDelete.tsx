import React, {useActionState, useMemo, useRef} from 'react';
import {FaExclamationTriangle, FaTrash} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {ActionResult, deleteCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {Category} from "@/lib/type/api";
import {useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import {useActionToast} from "@/hook/useActionToast";

export default function CategoryDelete({
  data
}:{
  data:Category;
}) {
  const modalId = `delete-category-${data.id}`;
  const formId = `delete-category-form-${data.id}`;


  const [state, formAction, isPending] = useActionState<ActionResult,FormData>(deleteCategory, { ok: false, message: "" });

  const toastOpts = useMemo(() => ({
    success: {
      title: "Deleted",
      // kalau mau, kirim deskripsi sukses statis/ambil dari result
      description: (r: ActionResult) => r.message,
    },
    error: { title: "Delete failed" },
  }), []);

  useActionToast(state, isPending, toastOpts);

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  useActionModalAutoClose({
    modalId,
    state,
    pending: isPending,
    formRef,
    resetOnClose: true,
    closeDelayMs: 0,
  });


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
      <Modal.Body action={formAction} formId={formId} formRef={formRef}>
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
