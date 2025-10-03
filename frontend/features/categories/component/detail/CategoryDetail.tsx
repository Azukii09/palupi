'use client'
import React from 'react';
import {FaEye} from "react-icons/fa";
import Modal from "@/component/util/base/Modal";
import {useParams} from "next/navigation";
import {poppins} from "@/lib/font/font";
import {useTranslations} from "next-intl";
import {Category} from "@/features/categories/services/category.type";

export default function CategoryDetail({
  data
}:{
  data:Category;
}) {
  const params = useParams()
  const tCategory = useTranslations('Category')

  return (
    <Modal
      id={`detail-${data.id}`}
      btnVariant={"primary"}
      btnName={`detail-${data.id}`}
      btnText={`View`}
      btnSize={"xs"}
      btnBadge
      btnOnlyIcon
      btnIcon={<FaEye className={"size-4"}/>}
    >
      <Modal.Header>
        {params.locale ==="id" ? `${tCategory('form.detail')} ${tCategory('form.category')}` : `${tCategory('form.category')} ${tCategory('form.detail')}`}
      </Modal.Header>
      <Modal.Body>
        <div className="rounded-xl overflow-hidden shadow shadow-primary">
          <table className="w-full text-sm">
            <tbody className={`${poppins.className}`}>
              <tr className=" border-primary/50">
                <td className={`px-4 py-2 text-start bg-primary text-white`}>
                  {tCategory('fields.name')}
                </td>
                <td className="px-4 py-2 bg-primary text-white">:</td>
                <td className="px-4 py-2 text-start">{data.name}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  {tCategory('fields.description')}
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data.description}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  {tCategory('fields.status')}
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data.status ? tCategory('form.active'):tCategory('form.notActive')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
