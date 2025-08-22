'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import {useParams} from "next/navigation";
import Table from "@/component/util/base/Table";
import Button from "@/component/util/base/Button";
import {FaEye, FaTrash} from "react-icons/fa";
import {HiOutlinePencilAlt} from "react-icons/hi";
import {CategoryActiveSwitch} from "@/component/ui/categories/CategoryActiveSwitch";
import {DummyCategory} from "@/lib/data/dummy/Category";

export default function MainViewCategory() {
  const params = useParams()

  const dataInLocal = DummyCategory.find(item => item.locale === params.locale)?.data;
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
      <Table
        data={dataInLocal}
        excludesColumnsData={[ "id"]}
        excludesColumnsName={[ "id"]}
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
        pagination={{
          paginated: true,
          paginatedPageCount:[5,10,15],
        }}
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
        customColumnRenderer={{
          status:(data)=>(
            <div className={"flex items-center justify-center"}>
              <CategoryActiveSwitch
                categoryId={data.id as string}
                initialActive={data.status as boolean}
              />
            </div>
          )
        }}
        />
      </BasicCard.content>
    </BasicCard>
  );
}
