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
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-slate-100/90">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-4xl font-bold text-slate-900">Produtos</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <ProductFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
                <ProductList products={filteredProducts} />
            </div>
        </main>
    );
}

export default HomePage;