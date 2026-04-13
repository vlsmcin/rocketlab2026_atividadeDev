import { useEffect, useState } from "react";
import api from "../services/api";
import type { BackendProdutoDetailView, ProdutoDetail } from "../types/produtos";
import { formatCategoria } from "../utils/produtos";

type UseProductDetailResult = {
    product: ProdutoDetail | null;
    isLoading: boolean;
    error: string | null;
};

function useProductDetail(idProduto?: string): UseProductDetailResult {
    const [product, setProduct] = useState<ProdutoDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchProduct = async () => {
            if (!idProduto) {
                if (isActive) {
                    setProduct(null);
                    setError("Produto não informado.");
                    setIsLoading(false);
                }

                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get<BackendProdutoDetailView>(`/produtos/${idProduto}`);
                const data = response.data;

                if (!isActive) {
                    return;
                }

                setProduct({
                    id: data.id_produto,
                    name: data.nome_produto,
                    category: formatCategoria(data.categoria_produto),
                    urlImage: data.url_imagem ?? "",
                    averageRating: data.media_avaliacao ?? 0,
                    reviewCount: data.quantidade_avaliacoes,
                    weightGrams: data.peso_produto_gramas,
                    lengthCentimeters: data.comprimento_centimetros,
                    widthCentimeters: data.largura_centimetros,
                    heightCentimeters: data.altura_centimetros,
                    evaluations: (data.avaliacoes ?? []).map((review) => ({
                        id: review.id_avaliacao,
                        rating: review.avaliacao,
                        consumerName: review.nome_consumidor,
                        commentTitle: review.titulo_comentario,
                        comment: review.comentario,
                    })),
                    sellers: (data.vendedores ?? []).map((seller) => ({
                        id: seller.id_vendedor,
                        name: seller.nome_vendedor,
                        price: seller.preco_brl,
                        city: seller.cidade,
                        state: seller.estado,
                    })),
                });
            } catch (fetchError) {
                if (isActive) {
                    setProduct(null);
                    setError(fetchError instanceof Error ? fetchError.message : "Erro ao carregar produto.");
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        fetchProduct();

        return () => {
            isActive = false;
        };
    }, [idProduto]);

    return { product, isLoading, error };
}

export default useProductDetail;