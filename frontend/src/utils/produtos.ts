function formatCategoria(value: string) {
    const comEspacos = value.replaceAll("_", " ").toLocaleLowerCase("pt-BR");

    return comEspacos.charAt(0).toLocaleUpperCase("pt-BR") + comEspacos.slice(1);
}

function normalizeCategoriaForBackend(value: string) {
    return value
        .trim()
        .replaceAll(/\s+/g, "_")
        .toLocaleLowerCase("pt-BR");
}

function parseOptionalNumberInput(value: string) {
    if (!value.trim()) {
        return null;
    }

    const parsedValue = Number(value.replace(",", "."));

    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatCurrencyBRL(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDecimal(value: number, maximumFractionDigits = 1) {
    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits,
    }).format(value);
}

function formatWeight(grams: number | null) {
    if (grams === null) {
        return "Não informado";
    }

    return `${formatDecimal(grams / 1000, 2)} kg`;
}

function formatDimensions(length?: number | null, width?: number | null, height?: number | null) {
    if (length === null || width === null || height === null || length === undefined || width === undefined || height === undefined) {
        return "Não informado";
    }

    return `${formatDecimal(length, 1)} × ${formatDecimal(width, 1)} × ${formatDecimal(height, 1)} cm`;
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    return parts.slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

export {
    formatCategoria,
    formatCurrencyBRL,
    formatDecimal,
    formatDimensions,
    formatWeight,
    getInitials,
    normalizeCategoriaForBackend,
    parseOptionalNumberInput,
};