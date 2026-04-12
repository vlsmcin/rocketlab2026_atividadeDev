import ProductList from "../components/templates";
import { ProductFilters } from "../components/organisms";
import { useProductFilters, useProductList } from "../hooks";

function HomePage() {
    const products = useProductList();
    const {
        searchTerm,
        activeCategory,
        categories,
        filteredProducts,
        setSearchTerm,
        setActiveCategory,
    } = useProductFilters(products);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Produtos</h1>
            <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />
            <ProductList products={filteredProducts} />
        </div>
    );
}

export default HomePage;