type ProductCreateActionsProps = {
    isSubmitting: boolean;
    onCancel: () => void;
    submitLabel?: string;
};

function ProductCreateActions({ isSubmitting, onCancel, submitLabel = "Salvar produto" }: ProductCreateActionsProps) {
    return (
        <div className="mt-6 flex justify-end gap-3">
            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="cursor-pointer rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting ? "Salvando..." : submitLabel}
            </button>
        </div>
    );
}

export default ProductCreateActions;