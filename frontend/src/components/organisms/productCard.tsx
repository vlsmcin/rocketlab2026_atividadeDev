import { ProductFooterCard } from "../molecules";
import { ImageWithHover } from "../atoms";

type ProductCardProps = {
    name: string;
    category: string;
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
    onClick?: () => void;
};

function ProductCard({ name, category, imageUrl, averageRating, reviewCount, onClick }: ProductCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
            <ImageWithHover src={imageUrl} alt={name} />
            <div className="flex flex-1 p-4">
                <ProductFooterCard name={name} category={category} averageReview={averageRating} reviewCount={reviewCount} />
            </div>
        </button>
    );
}

export default ProductCard;