import { ReviewStars, ReviewAvatar } from "../atoms";
import type { ProdutoAvaliacao } from "../../types/produtos";

type ProductReviewItemProps = {
    review: ProdutoAvaliacao;
};

function ProductReviewItem({ review }: ProductReviewItemProps) {
    return (
        <article className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <ReviewAvatar name={review.consumerName} />
            <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-slate-950">{review.consumerName}</h3>
                    <ReviewStars averageReviews={review.rating} />
                </div>
                {review.commentTitle ? (
                    <p className="mt-1 text-sm font-semibold text-slate-700">{review.commentTitle}</p>
                ) : null}
                {review.comment ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
                ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">Sem comentário adicional.</p>
                )}
            </div>
        </article>
    );
}

export default ProductReviewItem;