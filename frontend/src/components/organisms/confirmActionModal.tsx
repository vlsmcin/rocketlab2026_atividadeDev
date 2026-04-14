type ConfirmActionModalProps = {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isConfirming?: boolean;
    errorMessage?: string | null;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
};

function ConfirmActionModal({
    isOpen,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    isConfirming = false,
    errorMessage = null,
    onCancel,
    onConfirm,
}: ConfirmActionModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-3 text-base text-slate-600">{description}</p>

                {errorMessage && (
                    <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
                        {errorMessage}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isConfirming}
                        className="cursor-pointer rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            void onConfirm();
                        }}
                        disabled={isConfirming}
                        className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isConfirming ? "Removendo..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmActionModal;