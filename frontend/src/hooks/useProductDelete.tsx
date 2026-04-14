import { useState } from "react";
import axios from "axios";
import api from "../services/api";

type UseProductDeleteResult = {
    isDeleting: boolean;
    deleteError: string | null;
    clearDeleteError: () => void;
    deleteProduct: (idProduto: string) => Promise<boolean>;
};

function useProductDelete(): UseProductDeleteResult {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const clearDeleteError = () => {
        setDeleteError(null);
    };

    const deleteProduct = async (idProduto: string) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await api.delete(`/produtos/${idProduto}`);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const maybeDetail = error.response?.data as { detail?: string } | undefined;
                setDeleteError(maybeDetail?.detail ?? "Não foi possível remover o produto.");
            } else {
                setDeleteError("Não foi possível remover o produto.");
            }

            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isDeleting,
        deleteError,
        clearDeleteError,
        deleteProduct,
    };
}

export default useProductDelete;