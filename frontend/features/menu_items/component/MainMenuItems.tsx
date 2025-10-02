import React from 'react';
import BasicCard from "@/component/util/base/BasicCard";

export default function MainMenuItems() {
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
        MainMenuItems
      </BasicCard.content>
    </BasicCard>
  );
}
