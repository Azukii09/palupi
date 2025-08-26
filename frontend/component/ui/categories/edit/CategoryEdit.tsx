import React from 'react';
import {HiOutlinePencilAlt} from "react-icons/hi";
import Modal from "@/component/util/base/Modal";

export default function CategoryEdit({
  id,
}:{
  id:number;
}) {
  return (
    <Modal
      id={`edit-${id}`}
      btnVariant={"warning"}
      btnName={`edit-${id}`}
      btnText={`Edit`}
      btnSize={"xs"}
      btnBadge
      btnOnlyIcon
      btnIcon={<HiOutlinePencilAlt className={"size-4"}/>}
    >
      <Modal.Header>
        Edit Category
      </Modal.Header>
      <Modal.Body>
        <div className={"flex flex-col gap-2"}>
          tes {id as number}
        </div>
      </Modal.Body>
      <Modal.Footer
        btnVariant={"success"}
        btnText={"Submit"}
        btnName={"Submit"}
        btnVariantType={"solid"}
        btnSize={"sm"}
      >
        Footer
      </Modal.Footer>
    </Modal>
  );
}
