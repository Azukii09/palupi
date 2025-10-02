import {getLocale} from "next-intl/server";
import React from "react";
import MainMenuItems from "@/features/menu_items/component/MainMenuItems";

export const revalidate = 600; // 10 minutes
export const metadata = { title: "Categories" };


export default async function MenuItemsPage() {
  const locale = await getLocale()
  console.log(locale)
  return (
    <MainMenuItems/>
  );
}
