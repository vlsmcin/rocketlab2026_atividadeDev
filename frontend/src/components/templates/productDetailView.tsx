import type { ProdutoDetail } from "../../types/produtos";
import { ProductDetailHero, ProductDetailSections } from "../organisms";

type ProductDetailViewProps = {
    product: ProdutoDetail;
};

function ProductDetailView({ product }: ProductDetailViewProps) {
    return (
        <div className="space-y-6">
            <ProductDetailHero product={product} />
            <ProductDetailSections product={product} />
        </div>
    );
}

export default ProductDetailView;