import { useEffect, useState } from "react";
import api from "../services/api";

type UseProductFiltersResult = {
    searchTerm: string;
    activeCategory: string;
    categories: string[];
    setSearchTerm: (value: string) => void;
    setActiveCategory: (value: string) => void;
};

function useProductFilters(): UseProductFiltersResult {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [categories, setCategories] = useState<string[]>(["Todos"]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/produtos", {
                    params: {
                        limit: 60,
                        offset: 0,
                    },
                });

                const uniqueCategories = new Set<string>();

                response.data.forEach((product: { categoria_produto: string }) => {
                    const comEspacos = product.categoria_produto.replaceAll("_", " ").toLocaleLowerCase("pt-BR");
                    const categoria = comEspacos.charAt(0).toLocaleUpperCase("pt-BR") + comEspacos.slice(1);
                    uniqueCategories.add(categoria);
                });

                setCategories(["Todos", ...uniqueCategories]);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories(["Todos"]);
            }
        };

        fetchCategories();
    }, []);

    return {
        searchTerm,
        activeCategory,
        categories,
        setSearchTerm,
        setActiveCategory,
    };
}

export default useProductFilters;
