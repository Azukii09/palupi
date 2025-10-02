import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";
import Table from "@/component/util/base/Table";

export default function MainMenuItems() {
  const dummyData = Array.from({length: 50}, (_, index) => ({
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
        <Table
          data={dummyData}
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
        />
      </BasicCard.content>
    </BasicCard>
  );
}
