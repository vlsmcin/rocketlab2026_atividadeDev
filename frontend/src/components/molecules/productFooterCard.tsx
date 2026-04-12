import { CategoryName, ReviewStars, ProductName, ReviewCount } from "../atoms";

type ProductFooterCardProps = {
    name: string;
    category: string;
    averageReview: number | null;
    reviewCount: number;
};

function ProductFooterCard({ name, category, averageReview, reviewCount }: ProductFooterCardProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <ProductName nome={name} />
                </div>
                <CategoryName categoria={category} />
            </div>
            <div className="flex items-center gap-1">
                <ReviewStars averageReviews={averageReview} />
                <ReviewCount countReviews={reviewCount} />
            </div>
        </div>
    );
}

export default ProductFooterCard;