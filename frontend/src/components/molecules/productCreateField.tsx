import type { ChangeEvent } from "react";

type ProductCreateFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    type?: "text" | "number";
    min?: string;
    step?: string;
    listId?: string;
    options?: string[];
    className?: string;
    errorMessage?: string;
};

function ProductCreateField({
    id,
    label,
    value,
    onChange,
    placeholder,
    required,
    type = "text",
    min,
    step,
    listId,
    options,
    className,
    errorMessage,
}: ProductCreateFieldProps) {
    const hasError = !!errorMessage;

    const handleInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
        if (type === "number") {
            (event.target as HTMLInputElement).setCustomValidity("Por favor, digite apenas números");
        }
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        (event.target as HTMLInputElement).setCustomValidity("");
        onChange(event);
    };

    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type={type}
                min={min}
                step={step}
                list={listId}
                value={value}
                onChange={handleInput}
                onInvalid={handleInvalid}
                placeholder={placeholder}
                className={`h-12 w-full rounded-xl border px-4 text-slate-800 outline-none transition focus:ring-2 ${
                    hasError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                }`}
            />

            {listId && options && options.length > 0 && (
                <datalist id={listId}>
                    {options.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            )}

            {errorMessage && (
                <p className="mt-1 text-sm font-medium text-red-600">{errorMessage}</p>
            )}
        </div>
    );
}

export default ProductCreateField;