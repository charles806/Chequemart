import { useState } from 'react';
import productImg1 from '../../assets/image/product1.jpg';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";

const images = [productImg1, productImg1, productImg1, productImg1];

const ProductZoom = () => {
    const [zoomed, setZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPosition({ x, y });
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-3 w-full">

            {/* Thumbnails */}
            <div className="md:w-20 w-full shrink-0">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={8}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    breakpoints={{
                        768: {
                            direction: 'vertical',
                            slidesPerView: 4,
                            spaceBetween: 8,
                        }
                    }}
                    className="w-full md:h-112.5"
                >
                    {images.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="border-2 border-transparent in-[.swiper-slide-thumb-active]:border-red-400 rounded-md overflow-hidden cursor-pointer transition-all duration-200 w-full aspect-square">
                                <img
                                    src={img}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Main Image */}
            <div className="flex-1 min-w-0">
                <Swiper
                    modules={[Thumbs, Navigation]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation
                    className="w-full h-full"
                >
                    {images.map((img, i) => (
                        <SwiperSlide key={i} className="h-auto!">
                            <div
                                className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200"
                                style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
                                onMouseEnter={() => setZoomed(true)}
                                onMouseLeave={() => setZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={img}
                                    alt={`Product ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{
                                        transformOrigin: `${position.x}% ${position.y}%`,
                                        transform: zoomed ? 'scale(2)' : 'scale(1)',
                                        transition: zoomed ? 'transform 0.1s ease' : 'transform 0.3s ease',
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
};

export default ProductZoom;