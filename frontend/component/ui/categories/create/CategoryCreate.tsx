"use client";
import React, { useState } from "react";
import Modal from "@/component/util/base/Modal";
import { useModal } from "@/providers/context/ModalContext";
import {useTranslations} from "next-intl";

export default function CategoryCreate() {
  const { closeModal } = useModal();
  const modalId = "demo-create-category";
  const formId = "create-category-form";

  const tCategory = useTranslations('Category')


  // state untuk form
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted with:", { name, desc });

    // reset & close
    setName("");
    setDesc("");
    closeModal(modalId);
  };

  return (
    <Modal
      id={modalId}
      modalSize="sm"
      btnVariant="primary"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText="New Category"
      btnSize="sm"
      formId={formId}
    >
      <Modal.Header>New Category</Modal.Header>

      <Modal.Body formId={formId} onSubmit={handleSubmit}>
        {/* name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-1"
        >
          {tCategory('form.name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Beverages"
          className="w-full rounded-md border border-primary/40 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />

        {/* description */}
        <label
          htmlFor="desc"
          className="block text-sm font-medium text-primary mb-1"
        >
          {tCategory('form.description')}
        </label>
        <input
          id="desc"
          name="desc"
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Drinks and food category"
          className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
      </Modal.Body>

      {/* onClose di-inject otomatis */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText="Save"
        btnSize="sm"
        formId={formId}
      >
        <span className="text-xs text-primary/70">
          Press Save to log the value
        </span>
      </Modal.Footer>
    </Modal>
  );
}
