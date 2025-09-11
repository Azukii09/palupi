'use client'
import React from 'react';
import {FaEye} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {DummyCategory} from "@/lib/data/dummy/Category";
import {useParams} from "next/navigation";
import {poppins} from "@/lib/font/font";
import {useTranslations} from "next-intl";

export default function CategoryDetail({
  id
}:{
  id:number;
}) {
  const params = useParams()
  const tCategory = useTranslations('Category')

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
        <div className={`${params.locale === "id" && "flex-row-reverse"} ${poppins.className} flex items-center gap-2 justify-center`}>
          <span>{tCategory('form.category')}</span>
          <span>{tCategory('form.detail')}</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="rounded-xl overflow-hidden shadow shadow-primary">
          <table className="w-full text-sm">
            <tbody className={`${poppins.className}`}>
              <tr className=" border-primary/50">
                <td className="px-4 py-2 text-start bg-primary text-white">{tCategory('form.name')}</td>
                <td className="px-4 py-2 bg-primary text-white">:</td>
                <td className="px-4 py-2 text-start">{data?.name}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">{tCategory('form.description')}</td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data?.detail}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">{tCategory('form.status')}</td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data?.status ? "active":"not active"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
