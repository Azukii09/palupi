import React from 'react';
import Modal from "@/component/util/base/Modal";
import {FaEye} from "react-icons/fa";
import {poppins} from "@/lib/font/font";

export default function DetailMenuItem({
  data
}:{
  data:any;
}) {
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
        Judul
      </Modal.Header>
      <Modal.Body>
        <div className="rounded-xl overflow-hidden shadow shadow-primary">
          <table className="w-full text-sm">
            <tbody className={`${poppins.className}`}>
            <tr className=" border-primary/50">
              <td className={`px-4 py-2 text-start bg-primary text-white`}>
                keterangan
              </td>
              <td className="px-4 py-2 bg-primary text-white">:</td>
              <td className="px-4 py-2 text-start">data</td>
            </tr>
            {/*<tr className=" border-primary/50 border-t">*/}
            {/*  <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">*/}
            {/*    {tCategory('fields.description')}*/}
            {/*  </td>*/}
            {/*  <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>*/}
            {/*  <td className="px-4 py-2 text-start">{data.description}</td>*/}
            {/*</tr>*/}
            {/*<tr className=" border-primary/50 border-t">*/}
            {/*  <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">*/}
            {/*    {tCategory('fields.status')}*/}
            {/*  </td>*/}
            {/*  <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>*/}
            {/*  <td className="px-4 py-2 text-start">{data.status ? tCategory('form.active'):tCategory('form.notActive')}</td>*/}
            {/*</tr>*/}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
