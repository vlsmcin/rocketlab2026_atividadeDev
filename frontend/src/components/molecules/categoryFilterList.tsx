import { CategoryFilterChip } from "../atoms";

type CategoryFilterListProps = {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
};

function CategoryFilterList({ categories, activeCategory, onCategoryChange }: CategoryFilterListProps) {
    return (
        <div className="w-full max-w-full overflow-x-auto pb-1 scroll-smooth [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/80">
            <div className="flex w-max items-center gap-3 whitespace-nowrap pr-4">
                {categories.map((category) => (
                    <CategoryFilterChip
                        key={category}
                        label={category}
                        isActive={activeCategory === category}
                        onClick={() => onCategoryChange(category)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CategoryFilterList;
