import { useMemo, useState } from "react";
import type { Produto } from "../types/produtos";

type UseProductFiltersResult = {
    searchTerm: string;
    activeCategory: string;
    categories: string[];
    filteredProducts: Produto[];
    setSearchTerm: (value: string) => void;
    setActiveCategory: (value: string) => void;
};

function useProductFilters(products: Produto[]): UseProductFiltersResult {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");

    const categories = useMemo(
        () => ["Todos", ...new Set(products.map((product) => product.category))],
        [products],
    );

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");

        return products.filter((product) => {
            const isInCategory = activeCategory === "Todos" || product.category === activeCategory;
            const matchesSearch =
                normalizedSearch.length === 0 ||
                product.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
                product.category.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

            return isInCategory && matchesSearch;
        });
    }, [activeCategory, products, searchTerm]);

    return {
        searchTerm,
        activeCategory,
        categories,
        filteredProducts,
        setSearchTerm,
        setActiveCategory,
    };
}

export default useProductFilters;
