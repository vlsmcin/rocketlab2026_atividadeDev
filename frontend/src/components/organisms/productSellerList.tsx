import type { ProdutoVendedor } from "../../types/produtos";
import { SectionTitle } from "../atoms";
import { ProductSellerItem } from "../molecules";

type ProductSellerListProps = {
    sellers: ProdutoVendedor[];
};

function ProductSellerList({ sellers }: ProductSellerListProps) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionTitle title="Vendedores" subtitle="Faixa de preços consolidada a partir dos anúncios disponíveis." />
                <p className="text-sm font-medium text-slate-500">{sellers.length} ofertas</p>
            </div>

            {sellers.length > 0 ? (
                <div className="grid gap-4">
                    {sellers.map((seller) => (
                        <ProductSellerItem key={seller.id} seller={seller} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
                    Nenhum vendedor encontrado para este produto.
                </div>
            )}
        </section>
    );
}

export default ProductSellerList;