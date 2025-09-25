"use client";
import React, {useActionState, useMemo, useRef} from "react";
import Modal from "@/component/util/base/Modal";
import {useTranslations} from "next-intl";
import {ActionResult, createCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import {useActionToast} from "@/hook/useActionToast";
import Switch from "@/component/util/base/Switch";

export default function CategoryCreate() {
  const modalId = "demo-create-category";
  const formId = "create-category-form";

  const tCategory = useTranslations('Category')

  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(createCategory, { ok: false, message: "" });

  const toastOpts = useMemo(() => ({
    success: {
      title: tCategory('create.addTitle'),
      // kalau mau, kirim deskripsi sukses statis/ambil dari result
      description: (r: ActionResult) => r.message,
    },
    error: { title: tCategory('create.errorTitle') },
  }), [tCategory]);

  useActionToast(state, isPending, toastOpts);
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
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        {!state.ok && "message" in state && state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        {/* description */}
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
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        {!state.ok && "message" in state && state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        {/* status */}
        <label
          htmlFor="status"
          className="block text-sm font-medium text-primary mb-1"
        >
          {tCategory('fields.status')}
        </label>
        <Switch name={"status"} defaultChecked={false} value={"true"}/>
        <input type="hidden" name="status" value="false" />
        {!state.ok && "message" in state && state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
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
