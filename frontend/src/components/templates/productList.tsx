import { ProductCard } from "../organisms";
import { useProductList } from "../../hooks";

function ProductList() {
    const productList = useProductList();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    category={product.category}
                    averageRating={product.averageRating}
                    imageUrl={product.urlImage}
                    reviewCount={product.reviewCount}
                />
            ))}
        </div>
    )
}

export default ProductList;