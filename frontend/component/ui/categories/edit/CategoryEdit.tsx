'use client'
import React, {useActionState, useMemo, useRef} from 'react';
import {HiOutlinePencilAlt} from "react-icons/hi";
import Modal from "@/component/util/base/Modal";
import {ActionResult, updateCategory} from "@/app/[locale]/(admin)/master/categories/actions";
import {Category} from "@/lib/type/api";
import {useActionModalAutoClose} from "@/hook/useActionModalAutoClose";
import {useActionToast} from "@/hook/useActionToast";
import Switch from "@/component/util/base/Switch";
import {useTranslations} from "next-intl";

export default function CategoryEdit({
  data,
}:{
  data:Category;
}) {
  const tCategory = useTranslations('Category')

  const modalId = `demo-create-category-${data.id}`;
  const formId = `edit-category-form-${data.id}`;

  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(updateCategory, { ok:false, message:"" });

  const toastOpts = useMemo(() => ({
    success: {
      title: "Updated",
      // kalau mau, kirim deskripsi sukses statis/ambil dari result
      description: (r: ActionResult) => r.message,
    },
    error: { title: "Update failed" },
  }), []);

  useActionToast(state, isPending, toastOpts);

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
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-1 text-start"
        >
          {tCategory('edit.name')}
        </label>
        <input type="hidden" name="id" value={data.id} />
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={data.name}
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
          className="block text-sm font-medium text-primary mb-1 text-start"
        >
          {tCategory('edit.description')}
        </label>
        <input type="hidden" name="id" value={data.id} />
        <input
          id="description"
          name="description"
          type="text"
          defaultValue={data.description}
          placeholder="e.g. Beverages"
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
        {!state.ok && "message" in state && state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        {/* status */}
        <div className={"flex flex-col gap-1 items-start justify-start"}>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-primary mb-1"
          >
            {tCategory('edit.status')}
          </label>
          <Switch name={"status"} defaultChecked={false} value={"true"} checked={data.status}/>
          <input type="hidden" name="status" value="false" />
          {!state.ok && "message" in state && state.message && (
            <p className="text-sm text-red-600">{state.message}</p>
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
