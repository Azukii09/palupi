import React from 'react';
import Modal from "@/component/util/base/Modal";
import {FaEye} from "react-icons/fa";
import {poppins} from "@/lib/font/font";
import {MenuItem} from "@/features/menu_items/services/menu.type";
import {useFormatter} from "use-intl";

export default function DetailMenuItem({
  data
}:{
  data:MenuItem;
}) {
  const tFormater = useFormatter();
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
                  Name
                </td>
                <td className="px-4 py-2 bg-primary text-white">:</td>
                <td className="px-4 py-2 text-start">{data.name}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  Description
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data.desc}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  Category
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{data.category}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  Stock
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{tFormater.number(data.stock)}</td>
              </tr>
              <tr className=" border-primary/50 border-t">
                <td className="px-4 py-2 text-start bg-primary text-white border-t border-white">
                  Price
                </td>
                <td className="px-4 py-2 bg-primary text-white border-t border-white">:</td>
                <td className="px-4 py-2 text-start">{tFormater.number(data.price, {style: 'currency', currency: 'IDR'})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
