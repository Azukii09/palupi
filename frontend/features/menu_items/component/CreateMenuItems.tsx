"use client";
import React from "react";
import Modal from "@/component/util/base/Modal";

export default function CreateMenuItems() {
  const modalId = "demo-create-menu-items";
  const formId = "create-category-menu-items-form";

  return (
    <Modal
      id={modalId}
      modalSize="sm"
      btnVariant="primary"
      btnVariantType="solid"
      btnName="open-create-category"
      btnText={"New Menu Item"}
      btnSize="sm"
      formId={formId}
    >
      <Modal.Header>Menu Items</Modal.Header>

      <Modal.Body formId={formId}>
        {/* name */}
        <div className={"flex flex-col gap-1 mb-3 items-start justify-start"}>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="eg: Bebek Panggang"
            className="w-full rounded-md border border-primary/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          {/*{state.errors?.name?.[0] && (*/}
          {/*  <p className="text-sm text-danger">{tCategory(state.errors.name[0])}</p>*/}
          {/*)}*/}
        </div>
      </Modal.Body>

      {/* onClose di-inject otomatis */}
      <Modal.Footer
        btnVariant="primary"
        btnVariantType="solid"
        btnName="submit-create-category"
        btnText={"Save"}
        btnSize="sm"
        formId={formId}
      >
        <span className="text-xs text-primary/70">
          footer
        </span>
      </Modal.Footer>
    </Modal>
  );
}
