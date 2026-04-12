import type { ChangeEvent } from "react";
import { SearchBar } from "../atoms";
import { CategoryFilterList } from "../molecules";

type ProductFiltersProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
};

function ProductFilters({
    searchTerm,
    onSearchChange,
    categories,
    activeCategory,
    onCategoryChange,
}: ProductFiltersProps) {
    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        onSearchChange(event.target.value);
    }

    return (
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="w-full lg:min-w-[50%] lg:basis-1/2">
                <SearchBar value={searchTerm} onChange={handleSearchChange} />
            </div>
            <div className="w-full lg:min-w-0 lg:basis-1/2">
                <CategoryFilterList
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={onCategoryChange}
                />
            </div>
        </section>
    );
}

export default ProductFilters;
