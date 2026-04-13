import type { ProdutoDetail } from "../../types/produtos";
import ProductReviewList from "./productReviewList";
import ProductSellerList from "./productSellerList";

type ProductDetailSectionsProps = {
    product: ProdutoDetail;
};

function ProductDetailSections({ product }: ProductDetailSectionsProps) {
    return (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <ProductReviewList reviews={product.evaluations} />
            <ProductSellerList sellers={product.sellers} />
        </div>
    );
}

export default ProductDetailSections;