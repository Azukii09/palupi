'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import {useParams} from "next/navigation";
import {BasicTableData} from "@/lib/data/dummy/BasicTable";
import Table from "@/component/util/base/Table";

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
        <Table
          data={dataInLocal}
          stripPrefixes={["contact.phone", "contact"]}
          excludesColumnsData={["contact","id","avatar"]}
          excludesColumnsName={["contact","id","avatar"]}
          variants={"strip"}
          withNumbering
          rowHover
          pagination={{paginated: true,}}
        />
      </BasicCard.content>
    </BasicCard>
  );
}
