"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { getPageItems } from "@/lib/utils/getPageItems";
import {useTranslations} from "next-intl";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activePage?: {
    active: string; // kelas untuk tombol aktif
    text: string;   // kelas warna teks default
    pageNumber: string; // kelas nomor halaman (opsional)
  };
}

export const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  activePage,
}) => {
  // 1) Pastikan markup SSR == render pertama di client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 2) Responsivitas yang aman (SSR-stable → 5)
  const computeMaxSize = () => {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w < 640) return 1;        // ~xs/sm
    if (w < 768) return 1;        // sm
    if (w < 1024) return 2;       // md
    if (w < 1280) return 3;       // lg
    if (w < 1536) return 4;       // xl
    return 5;                     // 2xl+
  };
  const maxSize = mounted ? computeMaxSize() : 5;

  const items = useMemo(
    () => getPageItems(currentPage, totalPages, maxSize),
    [currentPage, totalPages, maxSize]
  );

  const baseBtn =
    "px-2 py-1 rounded-full shadow-sm shadow-primary text-nowrap text-xs sm:text-sm md:text-base";
  const textClass = activePage?.text ?? "text-primary/80";

  const tTable = useTranslations("Table")

  return (
    <div className={`${textClass} flex items-center space-x-1`} aria-label="Pagination">
      {items.map((it) => {
        if (it.type === "prev") {
          const disabled = it.disabled;
          return (
            <button
              key="prev"
              type="button"
              onClick={() => !disabled && onPageChange(currentPage - 1)}
              disabled={disabled}
              className={`${baseBtn}${disabled ? " opacity-50 bg-primary/20 cursor-not-allowed" : " hover:bg-primary/20"}`}
              aria-label="Previous page"
            >
              ‹ {tTable('prev')}
            </button>
          );
        }

        if (it.type === "next") {
          const disabled = it.disabled;
          return (
            <button
              key="next"
              type="button"
              onClick={() => !disabled && onPageChange(currentPage + 1)}
              disabled={disabled}
              className={`${baseBtn}${disabled ? " opacity-50 bg-primary/20 cursor-not-allowed" : " hover:bg-primary/20"}`}
              aria-label="Next page"
            >
              {tTable('next')} ›
            </button>
          );
        }

        if (it.type === "ellipsis") {
          // 🔒 Ellipsis juga pakai <button disabled> agar ELEMEN KONSISTEN
          return (
            <button
              key={it.key}
              type="button"
              disabled
              tabIndex={-1}
              aria-hidden="true"
              className={`${baseBtn} cursor-default opacity-70 bg-transparent`}
            >
              …
            </button>
          );
        }

        // type === 'page'
        const isActive = it.page === currentPage;
        const activeCls = activePage?.active ?? " bg-primary text-tertiary";
        const finalClass = `${baseBtn} ${
          isActive ? activeCls + " cursor-default" : " hover:bg-primary/20"
        }`;

        return (
          <button
            key={it.page}
            type="button"
            onClick={() => !isActive && onPageChange(it.page)}
            disabled={isActive}
            aria-current={isActive ? "page" : undefined}
            className={`${finalClass}`}
          >
            {it.page}
          </button>
        );
      })}
    </div>
  );
};
