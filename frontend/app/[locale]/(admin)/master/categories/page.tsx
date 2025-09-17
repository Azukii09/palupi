import React from 'react';
import MainViewCategory from "@/component/ui/categories/MainViewCategory";
import {apiGet} from "@/lib/utils/api";
import {Category} from "@/lib/type/api";

export const revalidate = 600; // 10 minutes
export const metadata = { title: "Categories" };


export default async function CategoriesPage() {
  const items = await apiGet<Category[]>(`/api/v1/categories`, { next: { tags: ["categories"] } });
  return (
    <MainViewCategory data={items}/>
  );
}
