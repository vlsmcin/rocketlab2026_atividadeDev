import { useState, useEffect } from "react";
import type { BackendProdutoListView, Produto } from "../types/produtos";
import api from "../services/api";
import { formatCategoria } from "../utils/produtos";

type UseProductListParams = {
    page: number;
    limit: number;
    title?: string;
    categoria?: string;
};

type UseProductListResult = {
    products: Produto[];
    isLoading: boolean;
    hasNextPage: boolean;
};

function useProductList({ page, limit, title, categoria }: UseProductListParams): UseProductListResult {
    const [products, setProducts] = useState<Produto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);

            try {
                const response = await api.get("/produtos", {
                    params: {
                        title: title || undefined,
                        categoria: categoria || undefined,
                        limit,
                        offset: (page - 1) * limit,
                    },
                });
                const mappedProducts: Produto[] = response.data.map((product: BackendProdutoListView) => ({
                    id: product.id_produto,
                    name: product.nome_produto,
                    category: formatCategoria(product.categoria_produto),
                    urlImage: product.url_imagem ?? "",
                    averageRating: product.media_avaliacao ?? 0,
                    reviewCount: product.quantidade_avaliacoes,
                }));

                setProducts(mappedProducts);
                setHasNextPage(mappedProducts.length === limit);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                setHasNextPage(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categoria, limit, page, title]);

    return { products, isLoading, hasNextPage };
}

export default useProductList;