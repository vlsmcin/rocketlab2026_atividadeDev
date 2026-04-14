import { useEffect, useState } from "react";

type AuthLoginModalProps = {
    isOpen: boolean;
    title: string;
    description: string;
    errorMessage: string | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (username: string, password: string) => Promise<boolean>;
};

function AuthLoginModal({
    isOpen,
    title,
    description,
    errorMessage,
    isSubmitting,
    onClose,
    onSubmit,
}: AuthLoginModalProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setPassword("");
    }, [isOpen]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const authenticated = await onSubmit(username.trim(), password);

        if (!authenticated) {
            return;
        }

        setUsername("");
        setPassword("");
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{description}</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="auth-login-username">
                            Usuario
                        </label>
                        <input
                            id="auth-login-username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="admin@example.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="auth-login-password">
                            Senha
                        </label>
                        <input
                            id="auth-login-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Sua senha"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                            {errorMessage}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthLoginModal;