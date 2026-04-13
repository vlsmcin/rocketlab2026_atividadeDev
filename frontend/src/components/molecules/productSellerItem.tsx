import type { ProdutoVendedor } from "../../types/produtos";
import { formatCurrencyBRL } from "../../utils/produtos";

type ProductSellerItemProps = {
    seller: ProdutoVendedor;
};

function ProductSellerItem({ seller }: ProductSellerItemProps) {
    const formattedCity = seller.city
        .toLocaleLowerCase("pt-BR")
        .replace(/\b\p{L}/gu, (match) => match.toLocaleUpperCase("pt-BR"));

    const formattedState = seller.state.toLocaleUpperCase("pt-BR");

    return (
        <article className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-950">{seller.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {formattedCity} - {formattedState}
                    </p>
                </div>
                <p className="shrink-0 text-lg font-semibold text-emerald-700">{formatCurrencyBRL(seller.price)}</p>
            </div>
        </article>
    );
}

export default ProductSellerItem;