type ReviewCountProps = {
    countReviews: number;
};

function ReviewCount({ countReviews }: ReviewCountProps) {
    return (
        <p className="text-sm text-gray-500">
            ({countReviews})
        </p>
    );
}

export default ReviewCount;