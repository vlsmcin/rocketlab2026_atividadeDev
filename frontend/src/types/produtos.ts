type BackendAvaliacao = {
    id_avaliacao: string;
    avaliacao: number;
    nome_consumidor: string;
    titulo_comentario: string | null;
    comentario: string | null;
};

type BackendVendedor = {
    id_vendedor: string;
    nome_vendedor: string;
    preco_brl: number;
    cidade: string;
    estado: string;
};

type BackendProdutoListView = {
    id_produto: string;
    nome_produto: string;
    categoria_produto: string;
    url_imagem: string | null;
    media_avaliacao: number | null;
    quantidade_avaliacoes: number;
};

type BackendProdutoDetailView = BackendProdutoListView & {
    peso_produto_gramas: number | null;
    comprimento_centimetros: number | null;
    largura_centimetros: number | null;
    altura_centimetros: number | null;
    avaliacoes: BackendAvaliacao[] | null;
    vendedores: BackendVendedor[] | null;
};

type Produto = {
    id: string;
    name: string;
    category: string;
    urlImage: string;
    averageRating: number;
    reviewCount: number;
};

type ProdutoAvaliacao = {
    id: string;
    rating: number;
    consumerName: string;
    commentTitle: string | null;
    comment: string | null;
};

type ProdutoVendedor = {
    id: string;
    name: string;
    price: number;
    city: string;
    state: string;
};

type ProdutoDetail = Produto & {
    weightGrams: number | null;
    lengthCentimeters: number | null;
    widthCentimeters: number | null;
    heightCentimeters: number | null;
    evaluations: ProdutoAvaliacao[];
    sellers: ProdutoVendedor[];
};

type ProdutoCreatePayload = {
    nome_produto: string;
    categoria_produto: string;
    peso_produto_gramas?: number | null;
    comprimento_centimetros?: number | null;
    largura_centimetros?: number | null;
    altura_centimetros?: number | null;
};

type ProdutoCreateFormData = {
    nomeProduto: string;
    categoriaProduto: string;
    pesoProdutoGramas: string;
    comprimentoCentimetros: string;
    larguraCentimetros: string;
    alturaCentimetros: string;
};

export type {
    BackendAvaliacao,
    BackendProdutoDetailView,
    BackendProdutoListView,
    BackendVendedor,
    Produto,
    ProdutoAvaliacao,
    ProdutoCreateFormData,
    ProdutoCreatePayload,
    ProdutoDetail,
    ProdutoVendedor,
};