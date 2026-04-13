type ReviewAvatarProps = {
    name: string;
};

function ReviewAvatar({ name }: ReviewAvatarProps) {
    const initials = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase() || "?";

    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200">
            {initials}
        </div>
    );
}

export default ReviewAvatar;