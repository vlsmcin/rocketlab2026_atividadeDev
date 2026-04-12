import type { ChangeEvent } from "react";

type SearchBarProps = {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
};

function SearchBar({ value, onChange, placeholder = "Buscar produtos..." }: SearchBarProps) {
    return (
        <label
            className="flex h-14 w-full items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 text-slate-500 transition-colors focus-within:border-indigo-500"
            aria-label="Buscar produtos"
        >
            <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border-none bg-transparent text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
        </label>
    );
}

export default SearchBar;