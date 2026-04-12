type PaginationControlsProps = {
    currentPage: number;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
};

function PaginationControls({ currentPage, hasNextPage, onPageChange }: PaginationControlsProps) {
    const projectedLastPage = hasNextPage ? Math.max(5, currentPage + 4) : currentPage;
    const shouldCollapse = currentPage >= 5;
    const collapsedPages = Array.from(
        new Set([
            Math.max(2, currentPage - 1),
            currentPage,
            Math.min(projectedLastPage, currentPage + 1),
        ]),
    );
    const visiblePages = Array.from({ length: Math.min(5, projectedLastPage) }, (_, index) => index + 1);

    function renderPageButton(page: number) {
        return (
            <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
            >
                {page}
            </button>
        );
    }

    return (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginação de produtos">
            <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {!shouldCollapse && visiblePages.map((page) => renderPageButton(page))}

            {shouldCollapse && (
                <>
                    {renderPageButton(1)}
                    <span className="px-1 text-sm font-semibold text-slate-500" aria-hidden="true">
                        ...
                    </span>
                    {collapsedPages.map((page) => renderPageButton(page))}
                </>
            )}

            <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
            >
                &gt;
            </button>
        </nav>
    );
}

export default PaginationControls;
