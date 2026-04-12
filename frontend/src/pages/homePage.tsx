import ProductList from "../components/templates";

function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Produtos</h1>
            <ProductList />
        </div>
    );
}

export default HomePage;