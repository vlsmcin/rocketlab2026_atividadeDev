import type { Produto } from "../../types/produtos";
import { ProductCard } from "../organisms";

type ProductListProps = {
    products: Produto[];
};

function ProductList({ products }: ProductListProps) {

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    category={product.category}
                    averageRating={product.averageRating}
                    imageUrl={product.urlImage}
                    reviewCount={product.reviewCount}
                    onClick={() => console.log(product.id)}
                />
            ))}
        </div>
    );
}

export default ProductList;