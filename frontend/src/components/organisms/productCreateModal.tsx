import { useEffect, useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { ProductCreateActions, ProductCreateField } from "../molecules";
import type { ProdutoCreateFormData } from "../../types/produtos";

type ProductCreateModalProps = {
    isOpen: boolean;
    categories: string[];
    isSubmitting: boolean;
    errorMessage: string | null;
    title?: string;
    submitLabel?: string;
    initialValues?: Partial<ProdutoCreateFormData>;
    onClose: () => void;
    onSubmit: (values: ProdutoCreateFormData) => Promise<void>;
};

const INITIAL_FORM_VALUES: ProdutoCreateFormData = {
    nomeProduto: "",
    categoriaProduto: "",
    pesoProdutoGramas: "",
    comprimentoCentimetros: "",
    larguraCentimetros: "",
    alturaCentimetros: "",
};

function ProductCreateModal({
    isOpen,
    categories,
    isSubmitting,
    errorMessage,
    title = "Novo Produto",
    submitLabel = "Salvar produto",
    initialValues,
    onClose,
    onSubmit,
}: ProductCreateModalProps) {
    const availableCategories = useMemo(
        () => categories.filter((category) => category !== "Todos"),
        [categories],
    );
    const [formValues, setFormValues] = useState<ProdutoCreateFormData>(INITIAL_FORM_VALUES);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormValues({
            ...INITIAL_FORM_VALUES,
            ...initialValues,
            categoriaProduto: initialValues?.categoriaProduto ?? availableCategories[0] ?? "",
        });
    }, [availableCategories, initialValues, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit(formValues);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-lg px-3 py-1 text-2xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProductCreateField
                            id="nomeProduto"
                            label="Nome"
                            value={formValues.nomeProduto}
                            onChange={(event) => setFormValues((current) => ({ ...current, nomeProduto: event.target.value }))}
                            placeholder="Nome do produto"
                            required
                            className="md:col-span-2"
                        />

                        <ProductCreateField
                            id="categoriaProduto"
                            label="Categoria"
                            value={formValues.categoriaProduto}
                            onChange={(event) => setFormValues((current) => ({ ...current, categoriaProduto: event.target.value }))}
                            placeholder="Ex.: Eletrônicos"
                            required
                            listId="product-categories"
                            options={availableCategories}
                            className="md:col-span-2"
                        />

                        <ProductCreateField
                            id="pesoProdutoGramas"
                            label="Peso (g)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formValues.pesoProdutoGramas}
                            onChange={(event) => setFormValues((current) => ({ ...current, pesoProdutoGramas: event.target.value }))}
                            placeholder="Ex.: 850"
                        />

                        <ProductCreateField
                            id="comprimentoCentimetros"
                            label="Comprimento (cm)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formValues.comprimentoCentimetros}
                            onChange={(event) => setFormValues((current) => ({ ...current, comprimentoCentimetros: event.target.value }))}
                            placeholder="Ex.: 25"
                        />

                        <ProductCreateField
                            id="larguraCentimetros"
                            label="Largura (cm)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formValues.larguraCentimetros}
                            onChange={(event) => setFormValues((current) => ({ ...current, larguraCentimetros: event.target.value }))}
                            placeholder="Ex.: 18"
                        />

                        <ProductCreateField
                            id="alturaCentimetros"
                            label="Altura (cm)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formValues.alturaCentimetros}
                            onChange={(event) => setFormValues((current) => ({ ...current, alturaCentimetros: event.target.value }))}
                            placeholder="Ex.: 6"
                        />
                    </div>

                    {errorMessage && (
                        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
                            {errorMessage}
                        </p>
                    )}

                    <ProductCreateActions isSubmitting={isSubmitting} onCancel={onClose} submitLabel={submitLabel} />
                </form>
            </div>
        </div>
    );
}

export default ProductCreateModal;