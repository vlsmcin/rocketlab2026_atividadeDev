import { CategoryName, ReviewStars, InfoPill, DetailMetric } from "../atoms";
import type { ProdutoDetail } from "../../types/produtos";
import { formatCurrencyBRL, formatDimensions, formatWeight } from "../../utils/produtos";

type ProductDetailHeroProps = {
    product: ProdutoDetail;
};

function ProductDetailHero({ product }: ProductDetailHeroProps) {
    const prices = product.sellers.map((seller) => seller.price);
    const minimumPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maximumPrice = prices.length > 0 ? Math.max(...prices) : null;
    const priceLabel = minimumPrice === null || maximumPrice === null
        ? "Preço não informado"
        : minimumPrice === maximumPrice
            ? formatCurrencyBRL(minimumPrice)
            : `${formatCurrencyBRL(minimumPrice)} - ${formatCurrencyBRL(maximumPrice)}`;

    return (
        <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
            <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-100 via-slate-50 to-white">
                {product.urlImage ? (
                    <img
                        src={product.urlImage}
                        alt={product.name}
                        className="h-full min-h-[22rem] w-full object-cover"
                    />
                ) : (
                    <div className="flex min-h-[22rem] items-center justify-center px-8 text-center text-slate-400">
                        Imagem não disponível
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center gap-6 px-2 py-2 lg:px-3">
                <div className="flex flex-wrap items-center gap-3">
                    <InfoPill>{product.category}</InfoPill>
                    <CategoryName categoria={`${product.sellers.length} vendedor${product.sellers.length === 1 ? "" : "es"}`} />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-500">
                        Informações consolidadas do catálogo, com avaliações dos consumidores e vendedores disponíveis.
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Faixa de preço</p>
                    <p className="text-3xl font-semibold text-slate-950">{priceLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <ReviewStars averageReviews={product.averageRating} />
                    <p className="text-sm text-slate-600">
                        {product.averageRating.toFixed(1)} ({product.reviewCount} {product.reviewCount === 1 ? "avaliação" : "avaliações"})
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <DetailMetric
                        label="Peso"
                        value={formatWeight(product.weightGrams)}
                        icon={
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M6 9h12" />
                                <path d="M8 9a4 4 0 0 1 8 0" />
                                <path d="M7 9l-2 11h14L17 9" />
                            </svg>
                        }
                    />
                    <DetailMetric
                        label="Dimensões"
                        value={formatDimensions(product.lengthCentimeters, product.widthCentimeters, product.heightCentimeters)}
                        icon={
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M3 7l9-4 9 4-9 4-9-4Z" />
                                <path d="M12 11v9" />
                                <path d="m3 7 9 4 9-4" />
                            </svg>
                        }
                    />
                    <DetailMetric
                        label="Vendedores"
                        value={`${product.sellers.length}`}
                        icon={
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M16 11a4 4 0 1 0-8 0" />
                                <path d="M5 20a7 7 0 0 1 14 0" />
                                <path d="M19 8a3 3 0 1 0-3 3" />
                            </svg>
                        }
                    />
                    <DetailMetric
                        label="Avaliações"
                        value={`${product.reviewCount}`}
                        icon={
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m12 3 2.9 5.9 6.6 1-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5L2.5 9.9l6.6-1L12 3Z" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </section>
    );
}

export default ProductDetailHero;