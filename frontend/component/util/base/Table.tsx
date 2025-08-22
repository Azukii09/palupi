import React, {useState, useMemo, useEffect, JSX} from 'react';
import { getDeepKeys } from '@/lib/utils/getDeepKeys';
import { flattenObject } from '@/lib/utils/flattenObject';
import { delaGothic, poppins } from '@/lib/font/font';
import {PaginationControls} from "@/component/util/base/PaginationControls";

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
    hoverColor = 'hover:bg-secondary/20',
    borderColor = 'border-primary',
    stripColor = 'bg-primary/20',
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
}: {
    data: Array<Record<string, unknown>> | undefined;
    customColumnRenderer?: Record<string, (row: Record<string, unknown>) => JSX.Element>;
    stripPrefixes?: string[];
    excludesColumnsName?: string[];
    excludesColumnsData?: string[];
    withNumbering?: boolean;
    withActions?: (row: number | unknown) => JSX.Element;
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
}) {
    // derive headers
    const columnName = getDeepKeys(data || [], {
        excludeParents: excludesColumnsData,
    });
    const forHeaderAndFooter = getDeepKeys(data || [], {
        stripPrefixes,
        excludeParents: excludesColumnsName,
        renameMap,
    });

    // flatten rows
    const rows = useMemo(
        () => data?.map(item => flattenObject(item)) || [],
        [data]
    );

    // search state
    const [searchTerm, setSearchTerm] = useState('');
    // filtered rows based on searchTerm
    const filteredRows = useMemo(() => {
        if (!searchTerm.trim()) return rows;
        const lower = searchTerm.toLowerCase();
        return rows.filter(row =>
            Object.values(row).some(val =>
                val != null && String(val).toLowerCase().includes(lower)
            )
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

    return (
        <div className="flex flex-col">
            <div
                className={`${pagination.textColor?.text ? pagination.textColor.text:"text-primary/80"} ${pagination.paginated ? 'justify-between':'justify-end'} w-full flex items-center`}
            >
                {pagination.paginated && (
                    <div className={"py-6 flex flex-col md:flex-row gap-2 items-center justify-center"}>
                        <span>Show </span>
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
                        <span> Entries</span>
                    </div>
                )}
                {withSearch.searchStatus && (
                    <div className={`${withSearch.textColor?withSearch.textColor:"text-primary/80"} capitalize flex items-center`}>
                        <label htmlFor="table-search" className="mr-2">
                            Search:
                        </label>
                        <input
                            id="table-search"
                            type="text"
                            placeholder="Search..."
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
                        <tr className={` ${borderColor} border-b w-full uppercase tracking-wider `}>
                            {withNumbering && <th className="px-4 py-2">no.</th>}
                            {forHeaderAndFooter.map((item, idx) => (
                                <th key={idx} className={`${borderColor} px-4 py-2 border-x`}>
                                    {item}
                                </th>
                            ))}
                            {withActions && <th className="px-4 py-2">actions</th>}
                        </tr>
                    </thead>
                    <tbody className={`${poppins.className}`}>
                    {currentData.map((row, idx) => (
                        <tr
                            key={idx}
                            className={`${rowHover ? hoverColor : ''} ${
                                variants === 'strip' && idx % 2 !== 1 ? stripColor : rowColor
                            } ${borderColor} border-y`}
                        >
                            {withNumbering && (
                                <td className="text-center">{start + idx + 1}</td>
                            )}

                            {columnName.map((col, cidx) => (
                                <td key={cidx} className={`${borderColor} px-4 py-2 border-x`}>
                                    {typeof customColumnRenderer[col] === 'function' // Jika ada renderer kustom, gunakan
                                        ? customColumnRenderer[col](row)
                                        : row[col] != null
                                            ? String(row[col])
                                            : '-'}
                                </td>
                            ))}
                            {withActions ? withActions(row["id"]) :""
                            }
                        </tr>
                    ))}
                    {currentData.length === 0 && (
                        <tr>
                            <td colSpan={forHeaderAndFooter.length + (withNumbering ? 1 : 0) + (withActions ? 1 : 0)} className="py-4 text-center">
                                No data found
                            </td>
                        </tr>
                    )}
                    </tbody>
                    {withFooter && (
                        <tfoot className={`${delaGothic.className} ${headColor}`}>
                        <tr className="w-full uppercase tracking-wider">
                            {withNumbering && <th className="px-4 py-2">no.</th>}
                            {forHeaderAndFooter.map((item, idx) => (
                                <th key={idx} className={`${borderColor} px-4 py-2 border-x`}>
                                    {item}
                                </th>
                            ))}
                            {withActions && <th className="px-4 py-2">actions</th>}
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
