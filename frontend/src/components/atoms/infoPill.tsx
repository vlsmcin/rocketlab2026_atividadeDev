type InfoPillProps = {
    children: string;
};

function InfoPill({ children }: InfoPillProps) {
    return (
        <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
            {children}
        </span>
    );
}

export default InfoPill;