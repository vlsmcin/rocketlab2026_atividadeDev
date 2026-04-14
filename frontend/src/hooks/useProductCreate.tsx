import { useState } from "react";
import axios from "axios";
import api from "../services/api";
import type { ProdutoCreatePayload } from "../types/produtos";

type UseProductCreateResult = {
    isCreating: boolean;
    createError: string | null;
    clearCreateError: () => void;
    createProduct: (payload: ProdutoCreatePayload) => Promise<boolean>;
};

function useProductCreate(): UseProductCreateResult {
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const clearCreateError = () => {
        setCreateError(null);
    };

    const createProduct = async (payload: ProdutoCreatePayload) => {
        setIsCreating(true);
        setCreateError(null);

        try {
            await api.post("/produtos", payload);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const maybeDetail = error.response?.data as { detail?: string } | undefined;
                setCreateError(maybeDetail?.detail ?? "Não foi possível criar o produto.");
            } else {
                setCreateError("Não foi possível criar o produto.");
            }

            return false;
        } finally {
            setIsCreating(false);
        }
    };

    return {
        isCreating,
        createError,
        clearCreateError,
        createProduct,
    };
}

export default useProductCreate;