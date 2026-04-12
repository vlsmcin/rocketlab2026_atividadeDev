type ReviewStarsProps = {
    averageReviews: number | null;
};

function ReviewStars({ averageReviews }: ReviewStarsProps) {
    if (averageReviews === null) {
        return (
            <div className="inline-flex text-xl leading-none tracking-wide" aria-hidden="true">
                <span className="text-gray-300">★★★★★</span>
            </div>
        );
    }

    const notaNormalizada = Math.min(Math.max(averageReviews, 0), 5);
    const estrelas = Array.from({ length: 5 }, (_, indice) => {
        const preenchimento = Math.min(Math.max(notaNormalizada - indice, 0), 1);

        return { indice, preenchimento };
    });

    return (
        <div
            className="text-xl tracking-wide leading-none"
            aria-label={`${notaNormalizada.toFixed(1)} de 5 estrelas`}
        >
            <div className="inline-flex gap-0.5" aria-hidden="true">
                {estrelas.map(({ indice, preenchimento }) => (
                    <span key={indice} className="relative inline-block text-gray-300">
                        <span>★</span>
                        <span
                            className="absolute inset-0 overflow-hidden text-amber-500"
                            style={{ width: `${preenchimento * 100}%` }}
                        >
                            ★
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default ReviewStars;