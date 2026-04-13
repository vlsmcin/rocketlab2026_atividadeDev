type SectionTitleProps = {
    title: string;
    subtitle?: string;
};

function SectionTitle({ title, subtitle }: SectionTitleProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
            {subtitle ? <p className="text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
    );
}

export default SectionTitle;