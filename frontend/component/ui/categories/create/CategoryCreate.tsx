import React from 'react';
import Modal from "@/component/util/base/Modal";

export default function CategoryCreate() {
  return (
    <Modal id={"mdl-add"} btnVariant={"primary"} btnName={"add-category"} btnText={"New Category"} btnSize={"sm"}>
      <Modal.Header>
        Add New Category
      </Modal.Header>
      <Modal.Body>body</Modal.Body>
      <Modal.Footer
        btnVariant={"success"}
        btnText={"Submit"}
        btnName={"Submit"}
        btnVariantType={"solid"}
        btnSize={"sm"}
      >
      </Modal.Footer>
    </Modal>
  );
}
