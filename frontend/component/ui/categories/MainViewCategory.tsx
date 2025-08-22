'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import {useParams} from "next/navigation";
import {BasicTableData} from "@/lib/data/dummy/BasicTable";
import Table from "@/component/util/base/Table";
import Button from "@/component/util/base/Button";
import {FaEye, FaTrash} from "react-icons/fa";
import {HiOutlinePencilAlt} from "react-icons/hi";
import Switch from "@/component/util/base/Switch";

export default function MainViewCategory() {
  const params = useParams()

  const dataInLocal = BasicTableData.find(item => item.locale === params.locale)?.data;
  return (
    <BasicCard>
      {/*Title*/}
      <BasicCard.title>
        <h1 className="text-xl font-bold text-primary capitalize">
          Categories
        </h1>
      </BasicCard.title>

      {/*content*/}
      <BasicCard.content
        haveFooter={false}
      >
        <Switch/>
      <Table
        data={dataInLocal}
        stripPrefixes={["contact.phone", "contact"]}
        excludesColumnsData={["contact", "id", "avatar"]}
        excludesColumnsName={["contact", "id", "avatar"]}
        variants={"strip"}
        withNumbering
        withSearch={
          {
            searchStatus: true,
            textColor: "text-primary",
            borders: "border-primary",
          }
        }
        rowHover
        pagination={{paginated: true,}}
        withActions={
          (row: number | unknown) => (
            <td className="text-center flex items-center justify-center gap-2 py-2">
            <Button
                  buttonName={"detail"}
                  buttonType={"button"}
                  variant={"primary"}
                  buttonText={"Detail"}
                  size={"sm"}
                  isBadge
                  onlyIcon
                  icon={<FaEye className={"size-4"}/>}
                  handler={()=>console.log(row)}
                />
                <Button
                  buttonName={"edit"}
                  buttonType={"button"}
                  variant={"warning"}
                  buttonText={"Edit"}
                  size={"sm"}
                  isBadge
                  onlyIcon
                  icon={<HiOutlinePencilAlt className={"size-4"}/>}
                  handler={()=>console.log(row)}
                />
                <Button
                  buttonName={"delete"}
                  buttonType={"button"}
                  variant={"danger"}
                  buttonText={"Delete"}
                  size={"sm"}
                  isBadge
                  onlyIcon
                  icon={<FaTrash className={"size-4"}/>}
                  handler={()=>console.log(row)}
                />
              </td>
            )
          }
        />
      </BasicCard.content>
    </BasicCard>
  );
}
