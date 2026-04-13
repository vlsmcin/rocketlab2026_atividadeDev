import type { ProdutoAvaliacao } from "../../types/produtos";
import { SectionTitle } from "../atoms";
import { ProductReviewItem } from "../molecules";

type ProductReviewListProps = {
    reviews: ProdutoAvaliacao[];
};

function ProductReviewList({ reviews }: ProductReviewListProps) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionTitle title="Avaliações dos consumidores" subtitle="Comentários e notas recebidos para este produto." />
                <p className="text-sm font-medium text-slate-500">{reviews.length} avaliações</p>
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ProductReviewItem key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
                    Nenhuma avaliação disponível para este produto.
                </div>
            )}
        </section>
    );
}

export default ProductReviewList;