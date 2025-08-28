'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import {useParams} from "next/navigation";
import Table from "@/component/util/base/Table";
import { FaTrash} from "react-icons/fa";
import {CategoryActiveSwitch} from "@/component/ui/categories/CategoryActiveSwitch";
import {DummyCategory} from "@/lib/data/dummy/Category";
import Modal from "@/component/util/base/Modal";
import CategoryDetail from "@/component/ui/categories/detail/CategoryDetail";
import CategoryEdit from "@/component/ui/categories/edit/CategoryEdit";
import Button from "@/component/util/base/Button";

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
        <div>
          <Button buttonType={"button"} variant={"primary"} buttonName={"new-category"} buttonText={"Add New Category"} size={"sm"}/>
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
                  <CategoryDetail id={row as number}/>

                  <CategoryEdit id={row as number}/>

                  <Modal
                    id={`delete-${row}`}
                    btnVariant={"danger"}
                    btnName={`delete-${row}`}
                    btnText={`Delete`}
                    btnSize={"xs"}
                    btnBadge
                    btnOnlyIcon
                    btnIcon={<FaTrash className={"size-4"}/>}
                  >
                    <Modal.Header>
                      Delete Category
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
        </div>
      </BasicCard.content>
    </BasicCard>
  );
}
