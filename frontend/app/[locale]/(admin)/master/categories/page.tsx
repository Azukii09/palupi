import React from 'react';
import MainViewCategory from "@/features/categories/component/MainViewCategory";
import {apiGet} from "@/lib/utils/api";
import {Category} from "@/lib/type/api";
import {getLocale} from "next-intl/server";

export const revalidate = 600; // 10 minutes
export const metadata = { title: "Categories" };


export default async function CategoriesPage() {
  const locale = await getLocale()
  const items = await apiGet<Category[]>(`/api/v1/categories?locale=${locale}`, { next: { tags: ["categories"] } });
  return (
    <MainViewCategory data={items}/>
  );
}
