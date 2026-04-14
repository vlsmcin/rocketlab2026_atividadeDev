import { useState } from "react";
import axios from "axios";
import api from "../services/api";
import type { ProdutoUpdatePayload } from "../types/produtos";

type UseProductUpdateResult = {
    isUpdating: boolean;
    updateError: string | null;
    clearUpdateError: () => void;
    updateProduct: (idProduto: string, payload: ProdutoUpdatePayload) => Promise<boolean>;
};

function useProductUpdate(): UseProductUpdateResult {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const clearUpdateError = () => {
        setUpdateError(null);
    };

    const updateProduct = async (idProduto: string, payload: ProdutoUpdatePayload) => {
        setIsUpdating(true);
        setUpdateError(null);

        try {
            await api.put(`/produtos/${idProduto}`, payload);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const maybeDetail = error.response?.data as { detail?: string } | undefined;
                setUpdateError(maybeDetail?.detail ?? "Não foi possível atualizar o produto.");
            } else {
                setUpdateError("Não foi possível atualizar o produto.");
            }

            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        isUpdating,
        updateError,
        clearUpdateError,
        updateProduct,
    };
}

export default useProductUpdate;