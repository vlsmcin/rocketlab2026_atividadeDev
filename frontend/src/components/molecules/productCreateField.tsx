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
}: ProductCreateFieldProps) {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
            <input
                id={id}
                type={type}
                min={min}
                step={step}
                list={listId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            {listId && options && options.length > 0 && (
                <datalist id={listId}>
                    {options.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            )}
        </div>
    );
}

export default ProductCreateField;