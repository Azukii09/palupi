'use client'
import React, {useState, useMemo, useEffect, JSX} from 'react';
import { getDeepKeys } from '@/lib/utils/getDeepKeys';
import { flattenObject } from '@/lib/utils/flattenObject';
import { delaGothic, poppins } from '@/lib/font/font';
import {PaginationControls} from "@/component/util/base/PaginationControls";
import {useTranslations} from "next-intl";

export default function Table({
    data,
    customColumnRenderer = {}, // Key-value pair untuk renderer spesifik pada kolom
    stripPrefixes,
    excludesColumnsName,
    excludesColumnsData,
    withNumbering = false,
    withActions,
    withFooter = false,
    variants = 'default',
    rowHover = false,
    hoverColor = 'hover:bg-secondary/10',
    borderColor = 'border-primary',
    stripColor = 'bg-primary/10',
    headColor = 'text-primary/80',
    textColor = 'text-primary/80',
    rowColor = 'bg-white',
    renameMap = {},
    pagination = {
        paginated: false,
        textColor:{
            active: 'bg-primary text-tertiary/80',
            text: 'text-tertiary/80',
            pageNumber: 'text-success/60'
        }
    },
    withSearch = {
        searchStatus: false,
        textColor: pagination.textColor?.text || 'text-primary/80',
        borders: 'border-primary',
    },
    columnOrder,
}: {
    data: Array<Record<string, unknown>> | undefined;
    customColumnRenderer?: Record<string, (row: Record<string, unknown>) => JSX.Element>;
    stripPrefixes?: string[];
    excludesColumnsName?: string[];
    excludesColumnsData?: string[];
    withNumbering?: boolean;
    withActions?: (row: Record<string, unknown>) => JSX.Element;
    withFooter?: boolean;
    variants: 'default' | 'strip';
    rowHover?: boolean;
    hoverColor?: string;
    borderColor?: string;
    stripColor?: string;
    headColor?: string;
    textColor?: string;
    rowColor?: string;
    renameMap?: Record<string, string>;
    pagination?: {
        paginated: boolean;
        paginatedPageCount?: number[];
        textColor?: {
            active: string;
            text: string;
            pageNumber: string;
        };
    };
    withSearch?: {
        searchStatus: boolean;
        textColor?: string;
        borders?: string;
    };
    columnOrder?: string[];
}) {
    const tAction = useTranslations('Table');
    // derive headers (keys mentah utk akses data)
    const columnName = getDeepKeys(data || [], {
      excludeParents: excludesColumnsData,
    });

    // label header (boleh di-strip/rename)
    const forHeaderAndFooter = getDeepKeys(data || [], {
      stripPrefixes,
      excludeParents: excludesColumnsName,
      renameMap,
    });

    // Buat peta key → label (fallback ke key jika tidak sejajar)
    const headerMap = useMemo(() => {
      const map = new Map<string, string>();
      // asumsi awal: index sejajar
      for (let i = 0; i < columnName.length; i++) {
        const key = columnName[i];
        const label = forHeaderAndFooter[i] ?? key;
        map.set(key, label);
      }
      // fallback rename/strip sederhana jika mismatch
      if (map.size !== columnName.length) {
        for (const key of columnName) {
          let label = renameMap[key] ?? key;
          if (stripPrefixes?.length) {
            for (const p of stripPrefixes) {
              if (label.startsWith(p + ".")) label = label.slice(p.length + 1);
              else if (label.startsWith(p)) label = label.slice(p.length);
            }
          }
          if (!map.has(key)) map.set(key, label);
        }
      }
      return map;
    }, [columnName, forHeaderAndFooter, renameMap, stripPrefixes]);

    // flatten rows
    const rows = useMemo(() => data?.map(item => flattenObject(item)) || [], [data]);

    // search state
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = useMemo(() => {
      if (!searchTerm.trim()) return rows;
      const lower = searchTerm.toLowerCase();
      return rows.filter(row =>
        Object.values(row).some(val => val != null && String(val).toLowerCase().includes(lower))
      );
    }, [searchTerm, rows]);

    // pagination state
    const [pageSize, setPageSize] = useState(pagination.paginatedPageCount ? pagination.paginatedPageCount[0] : 10);
    const [currentPage, setCurrentPage] = useState(1);
    // recompute totalPages based on filteredRows
    const totalPages = useMemo(
        () => (pagination.paginated ? Math.ceil(filteredRows.length / pageSize) : 1),
        [filteredRows.length, pageSize, pagination.paginated]
    );
    // reset to page 1 when searchTerm or pageSize change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const start = (currentPage - 1) * pageSize;
    const currentData = pagination.paginated
        ? filteredRows.slice(start, start + pageSize)
        : filteredRows;

    // ⬇️ NEW: reorder kolom data sesuai columnOrder
    const dataColumns = useMemo(() => {
      if (!columnOrder?.length) return columnName;
      const set = new Set(columnOrder);
      const ordered = columnOrder.filter(k => columnName.includes(k));
      const rest = columnName.filter(k => !set.has(k));
      return [...ordered, ...rest];
    }, [columnName, columnOrder]);

    return (
        <div className="flex flex-col">
            <div
                className={`${pagination.textColor?.text ? pagination.textColor.text:"text-primary/80"} ${pagination.paginated ? 'justify-between':'justify-end'} w-full flex items-center`}
            >
                {pagination.paginated && (
                    <div className={"py-6 flex flex-col md:flex-row gap-2 items-center justify-center"}>
                        <span>{tAction('show')} </span>
                        <select
                            name="pagination"
                            value={pageSize}
                            className={`${borderColor} ${pagination.textColor?.text ? pagination.textColor.text:"text-primary/80"} border-1 border-primary px-2 focus:outline-0 focus:border-3 cursor-pointer mx-2 rounded-md`}
                            onChange={e => setPageSize(Number(e.target.value))}
                        >
                            {
                                pagination?.paginatedPageCount ? pagination?.paginatedPageCount?.map((option, idx) => (
                                    <option key={idx} value={option}>
                                        {option}
                                    </option>
                                )):
                                    [10,20,25,50,100].map((option, idx) => (
                                        <option key={idx} value={option}>
                                            {option}
                                        </option>
                                    ))
                            }
                        </select>
                        <span> {tAction('entries')}</span>
                    </div>
                )}
                {withSearch.searchStatus && (
                    <div className={`${withSearch.textColor?withSearch.textColor:"text-primary/80"} capitalize flex items-center`}>
                        <label htmlFor="table-search" className="mr-2">
                          {tAction('search')}:
                        </label>
                        <input
                            id="table-search"
                            type="text"
                            placeholder={`${tAction('search')} . . .`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`${withSearch.borders ? withSearch.borders : "border-primary"} ${withSearch.textColor?withSearch.textColor:"text-primary/80"} border-1 px-1 lg:px-4 py-1 focus:outline-0 focus:border-3 cursor-text mx-2 rounded-md`}
                        />
                    </div>
                )}
            </div>
            <div
                className={`${borderColor} border w-full rounded-xl overflow-auto bg-white shadow-xs shadow-primary`}
            >
                <table className={`${textColor} w-full rounded-xl p-6 text-sm`}>
                    <thead className={`${delaGothic.className} ${headColor}`}>
                      <tr className={`${borderColor} border-b w-full uppercase tracking-wider`}>
                        {withNumbering && <th className="px-4 py-2">no.</th>}
                        {dataColumns.map((key) => (
                          <th key={key} className={`${borderColor} px-4 py-2 border-x`}>
                            {headerMap.get(key) ?? key}
                          </th>
                        ))}
                        {withActions && <th className="px-4 py-2">{tAction('actions')}</th>}
                      </tr>
                    </thead>

                    <tbody className={`${poppins.className}`}>
                    {currentData.map((row, idx) => {
                      const rowId =
                        (row.id as string | number | undefined) ??
                        (row["id"] as string | number | undefined) ??
                        `row-${start + idx}`; // fallback terakhir (sebaiknya selalu ada id)
                      return(
                        <tr
                          key={rowId}
                          className={`${rowHover ? hoverColor : ''} ${variants === 'strip' && idx % 2 !== 1 ? stripColor : rowColor} ${borderColor} border-y`}
                        >
                          {withNumbering && <td className="text-center">{start + idx + 1}</td>}

                          {dataColumns.map((key) => (
                            <td key={`${rowId}-${String(key)}`} className={`${borderColor} px-4 py-2 border-x`}>
                              {typeof customColumnRenderer[key] === 'function'
                                ? customColumnRenderer[key](row)
                                : row[key] != null ? String(row[key]) : '-'}
                            </td>
                          ))}

                          {withActions ? withActions(row) : null}
                        </tr>
                      )
                    })}

                    {currentData.length === 0 && (
                      <tr>
                        <td
                          colSpan={dataColumns.length + (withNumbering ? 1 : 0) + (withActions ? 1 : 0)}
                          className="py-4 text-center"
                        >
                          {tAction('noData')}
                        </td>
                      </tr>
                    )}
                    </tbody>

                    {withFooter && (
                      <tfoot className={`${delaGothic.className} ${headColor}`}>
                        <tr className="w-full uppercase tracking-wider">
                          {withNumbering && <th className="px-4 py-2">no.</th>}
                          {dataColumns.map((key) => (
                            <th key={key} className={`${borderColor} px-4 py-2 border-x`}>
                              {headerMap.get(key) ?? key}
                            </th>
                          ))}
                          {withActions && <th className="px-4 py-2">{tAction('actions')}</th>}
                        </tr>
                      </tfoot>
                    )}
                </table>
            </div>

            {pagination.paginated && (
                <div className="flex justify-between w-full items-center gap-2 mt-4">
                    <div className={`${delaGothic.className} ${pagination.textColor?.text || 'text-primary/80'} bg-white text-xs tracking-widest h-full py-2`}>
                        Show{' '}
                        <span className={`${poppins.className} ${pagination.textColor?.pageNumber || 'text-success/60'} font-extrabold`}>{start + 1}–{Math.min(start + pageSize, rows.length)}</span>
                        {' '}from{' '}
                        <span className={`${poppins.className} ${pagination.textColor?.pageNumber || 'text-success/60'} font-extrabold`}>{rows.length}</span>{' '}data
                    </div>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        activePage={pagination.textColor}
                    />
                </div>
            )}
        </div>
    );
}
