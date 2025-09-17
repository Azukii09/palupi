'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import Table from "@/component/util/base/Table";
import {CategoryActiveSwitch} from "@/component/ui/categories/CategoryActiveSwitch";
import CategoryDetail from "@/component/ui/categories/detail/CategoryDetail";
import CategoryEdit from "@/component/ui/categories/edit/CategoryEdit";
import CategoryCreate from "@/component/ui/categories/create/CategoryCreate";
import CategoryDelete from "@/component/ui/categories/delete/CategoryDelete";
import {Category} from "@/lib/type/api";

export default function MainViewCategory({
  data
}:{
  data: Category[];
}) {
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
          <CategoryCreate/>

          <Table
            data={data}
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
              paginatedPageCount:[5,10,20,50],
            }}
            withActions={
              (row: number | unknown) => (
                <td className="text-center flex items-center justify-center gap-2 py-2">
                  <CategoryDetail id={row as number} data={data}/>

                  <CategoryEdit id={row as number}/>

                  <CategoryDelete id={row as number}/>
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
