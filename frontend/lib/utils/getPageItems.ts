// lib/utils/getPageItems.ts
/**
 * Represents different types of pagination items
 */
export type PageItem =
    | { type: 'page'; page: number }
    | { type: 'ellipsis'; key: string }
    | { type: 'prev'; disabled: boolean }
    | { type: 'next'; disabled: boolean };

/**
 * Generates an array of pagination items based on the current page and total pages
 * @param currentPage - The current active page number
 * @param totalPages - The total number of pages
 * @param maxVisiblePages - Maximum number of visible page buttons (default: 4)
 * @returns Array of pagination items
 */
export function getPageItems(
    currentPage: number,
    totalPages: number,
    maxVisiblePages: number = 4
): PageItem[] {
    const items: PageItem[] = [];

    // Prev
    items.push({ type: 'prev', disabled: currentPage === 1 });

    if (totalPages <= maxVisiblePages) {
        // Jika total halaman lebih kecil atau sama dengan maksimum tombol yang diizinkan, tampilkan semua halaman
        for (let p = 1; p <= totalPages; p++) {
            items.push({ type: 'page', page: p });
        }
    } else {
        // Total halaman lebih besar daripada maksimum tombol yang diizinkan
        const first = 1;
        const last = totalPages;

        const middleRange = Math.floor(maxVisiblePages / 2);
        const startPage = Math.max(
            Math.min(currentPage - middleRange, totalPages - maxVisiblePages + 1),
            first + 1
        );
        const endPage = Math.min(
            startPage + maxVisiblePages - 1,
            last - 1
        );

        // Tambahkan tombol awal dan elipsis jika perlu
        if (startPage > first + 1) {
            items.push({ type: 'page', page: first });
            items.push({ type: 'ellipsis', key: 'e1' });
        } else {
            for (let p = first; p < startPage; p++) {
                items.push({ type: 'page', page: p });
            }
        }

        // Tambahkan tombol tengah
        for (let p = startPage; p <= endPage; p++) {
            items.push({ type: 'page', page: p });
        }

        // Tambahkan tombol akhir dan elipsis jika perlu
        if (endPage < last - 1) {
            items.push({ type: 'ellipsis', key: 'e2' });
            items.push({ type: 'page', page: last });
        } else {
            for (let p = endPage + 1; p <= last; p++) {
                items.push({ type: 'page', page: p });
            }
        }
    }

    // Next
    items.push({ type: 'next', disabled: currentPage === totalPages });

    return items;
}
