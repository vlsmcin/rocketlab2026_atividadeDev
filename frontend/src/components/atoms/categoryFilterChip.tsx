type CategoryFilterChipProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function CategoryFilterChip({ label, isActive, onClick }: CategoryFilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap rounded-full cursor-pointer px-6 py-3 text-lg font-semibold transition-colors ${
                isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
        >
            {label}
        </button>
    );
}

export default CategoryFilterChip;
