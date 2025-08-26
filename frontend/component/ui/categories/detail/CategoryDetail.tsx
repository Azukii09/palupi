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
        <div className={"flex flex-col gap-2"}>
          <table className={` w-full rounded-xl p-6 text-sm`}>
            <tbody className={`${poppins.className} rounded-xl`}>
              <tr
                className={` border-y rounded-xl`}
              >
                <td className={`border-primary px-4 py-2 border-x rounded-xl`}>
                  tes
                </td>
                <td className={`border-primary px-4 py-2 border-x `}>
                  tes 2
                </td>
              </tr>
            </tbody>
          </table>
          {data?.name}
        </div>
      </Modal.Body>
    </Modal>
  );
}
