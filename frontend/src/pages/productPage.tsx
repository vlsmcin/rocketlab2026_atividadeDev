import { Link, useParams } from "react-router-dom";
import useProductDetail from "../hooks/useProductDetail";
import { ProductDetailView } from "../components/templates";

function ProductPage() {
    const { idProduto } = useParams();
    const { product, isLoading, error } = useProductDetail(idProduto);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#f8fafc_45%,#eef2ff_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between rounded-[1.5rem] bg-white/85 px-4 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur md:px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                    >
                        <span aria-hidden="true">←</span>
                        Voltar
                    </Link>
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
            </div>
        </main>
    );
}

export default ProductPage;