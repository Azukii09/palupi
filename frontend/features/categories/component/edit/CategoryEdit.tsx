'use client'
import React, {useActionState, useCallback, useEffect, useMemo, useRef} from 'react';
import {HiOutlinePencilAlt} from "react-icons/hi";
import Modal from "@/component/util/base/Modal";
import { updateCategory} from "@/features/categories/actions/actions";
import {useActionToast} from "@/hook/useActionToast";
import Switch from "@/component/util/base/Switch";
import {useTranslations} from "next-intl";
import {categoryUpdateInitial, CategoryUpdateState} from "@/features/categories/state/categoryInitialState";
import {Category} from "@/features/categories/services/category.type";
import {useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import {useRouter} from "next/navigation";

export default function CategoryEdit({
  data,
}:{
  data:Category;
}) {
  const router = useRouter();
  const tCategory = useTranslations('Category')

  const modalId = `demo-create-category-${data.id}`;
  const formId = `edit-category-form-${data.id}`;

  const [state, formAction, isPending] = useActionState<CategoryUpdateState, FormData>(
    updateCategory,
    categoryUpdateInitial
    );

  // selector STABIL (tak bergantung apa pun)
  const getOk = useCallback((s: CategoryUpdateState) => s.ok, []);
  const getMessage = useCallback(
    (s: CategoryUpdateState) => (s.ok ? s.data?.message : s.errors?._form?.[0]),
    []
  );

// objekt opsi STABIL; hanya berubah saat tCategory berubah
  const toastOpts = useMemo(
    () => ({
      success: {
        title: tCategory("edit.updateTitle"),
        description: (s: CategoryUpdateState) => (s.ok ? s.data.message : undefined),
        duration: 5000,
      },
      error: {
        title: tCategory("edit.errorTitle"),
        description: (s: CategoryUpdateState) => (!s.ok ? s.errors?._form?.[0] : undefined),
        duration: 5000,
      },
      accessors: { getOk, getMessage },
      requireSubmitStart: true,
    }),
    [tCategory, getOk, getMessage]
  );

// pakai seperti biasa
  useActionToast<CategoryUpdateState>(state, isPending, toastOpts);

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  useActionModalAutoClose(
    {
      modalId,
      state,
      pending: isPending,
      formRef,
      resetOnClose: true,
      closeDelayMs: 0,
    }
  )

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
      <Modal.Header>{tCategory('edit.title')}</Modal.Header>

      <Modal.Body formId={formId} action={formAction} formRef={formRef}>
        {/* name */}
        <div className={"flex flex-col gap-1 mb-3 items-start justify-start"}>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1 text-start"
          >
            {tCategory('fields.name')}
          </label>
          <input type="hidden" name="id" value={data.id} />
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={data.name}
            placeholder={tCategory('form.phName')}
            className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          {state.errors?.name?.[0] && (
            <p className="text-sm text-danger">{tCategory(state.errors?.name[0])}</p>
          )}
        </div>

        {/* description */}
        <div className={"flex flex-col gap-1 mb-3 items-start justify-start"}>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-primary mb-1 text-start"
          >
            {tCategory('fields.description')}
          </label>
          <input type="hidden" name="id" value={data.id} />
          <input
            id="description"
            name="description"
            type="text"
            defaultValue={data.description}
            placeholder="e.g. Beverages"
            className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
            required
          />

          {state.errors?.description?.[0] && (
            <p className="text-sm text-danger">{tCategory(state.errors?.description[0])}</p>
          )}
        </div>

        {/* status */}
        <div className={"flex flex-col gap-1 items-start justify-start"}>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-primary mb-1"
          >
            {tCategory('fields.status')}
          </label>
          <Switch name={"status"} defaultChecked={false} value={"true"} checked={data.status}/>
          <input type="hidden" name="status" value="false" />

          {state.errors?.status?.[0] && (
            <p className="text-sm text-danger">{tCategory(state.errors?.status[0])}</p>
          )}
        </div>
      </Modal.Body>

      {/* onClose di-inject otomatis */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText={isPending ? tCategory('edit.saving') : tCategory('edit.save')}
        btnSize="sm"
        formId={formId}
        disable={isPending}
      >
        <span className="text-xs text-primary/70 text-start">
          {tCategory('edit.footer')}
        </span>
      </Modal.Footer>
    </Modal>
  );
}
