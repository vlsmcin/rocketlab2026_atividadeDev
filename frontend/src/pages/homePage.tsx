import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginationControls } from "../components/molecules";
import { AuthLoginModal, ProductCreateModal, ProductFilters } from "../components/organisms";
import { ProductList } from "../components/templates";
import { useAuth } from "../context/authContext";
import { useProductCreate, useProductFilters, useProductList } from "../hooks";
import type { ProdutoCreateFormData } from "../types/produtos";
import { normalizeCategoriaForBackend, parseOptionalNumberInput } from "../utils/produtos";

function HomePage() {
    const navigate = useNavigate();
    const { user, isAdmin, isAuthenticated, isLoadingSession, isAuthenticating, loginError, login, logout } = useAuth();
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { searchTerm, activeCategory, categories, setSearchTerm, setActiveCategory, refetchCategories } = useProductFilters();
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

    const handleOpenLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        if (isAuthenticating) {
            return;
        }

        setIsLoginModalOpen(false);
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
                <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Gerenciador de Produtos</h1>
                        {isAuthenticated && user && <p className="mt-1 text-sm text-slate-600">Logado como {user.username} ({user.role})</p>}
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        {isAdmin ? (
                            <button
                                type="button"
                                onClick={handleOpenCreateModal}
                                className="w-full cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 sm:w-auto sm:text-lg"
                            >
                                + Novo Produto
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpenLoginModal}
                                className="w-full cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 sm:w-auto sm:text-lg"
                            >
                                Entrar
                            </button>
                        )}

                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
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

            <AuthLoginModal
                isOpen={isLoginModalOpen}
                title="Entrar como administrador"
                description="Apenas administradores veem a opcao de criar produtos."
                errorMessage={loginError}
                isSubmitting={isAuthenticating}
                onClose={handleCloseLoginModal}
                onSubmit={login}
            />

            {isLoadingSession && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/35">
                    <div className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
                        Validando sessao...
                    </div>
                </div>
            )}
        </main>
    );
}

export default HomePage;