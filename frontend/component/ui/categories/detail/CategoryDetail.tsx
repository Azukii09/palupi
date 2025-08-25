'use client'
import React from 'react';
import {FaEye} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";

export default function CategoryDetail({
  id
}:{
  id:number;
}) {
  return (
    <Modal
      id={`detail-${id}`}
      btnVariant={"primary"}
      btnName={`detail-${id}`}
      btnText={`View`}
      btnSize={"xs"}
      btnBadge
      btnOnlyIcon
      btnIcon={<FaEye className={"size-4"}/>}
    >
      <Modal.Header>
        Category Detail
      </Modal.Header>
      <Modal.Body>
        <div className={"flex flex-col gap-2"}>
          tes {id}
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
