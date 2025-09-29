"use client";
import React, {useActionState, useCallback, useMemo, useRef} from "react";
import Modal from "@/component/util/base/Modal";
import {useTranslations} from "next-intl";
import { createCategory} from "@/features/categories/actions/actions";
import { useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import Switch from "@/component/util/base/Switch";
import {useActionToast} from "@/hook/useActionToast";
import {categoryCreateInitial, CategoryCreateState} from "@/features/categories/state/categoryInitialState";

export default function CategoryCreate() {
  const modalId = "demo-create-category";
  const formId = "create-category-form";

  const tCategory = useTranslations('Category')

  const [state, formAction, isPending] = useActionState<CategoryCreateState, FormData>(
    createCategory,
    categoryCreateInitial
    );

  // selector STABIL (tak bergantung apa pun)
  const getOk = useCallback((s: CategoryCreateState) => s.ok, []);
  const getMessage = useCallback(
    (s: CategoryCreateState) => (s.ok ? s.data?.message : s.errors?._form?.[0]),
    []
  );

// objekt opsi STABIL; hanya berubah saat tCategory berubah
  const toastOpts = useMemo(
    () => ({
      success: {
        title: tCategory("create.addTitle"),
        description: (s: CategoryCreateState) => (s.ok ? s.data.message : undefined),
        duration: 5000,
      },
      error: {
        title: tCategory("create.errorTitle"),
        description: (s: CategoryCreateState) => (!s.ok ? s.errors?._form?.[0] : undefined),
        duration: 5000,
      },
      accessors: { getOk, getMessage },
      requireSubmitStart: true,
    }),
    [tCategory, getOk, getMessage]
  );

// pakai seperti biasa
  useActionToast<CategoryCreateState>(state, isPending, toastOpts);

  // Refs
  const formRef = useRef<HTMLFormElement>(null);

  // 🔁 tinggal panggil hook ini — selesai
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
      modalSize="sm"
      btnVariant="primary"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText={tCategory('create.button')}
      btnSize="sm"
      formId={formId}
      lockClose={isPending}
    >
      <Modal.Header>{tCategory('create.title')}</Modal.Header>

      <Modal.Body formId={formId} action={formAction} formRef={formRef}>
        {/* name */}
        <div className={"flex flex-col gap-1 mb-3 items-start justify-start"}>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1"
          >
            {tCategory('fields.name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={tCategory('form.phName')}
            className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          {state.errors?.name?.[0] && (
            <p className="text-sm text-danger">{tCategory(state.errors.name[0])}</p>
          )}
        </div>

        {/* description */}
        <div className={"flex flex-col gap-1 mb-3 items-start justify-start"}>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-primary mb-1"
          >
            {tCategory('fields.description')}
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder={tCategory('form.phDescription')}
            className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          {state.errors?.description?.[0] && (
            <p className="text-sm text-danger">{tCategory(state.errors?.description[0])}</p>
          )}
        </div>

        {/* status */}
        <label
          htmlFor="status"
          className="block text-sm font-medium text-primary mb-1"
        >
          {tCategory('fields.status')}
        </label>
        <Switch name={"status"} defaultChecked={false} value={"true"}/>
        <input type="hidden" name="status" value="false" />
        {state.errors?.status?.[0] && (
          <p className="text-sm text-red-600">{state.errors?.status}</p>
        )}
      </Modal.Body>

      {/* onClose di-inject otomatis */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText={isPending ? tCategory('create.saving') : tCategory('create.save')}
        btnSize="sm"
        formId={formId}
        disable={isPending}
      >
        <span className="text-xs text-primary/70">
          {tCategory('create.footer')}
        </span>
      </Modal.Footer>
    </Modal>
  );
}
