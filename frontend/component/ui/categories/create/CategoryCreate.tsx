'use client'
import React from 'react';
import Modal from "@/component/util/base/Modal";
import {useModal} from "@/providers/context/ModalContext";

export default function CategoryCreate() {
  const { closeModal } = useModal();
  const modalId = "demo-create-category";
  const formId = "create-category-form";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    // pastikan 'name' sama dengan atribut name pada input
    const name = fd.get("name");

    console.log("Form submitted with:", { name });

    // contoh: reset form & tutup modal setelah submit
    e.currentTarget.reset();
    closeModal(modalId);
  };
  return (
    <Modal
      id={modalId}
      modalSize="sm"
      btnVariant="primary"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText="Open Modal Form"
      btnSize="sm"
      formId={formId}
    >
      <Modal.Header>New Category</Modal.Header>

      <Modal.Body formId={formId} onSubmit={handleSubmit}>
        {/* Penting: gunakan atribut name agar terbaca oleh FormData */}
        <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
          Category Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Beverages"
          className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
      </Modal.Body>

      {/* onClose akan DIINJEK otomatis oleh Modal melalui cloneElement */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText="Save"
        btnSize="sm"
        formId={formId}
      >
        {/* Kamu bisa menaruh konten tambahan di kiri footer (opsional) */}
        <span className="text-xs text-primary/70">Press Save to log the value</span>
      </Modal.Footer>
    </Modal>
  );
}
