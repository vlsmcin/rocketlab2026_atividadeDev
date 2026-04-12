import { CategoryName, ReviewStars, ProductName, ReviewCount } from "../atoms";

type ProductFooterCardProps = {
    name: string;
    category: string;
    averageReview: number | null;
    reviewCount: number;
};

function ProductFooterCard({ name, category, averageReview, reviewCount }: ProductFooterCardProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <ProductName nome={name} />
                <CategoryName categoria={category} />
            </div>
            <ReviewStars averageReviews={averageReview} />
            <ReviewCount countReviews={reviewCount} />
        </div>
    );
}

export default ProductFooterCard;