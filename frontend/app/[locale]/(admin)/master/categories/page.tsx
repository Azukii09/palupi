import React from 'react';
import MainViewCategory from "@/component/ui/categories/MainViewCategory";

export default async function CategoriesPage() {
  const base = process.env.API_BASE!;            // contoh: http://api:8080
  const res  = await fetch(`${base}/api/v1/categories`, { cache: "no-store" });
  const json = await res.json();

  console.log(json);
  return (
    <MainViewCategory data={json.data}/>
  );
}
