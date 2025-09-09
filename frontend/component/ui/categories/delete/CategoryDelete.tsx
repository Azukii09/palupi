import React from 'react';
import {FaTrash} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";

export default function CategoryDelete({
  id
}:{
  id:number;
}) {
  return (
    <Modal
      id={`delete-${id}`}
      btnVariant={"danger"}
      btnName={`delete-${id}`}
      btnText={`Delete`}
      btnSize={"xs"}
      btnBadge
      btnOnlyIcon
      btnIcon={<FaTrash className={"size-4"}/>}
    >
      <Modal.Header>
        Delete Category
      </Modal.Header>
      <Modal.Body>
        <div className={"flex flex-col gap-2"}>
          <FaTrash className={"size-4"}/>
        </div>
      </Modal.Body>
      <Modal.Footer
        btnVariant={"danger"}
        btnText={"Delete"}
        btnName={"delete"}
        btnVariantType={"solid"}
        btnSize={"sm"}
      >
        Delete Category
      </Modal.Footer>
    </Modal>
  );
}
