type ProductNameProps = {
    nome: string;
};

function ProductName({ nome }: ProductNameProps) {
    return <h3 className="text-2xl font-bold text-gray-900">{nome}</h3>;
}

export default ProductName;