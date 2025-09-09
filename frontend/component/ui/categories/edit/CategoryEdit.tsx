'use client'
import React, {useState} from 'react';
import {HiOutlinePencilAlt} from "react-icons/hi";
import Modal from "@/component/util/base/Modal";
import {useParams} from "next/navigation";
import {DummyCategory} from "@/lib/data/dummy/Category";
import {useModal} from "@/providers/context/ModalContext";

export default function CategoryEdit({
  id,
}:{
  id:number;
}) {
  const params = useParams()

  const data = DummyCategory.find(item => item.locale === params.locale)?.data.find(it => it.id === id);

  const { closeModal } = useModal();
  const modalId = `demo-create-category-${id}`;
  const formId = `edit-category-form-${id}`;

  // state untuk form
  const [name, setName] = useState(data?.name as string);
  const [desc, setDesc] = useState(data?.detail as string);

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
      <Modal.Header>Edit Category</Modal.Header>

      <Modal.Body formId={formId} onSubmit={handleSubmit}>
        {/* name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-1 text-start"
        >
          Category Name
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
          className="block text-sm font-medium text-primary mb-1 text-start"
        >
          Category Description
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
        btnText="Edit"
        btnSize="sm"
        formId={formId}
      >
        <span className="text-xs text-primary/70">
          Press Edit to log the value
        </span>
      </Modal.Footer>
    </Modal>
  );
}
