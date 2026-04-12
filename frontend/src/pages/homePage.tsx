import { useEffect, useState } from "react";
import ProductList from "../components/templates";
import { ProductFilters } from "../components/organisms";
import { PaginationControls } from "../components/molecules";
import { useProductFilters, useProductList } from "../hooks";

function HomePage() {
    const [page, setPage] = useState(1);
    const {
        searchTerm,
        activeCategory,
        categories,
        setSearchTerm,
        setActiveCategory,
    } = useProductFilters();

    const { products, isLoading, hasNextPage } = useProductList({
        page,
        limit: 12,
        title: searchTerm,
        categoria: activeCategory === "Todos" ? undefined : activeCategory,
    });

    useEffect(() => {
        setPage(1);
    }, [activeCategory, searchTerm]);

    return (
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-slate-100/90">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-4xl font-bold text-slate-900">Produtos</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <ProductFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {!isLoading && products.length === 0 && (
                    <section className="flex min-h-[45vh] items-center justify-center">
                        <div className="text-center text-slate-600">
                            <p className="text-4xl font-semibold">Nenhum produto encontrado.</p>
                            <p className="mt-2 text-3xl">Tente ajustar sua busca ou filtros.</p>
                        </div>
                    </section>
                )}

                {!isLoading && products.length > 0 && (
                    <>
                        <ProductList products={products} />
                        <PaginationControls currentPage={page} hasNextPage={hasNextPage} onPageChange={setPage} />
                    </>
                )}
            </div>

            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/90 px-8 py-6 shadow-xl ring-1 ring-slate-200">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600" />
                        <p className="text-lg font-semibold text-slate-700">Carregando produtos...</p>
                    </div>
                </div>
            )}
        </main>
    );
}

export default HomePage;