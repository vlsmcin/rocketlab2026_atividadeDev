import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

type UseProductCategoriesResult = {
    categories: string[];
    isLoadingCategories: boolean;
    refetchCategories: () => Promise<void>;
};

function useProductCategories(): UseProductCategoriesResult {
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const refetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);

        try {
            const response = await api.get("/produtos", {
                params: {
                    limit: 200,
                    offset: 0,
                },
            });

            const uniqueCategories = new Set<string>();

            response.data.forEach((product: { categoria_produto: string }) => {
                const comEspacos = product.categoria_produto.replaceAll("_", " ").toLocaleLowerCase("pt-BR");
                const categoria = comEspacos.charAt(0).toLocaleUpperCase("pt-BR") + comEspacos.slice(1);
                uniqueCategories.add(categoria);
            });

            setCategories(Array.from(uniqueCategories));
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        void refetchCategories();
    }, [refetchCategories]);

    return {
        categories,
        isLoadingCategories,
        refetchCategories,
    };
}

export default useProductCategories;