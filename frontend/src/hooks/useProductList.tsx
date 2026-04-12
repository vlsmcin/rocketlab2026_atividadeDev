import { useState, useEffect } from "react";
import type { Produto } from "../types/produtos";
import api from "../services/api";

function useProductList() : Produto[] {
    const [products, setProducts] = useState<Produto[]>([]);

    function formatCategoria(value: string) {
        const comEspacos = value.replaceAll("_", " ").toLocaleLowerCase("pt-BR");
        return comEspacos.charAt(0).toLocaleUpperCase("pt-BR") + comEspacos.slice(1);
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/produtos");
                const mappedProducts: Produto[] = response.data.map((product: {
                    id_produto: string;
                    nome_produto: string;
                    categoria_produto: string;
                    url_imagem: string | null;
                    media_avaliacao: number | null;
                    quantidade_avaliacoes: number;
                }) => ({
                    id: product.id_produto,
                    name: product.nome_produto,
                    category: formatCategoria(product.categoria_produto),
                    urlImage: product.url_imagem ?? "",
                    averageRating: product.media_avaliacao ?? 0,
                    reviewCount: product.quantidade_avaliacoes,
                }));

                setProducts(mappedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return products;
}

export default useProductList;