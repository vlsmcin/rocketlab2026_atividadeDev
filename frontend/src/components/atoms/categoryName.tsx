type CategoryNameProps = {
    categoria: string;
};

function CategoryName({ categoria }: CategoryNameProps) {
    return (
        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            {categoria}
        </span>
    );
}

export default CategoryName;