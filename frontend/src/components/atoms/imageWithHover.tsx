type ImageWithHoverProps = {
    src: string;
    alt: string;
};

function ImageWithHover({ src, alt }: ImageWithHoverProps) {
    return (
        <div className="relative group">
            <img src={src} alt={alt} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg">{alt}</span>
            </div>
        </div>
    );
}

export default ImageWithHover;