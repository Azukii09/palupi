import React, {useActionState, useCallback, useEffect, useMemo, useRef} from 'react';
import {FaExclamationTriangle, FaTrash} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import { deleteCategory} from "@/features/categories/actions/actions";
import {useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import {useActionToast} from "@/hook/useActionToast";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Category} from "@/features/categories/services/category.type";
import {categoryDeleteInitial, CategoryDeleteState} from "@/features/categories/state/categoryInitialState";

export default function CategoryDelete({
  data
}:{
  data:Category;
}) {
  const tCategory = useTranslations('Category')
  const modalId = `delete-category-${data.id}`;
  const formId = `delete-category-form-${data.id}`;

  const router = useRouter();


  const [state, formAction, isPending] = useActionState<CategoryDeleteState,FormData>(
    deleteCategory,
    categoryDeleteInitial
    );

  // selector STABIL (tak bergantung apa pun)
  const getOk = useCallback((s: CategoryDeleteState) => s.ok, []);
  const getMessage = useCallback(
    (s: CategoryDeleteState) => (s.ok ? s.data?.message : s.errors?._form?.[0]),
    []
  );

// objekt opsi STABIL; hanya berubah saat tCategory berubah
  const toastOpts = useMemo(
    () => ({
      success: {
        title: tCategory("create.addTitle"),
        description: (s: CategoryDeleteState) => (s.ok ? s.data.message : undefined),
        duration: 5000,
      },
      error: {
        title: tCategory("create.errorTitle"),
        description: (s: CategoryDeleteState) => (!s.ok ? s.errors?._form?.[0] : undefined),
        duration: 5000,
      },
      accessors: { getOk, getMessage },
      requireSubmitStart: true,
    }),
    [tCategory, getOk, getMessage]
  );

// pakai seperti biasa
  useActionToast<CategoryDeleteState>(state, isPending, toastOpts);

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  useActionModalAutoClose({
    modalId,
    state,
    pending: isPending,
    formRef,
    resetOnClose: true,
    closeDelayMs: 150,
  });

  // Setelah sukses: tembak toast via event+queue, lalu refresh data
  useEffect(() => {
    if (isPending) return;
    if (!state.ok) return;
    // refresh data setelah modal sempat close
    const t = setTimeout(() => {
      router.refresh();
    }, 160); // > closeDelayMs
    return () => clearTimeout(t);
  }, [isPending, state.ok, router]);


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
        {tCategory('delete.title')}
      </Modal.Header>
      <Modal.Body action={formAction} formId={formId} formRef={formRef}>
        <div className={"flex flex-col gap-2 items-center justify-center"}>
          <input type="hidden" name="id" value={data.id} />
          <input type="hidden" name="name" value={data.name} />
          <FaExclamationTriangle className={"size-16 text-danger"}/>
          <p className="text-primary text-center font-medium">
            {tCategory('delete.message')}
            <span className="font-bold block mt-1 text-danger text-lg">{`"${data.name}"`}</span>
            {tCategory('delete.message2')}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer
        btnVariant={"danger"}
        btnText={isPending ? tCategory('delete.deleting') : tCategory('delete.delete')}
        btnName={"delete"}
        btnVariantType={"solid"}
        btnSize={"sm"}
        formId={formId}
        disable={isPending}
      >
        {tCategory('delete.footer')}
      </Modal.Footer>
    </Modal>
  );
}
