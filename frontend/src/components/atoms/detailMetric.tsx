import type { ReactNode } from "react";

type DetailMetricProps = {
    label: string;
    value: string;
    icon: ReactNode;
};

function DetailMetric({ label, value, icon }: DetailMetricProps) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="mt-0.5 text-slate-400">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

export default DetailMetric;