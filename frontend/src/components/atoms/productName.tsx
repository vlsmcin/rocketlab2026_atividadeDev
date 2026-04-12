type ProductNameProps = {
    nome: string;
};

function ProductName({ nome }: ProductNameProps) {
    return (
        <h3
            title={nome}
            className="text-xl font-bold leading-tight text-gray-900"
            style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
            }}
        >
            {nome}
        </h3>
    );
}

export default ProductName;