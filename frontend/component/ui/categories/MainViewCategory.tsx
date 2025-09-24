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
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

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
