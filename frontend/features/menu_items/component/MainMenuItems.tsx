'use client'
import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import Table from "@/component/util/base/Table";
import CreateMenuItems from "@/features/menu_items/component/CreateMenuItems";
import DetailMenuItem from "@/features/menu_items/component/DetailMenuItem";

export default function MainMenuItems() {
  const dummyData = Array.from({length: 50}, (_, index) => ({
    id: index + 1,
    name: `Menu Item ${index + 1}`,
    desc: `Description for menu item ${index + 1}`,
    stock: Math.floor(Math.random() * 100),
    price: Math.floor(Math.random() * 100000) + 10000,
    category: ['Food', 'Beverage', 'Dessert', 'Snack'][Math.floor(Math.random() * 4)]
  }));

  console.log(dummyData)

  return (
    <BasicCard>
      <BasicCard.title>
        <h1 className="text-xl font-bold text-primary capitalize">
          Menu Items
        </h1>
      </BasicCard.title>
      <BasicCard.content
        haveFooter={false}
      >
        <CreateMenuItems/>
        <Table
          data={dummyData}
          variants={"strip"}
          excludesColumnsData={[ "id"]}
          excludesColumnsName={[ "id"]}
          renameMap={{
            'name': 'Name',
            'desc': 'Description',
            'stock': 'Stock',
            'price': 'Price',
            'category': 'Category'
          }}
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
            (row: unknown) => {
              console.log(row)
              return (
                <td className="text-center flex items-center justify-center gap-2 py-2">
                  <DetailMenuItem data={row as any}/>

                  {/*<CategoryEdit data={row as Category}/>*/}

                  {/*<CategoryDelete data={row as Category}/>*/}
                </td>
              )
            }
          }
        />
      </BasicCard.content>
    </BasicCard>
  );
}
