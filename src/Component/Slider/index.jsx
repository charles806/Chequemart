import React, { useState, useEffect, useCallback } from "react";
import slider1 from "../../assets/image/slider1.jpg";
import slider2 from "../../assets/image/slider2.jpg";
import slider3 from "../../assets/image/slider3.jpg";

const PrevArrow = ({ onClick }) => (
    <button
        className="absolute top-1/2 -translate-y-1/2 left-3.75 z-10 w-10 h-10 flex justify-center items-center bg-black/50 text-white border-none rounded-full cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-md hover:bg-white/90 hover:text-black hover:scale-110 focus-visible:bg-white/90 focus-visible:text-black focus-visible:scale-110 focus-visible:outline focus-visible:outline-blue-500 focus-visible:outline-offset-2 active:scale-105 max-md:w-8.75 max-md:h-8.75 max-md:left-2.5 max-sm:w-7.5 max-sm:h-7.5 max-sm:left-2"
        onClick={onClick}
        aria-label="Previous slide"
        type="button"
    >
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    </button>
);

const NextArrow = ({ onClick }) => (
    <button
        className="absolute top-1/2 -translate-y-1/2 right-3.75 z-10 w-10 h-10 flex justify-center items-center bg-black/50 text-white border-none rounded-full cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-md hover:bg-white/90 hover:text-black hover:scale-110 focus-visible:bg-white/90 focus-visible:text-black focus-visible:scale-110 focus-visible:outline focus-visible:outline-blue-500 focus-visible:outline-offset-2 active:scale-105 max-md:w-8.75 max-md:h-8.75 max-md:right-2.5 max-sm:w-7.5 max-sm:h-7.5 max-sm:right-2"
        onClick={onClick}
        aria-label="Next slide"
        type="button"
    >
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    </button>
);

const SLIDES = [
    {
        id: 1,
        src: slider1,
        alt: "",
    },
    {
        id: 2,
        src: slider2,
        alt: "",
    },
    {
        id: 3,
        src: slider3,
        alt: "",
    },
];

export default function SimpleSlider({ loading }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    // Autoplay functionality
    useEffect(() => {
        if (!isAutoPlaying || loading) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, loading]);

    // Keyboard navigation
    useEffect(() => {
        if (loading) return;
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSlide, prevSlide, loading]);

    if (loading) {
        return (
            <section className="relative max-w-[90%] h-112.5 my-10 mx-auto rounded-[10px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-black max-md:h-87.5 max-md:my-5 max-sm:h-62.5 max-sm:max-w-[95%] max-sm:my-3.75 mt-20!">
                <div className="w-full h-full overflow-hidden">
                    <div className="w-full h-75 lg:h-112.5 bg-gray-300 animate-pulse rounded-2xl" />
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative max-w-[90%] h-112.5 my-10 mx-auto rounded-[10px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-black max-md:h-87.5 max-md:my-5 max-sm:h-62.5 max-sm:max-w-[95%] max-sm:my-3.75"
            aria-label="Image carousel"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="w-full h-full overflow-hidden">
                <div
                    className="flex h-full transition-transform duration-600 ease-in-out motion-reduce:transition-none"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {SLIDES.map((slide) => (
                        <div key={slide.id} className="min-w-full h-full">
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                className="w-full h-full object-cover block"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <PrevArrow onClick={prevSlide} />
            <NextArrow onClick={nextSlide} />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 max-md:bottom-3.75 max-sm:bottom-2.5 max-sm:gap-2">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full border-none bg-white/50 cursor-pointer transition-all duration-300 ease-in-out p-0 hover:bg-white/80 hover:scale-110 focus-visible:outline focus-visible:outline-white focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 max-md:w-2 max-md:h-2 max-sm:w-1.75 max-sm:h-1.75 ${index === currentSlide
                                ? "bg-white w-6 rounded-[5px] max-md:w-5 max-sm:w-4.5"
                                : ""
                            }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentSlide ? "true" : "false"}
                    />
                ))}
            </div>
        </section>
    );
}