'use client'
import React from 'react';
import {FaEye} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {DummyCategory} from "@/lib/data/dummy/Category";
import {useParams} from "next/navigation";
import {poppins} from "@/lib/font/font";

export default function CategoryDetail({
  id
}:{
  id:number;
}) {
  const params = useParams()

  const data = DummyCategory.find(item => item.locale === params.locale)?.data.find(it => it.id === id);
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
        <div className="rounded-xl overflow-hidden border border-primary">
          <table className="w-full text-sm">
            <tbody className={poppins.className}>
              <tr className="border-b border-primary">
                <td className="px-4 py-2">tes</td>
                <td className="px-4 py-2 border-l border-primary">tes 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
