import { FC } from 'react';
import { getPageItems } from '@/lib/utils/getPageItems';
import useWindowWidth from "@/hook/useWindowWidth";

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
    const windowSize = useWindowWidth()
    const maxSize = windowSize === "xs"?1:windowSize === "sm"?1:windowSize === "md"?2:windowSize === "lg"?3:windowSize === "xl"?4:5
    const items = getPageItems(currentPage, totalPages, maxSize);

    return (
        <div className={`${activePage?.text ? activePage.text :"text-primary/80"} flex items-center space-x-1`}>
            {items.map(it => {
                if (it.type === 'prev') {
                    return (
                        <button
                            key="prev"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={it.disabled}
                            className={
                                "px-2 py-1 rounded-full cursor-pointer shadow-sm shadow-primary text-nowrap text-xs sm:text-sm md:text-base" +
                                (it.disabled
                                    ? " opacity-50 bg-primary/20 cursor-not-allowed"
                                    : " hover:bg-primary/20")
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
                                "px-2 py-1 rounded-full cursor-pointer shadow-sm shadow-primary text-nowrap text-xs sm:text-sm md:text-base" +
                                (it.disabled
                                  ? " opacity-50 bg-primary/20 cursor-not-allowed"
                                  : " hover:bg-primary/20")
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
                            className="px-2 py-1 text-primary font-bold select-none tracking-wider text-nowrap text-xs sm:text-sm md:text-base"
                        >
                          . . . .
                        </span>
                    );
                }

                // type === 'page'
                const isActive = it.page === currentPage;
                const baseClass = "px-4 py-1 rounded-full shadow-sm shadow-primary text-xs sm:text-sm md:text-base ";
                const finalClass = isActive
                    ? baseClass + (activePage?.active ? activePage.active : " bg-primary text-tertiary")
                    : baseClass + " hover:bg-primary/20";

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
