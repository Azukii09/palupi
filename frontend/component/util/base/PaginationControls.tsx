import { FC } from 'react';
import { getPageItems } from '@/lib/utils/getPageItems';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    activePage?: {
        active: string;
        text: string;
        pageNumber: string;
    };
}

export const PaginationControls: FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    activePage,
}) => {
    const items = getPageItems(currentPage, totalPages);

    return (
        <div className={`${activePage?.text ? activePage.text :"text-admin-title/80"} flex items-center space-x-1`}>
            {items.map(it => {
                if (it.type === 'prev') {
                    return (
                        <button
                            key="prev"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={it.disabled}
                            className={
                                "px-2 py-1 rounded-full cursor-pointer shadow-sm shadow-admin-accent" +
                                (it.disabled
                                    ? " opacity-50 cursor-not-allowed"
                                    : " hover:bg-gray-100")
                            }
                        >
                            ‹ Prev
                        </button>
                    );
                }
                if (it.type === 'next') {
                    return (
                        <button
                            key="next"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={it.disabled}
                            className={
                                "px-2 py-1 rounded-full cursor-pointer shadow-sm shadow-admin-accent" +
                                (it.disabled
                                    ? " opacity-50 cursor-not-allowed"
                                    : " hover:bg-gray-100")
                            }
                        >
                            Next ›
                        </button>
                    );
                }
                if (it.type === 'ellipsis') {
                    return (
                        <span
                            key={it.key}
                            className="px-2 py-1 text-primary font-bold select-none tracking-wider"
                        >
                          . . . .
                        </span>
                    );
                }

                // type === 'page'
                const isActive = it.page === currentPage;
                const baseClass = "px-4 py-1 rounded-full shadow-sm shadow-admin-accent ";
                const finalClass = isActive
                    ? baseClass + (activePage?.active ? activePage.active : " bg-primary text-white")
                    : baseClass + " hover:bg-gray-100";

                return (
                    <button
                        key={it.page}
                        onClick={() => onPageChange(it.page)}
                        className={`${finalClass} cursor-pointer`}
                    >
                        {it.page}
                    </button>
                );
            })}
        </div>
    );
};
