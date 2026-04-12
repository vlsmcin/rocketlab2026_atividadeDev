type ImageWithHoverProps = {
    src: string;
    alt: string;
};

function ImageWithHover({ src, alt }: ImageWithHoverProps) {
    return (
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />
        </div>
    );
}

export default ImageWithHover;