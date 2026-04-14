import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductList } from "../components/templates";
import { ProductCreateModal, ProductFilters } from "../components/organisms";
import { PaginationControls } from "../components/molecules";
import { useProductCreate, useProductFilters, useProductList } from "../hooks";
import type { ProdutoCreateFormData } from "../types/produtos";
import { normalizeCategoriaForBackend, parseOptionalNumberInput } from "../utils/produtos";

function HomePage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {
        searchTerm,
        activeCategory,
        categories,
        setSearchTerm,
        setActiveCategory,
        refetchCategories,
    } = useProductFilters();
    const { isCreating, createError, clearCreateError, createProduct } = useProductCreate();

    const { products, isLoading, hasNextPage, refetchProducts } = useProductList({
        page,
        limit: 12,
        title: searchTerm,
        categoria: activeCategory === "Todos" ? undefined : activeCategory,
    });

    const handleOpenCreateModal = () => {
        clearCreateError();
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        if (isCreating) {
            return;
        }

        clearCreateError();
        setIsCreateModalOpen(false);
    };

    const handleCreateProduct = async (formValues: ProdutoCreateFormData) => {
        const created = await createProduct({
            nome_produto: formValues.nomeProduto.trim(),
            categoria_produto: normalizeCategoriaForBackend(formValues.categoriaProduto),
            peso_produto_gramas: parseOptionalNumberInput(formValues.pesoProdutoGramas),
            comprimento_centimetros: parseOptionalNumberInput(formValues.comprimentoCentimetros),
            largura_centimetros: parseOptionalNumberInput(formValues.larguraCentimetros),
            altura_centimetros: parseOptionalNumberInput(formValues.alturaCentimetros),
        });

        if (!created) {
            return;
        }

        setIsCreateModalOpen(false);
        setSearchTerm("");
        setActiveCategory("Todos");
        setPage(1);
        refetchProducts();
        await refetchCategories();
    };

    useEffect(() => {
        setPage(1);
    }, [activeCategory, searchTerm]);

    return (
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-slate-100/90">
                <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Gerenciador de Produtos</h1>
                        <p className="mt-1 text-lg text-slate-600">{products.length} produtos no catálogo</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700"
                    >
                        + Novo Produto
                    </button>
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
                        <ProductList products={products} onProductClick={(productId) => navigate(`/produtos/${productId}`)} />
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

            <ProductCreateModal
                isOpen={isCreateModalOpen}
                categories={categories}
                isSubmitting={isCreating}
                errorMessage={createError}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreateProduct}
            />
        </main>
    );
}

export default HomePage;