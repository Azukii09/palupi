'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import Table from "@/component/util/base/Table";
import {CategoryActiveSwitch} from "@/features/categories/component/CategoryActiveSwitch";
import CategoryDetail from "@/features/categories/component/detail/CategoryDetail";
import CategoryEdit from "@/features/categories/component/edit/CategoryEdit";
import CategoryCreate from "@/features/categories/component/create/CategoryCreate";
import CategoryDelete from "@/features/categories/component/delete/CategoryDelete";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Category} from "@/features/categories/services/category.type";

export default function MainViewCategory({
  data
}:{
  data: Category[];
}) {
  const router = useRouter();
  const tCategory = useTranslations('Category')
  return (
    <BasicCard>
      {/*Title*/}
      <BasicCard.title>
        <h1 className="text-xl font-bold text-primary capitalize">
          {tCategory('titleMany')}
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
            renameMap={{
              'name': tCategory('table_column_name.name'),
              'description': tCategory('table_column_name.description'),
              'status': tCategory('table_column_name.status')
            }}
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
              (row: unknown) => (
                <td className="text-center flex items-center justify-center gap-2 py-2">
                  <CategoryDetail data={row as Category}/>

                  <CategoryEdit data={row as Category}/>

                  <CategoryDelete data={row as Category}/>
                </td>
              )
            }
            customColumnRenderer={{
              status:(data)=>(
                <div className={"flex items-center justify-center"}>
                  <CategoryActiveSwitch
                    categoryId={data.id as string}
                    initialActive={Boolean(data.status)}
                    onSaved={() => {
                      setTimeout(() => router.refresh(), 50);
                    }}
                  />
                </div>
              )
            }}
            columnOrder={["name","description","status"]}
            withFooter
          />
        </div>
      </BasicCard.content>
    </BasicCard>
  );
}
