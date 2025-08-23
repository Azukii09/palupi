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
import Modal from "@/component/util/base/Modal";

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
              <Modal
                id={`detail-${row}`}
                btnVariant={"primary"}
                btnName={`detail-${row}`}
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
                    tes {row as number}
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

              <Modal
                id={`edit-${row}`}
                btnVariant={"warning"}
                btnName={`edit-${row}`}
                btnText={`View`}
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
                    tes {row as number}
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
