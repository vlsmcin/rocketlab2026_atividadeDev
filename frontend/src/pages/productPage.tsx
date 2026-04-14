import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProductDetail from "../hooks/useProductDetail";
import { ProductDetailView } from "../components/templates";
import { AuthLoginModal, ConfirmActionModal, ProductCreateModal } from "../components/organisms";
import { useAuth } from "../context/authContext";
import { useProductCategories, useProductDelete, useProductUpdate } from "../hooks";
import type { ProdutoCreateFormData } from "../types/produtos";
import { normalizeCategoriaForBackend, parseOptionalNumberInput } from "../utils/produtos";

function ProductPage() {
    const navigate = useNavigate();
    const {
        user,
        isAdmin,
        isAuthenticated,
        isAuthenticating,
        loginError,
        login,
        logout,
    } = useAuth();
    const { idProduto } = useParams();
    const { product, isLoading, error, refetchProduct } = useProductDetail(idProduto);
    const { categories, isLoadingCategories } = useProductCategories();
    const { isUpdating, updateError, clearUpdateError, updateProduct } = useProductUpdate();
    const { isDeleting, deleteError, clearDeleteError, deleteProduct } = useProductDelete();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const editInitialValues = useMemo<Partial<ProdutoCreateFormData>>(() => {
        if (!product) {
            return {};
        }

        return {
            nomeProduto: product.name,
            categoriaProduto: product.category,
            pesoProdutoGramas: product.weightGrams === null ? "" : String(product.weightGrams),
            comprimentoCentimetros: product.lengthCentimeters === null ? "" : String(product.lengthCentimeters),
            larguraCentimetros: product.widthCentimeters === null ? "" : String(product.widthCentimeters),
            alturaCentimetros: product.heightCentimeters === null ? "" : String(product.heightCentimeters),
        };
    }, [product]);

    const handleOpenEditModal = () => {
        if (!product || !isAdmin) {
            return;
        }

        clearUpdateError();
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        if (isUpdating) {
            return;
        }

        clearUpdateError();
        setIsEditModalOpen(false);
    };

    const handleSubmitEdit = async (formValues: ProdutoCreateFormData) => {
        if (!product || !isAdmin) {
            return;
        }

        const updated = await updateProduct(product.id, {
            nome_produto: formValues.nomeProduto.trim(),
            categoria_produto: normalizeCategoriaForBackend(formValues.categoriaProduto),
            peso_produto_gramas: parseOptionalNumberInput(formValues.pesoProdutoGramas),
            comprimento_centimetros: parseOptionalNumberInput(formValues.comprimentoCentimetros),
            largura_centimetros: parseOptionalNumberInput(formValues.larguraCentimetros),
            altura_centimetros: parseOptionalNumberInput(formValues.alturaCentimetros),
        });

        if (!updated) {
            return;
        }

        setIsEditModalOpen(false);
        refetchProduct();
    };

    const handleOpenDeleteModal = () => {
        if (!product || !isAdmin) {
            return;
        }

        clearDeleteError();
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) {
            return;
        }

        clearDeleteError();
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!product || !isAdmin) {
            return;
        }

        const removed = await deleteProduct(product.id);

        if (!removed) {
            return;
        }

        navigate("/");
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

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#f8fafc_45%,#eef2ff_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-white/85 px-4 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur md:px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                    >
                        <span aria-hidden="true">←</span>
                        Voltar
                    </Link>

                    <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
                        {isAuthenticated && user && (
                            <p className="text-sm font-medium text-slate-600">{user.username} ({user.role})</p>
                        )}

                        {isAdmin && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleOpenEditModal}
                                    disabled={!product || isLoading}
                                    className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenDeleteModal}
                                    disabled={!product || isLoading}
                                    className="cursor-pointer rounded-2xl bg-red-600 px-5 py-2.5 text-lg font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Remover
                                </button>
                            </>
                        )}

                        {!isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleOpenLoginModal}
                                className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Entrar
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={logout}
                                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-slate-200 bg-white/90 p-10 shadow-sm">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                            <p className="text-lg font-semibold text-slate-700">Carregando produto...</p>
                        </div>
                    </div>
                ) : error ? (
                    <section className="flex flex-1 items-center justify-center rounded-[2rem] border border-slate-200 bg-white/90 p-10 shadow-sm">
                        <div className="max-w-xl text-center">
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Não foi possível carregar o produto</h1>
                            <p className="mt-3 text-base leading-7 text-slate-600">{error}</p>
                            <Link
                                to="/"
                                className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Voltar para a listagem
                            </Link>
                        </div>
                    </section>
                ) : product ? (
                    <ProductDetailView product={product} />
                ) : null}

                {isAdmin && (
                    <>
                        <ProductCreateModal
                            isOpen={isEditModalOpen}
                            categories={categories}
                            isSubmitting={isUpdating}
                            errorMessage={updateError}
                            title="Editar Produto"
                            submitLabel="Salvar alterações"
                            initialValues={editInitialValues}
                            onClose={handleCloseEditModal}
                            onSubmit={handleSubmitEdit}
                        />

                        <ConfirmActionModal
                            isOpen={isDeleteModalOpen}
                            title="Confirmar remoção"
                            description={product ? `Deseja remover o produto ${product.name}? Essa ação não pode ser desfeita.` : "Deseja remover este produto?"}
                            confirmLabel="Remover produto"
                            isConfirming={isDeleting}
                            errorMessage={deleteError}
                            onCancel={handleCloseDeleteModal}
                            onConfirm={handleConfirmDelete}
                        />
                    </>
                )}

                {isAdmin && isLoadingCategories && isEditModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/20">
                        <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow ring-1 ring-slate-200">
                            Carregando categorias...
                        </div>
                    </div>
                )}

                <AuthLoginModal
                    isOpen={isLoginModalOpen}
                    title="Entrar como administrador"
                    description="Somente administrador pode editar e remover produtos."
                    errorMessage={loginError}
                    isSubmitting={isAuthenticating}
                    onClose={handleCloseLoginModal}
                    onSubmit={login}
                />
            </div>
        </main>
    );
}

export default ProductPage;