import { ProductFooterCard } from "../molecules";
import { ImageWithHover } from "../atoms";

type ProductCardProps = {
    name: string;
    category: string;
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
};

function ProductCard({ name, category, imageUrl, averageRating, reviewCount }: ProductCardProps) {
    return (
        <div className="w-full rounded-lg bg-white p-4 shadow-md">
            <ImageWithHover src={imageUrl} alt={name} />
            <ProductFooterCard name={name} category={category} averageReview={averageRating} reviewCount={reviewCount} />
        </div>
    );
}

export default ProductCard;