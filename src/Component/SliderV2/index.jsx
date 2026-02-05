import React from "react";
//Components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
//Images
import sampleImage1 from "../../assets/image/sliderV2_img1.jpg";
import sampleImage2 from "../../assets/image/sliderV2_img2.jpg";
//UI
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const HomebannerV2 = ({ loading }) => {
    if (loading) {
        return (
            <div className="w-full h-100 placeholder animate-pulse rounded-2xl" />
        );
    }

    return (
        <div className="homeSliderV2Wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
                .homeSliderV2 .swiper-pagination-bullet {
                  background: #ff5252 !important;
                  opacity: 0.3;
                }
                .homeSliderV2 .swiper-pagination-bullet-active {
                  opacity: 1;
                }
                
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes fadeInRight {
                  from {
                    opacity: 0;
                    transform: translateX(50px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                .swiper-slide-active .animate-fade-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }

                .swiper-slide-active .animate-fade-right {
                    animation: fadeInRight 0.8s ease-out forwards;
                    opacity: 0;
                }

                .delay-1 { animation-delay: 0.4s !important; }
                .delay-2 { animation-delay: 0.6s !important; }
                .delay-3 { animation-delay: 0.8s !important; }
              `}} />

            <Swiper
                loop={true}
                spaceBetween={0}
                effect={"fade"}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                className="homeSliderV2"
            >
                <SwiperSlide>
                    <div className="w-full rounded-xl overflow-hidden relative flex items-center h-[250px] md:h-[300px] lg:h-100 bg-[#fce4f4]">
                        <img
                            src={sampleImage1}
                            alt="iPhone 13"
                            className="absolute top-0 left-0 w-full h-full object-cover animate-fade-right"
                        />

                        <div className="flex flex-col justify-center p-6 md:p-8 z-50 w-full md:w-[60%] lg:w-[50%] h-full left-0 md:left-auto md:right-12 items-start text-left absolute bg-gradient-to-r from-white/40 to-transparent md:bg-none">
                            <h2 className="text-[20px] md:text-[24px] lg:text-[32px] font-bold text-[#333] mb-2 md:mb-4 leading-tight animate-fade-up delay-1">
                                Apple iPhone 13 Pro <br /> 256 GB, Blue
                            </h2>

                            <span className="text-[18px] md:text-[22px] lg:text-[26px] font-extrabold text-[#ff5252] mb-4 md:mb-6 animate-fade-up delay-2">
                                ₦35,500.00
                            </span>

                            <div className="animate-fade-up delay-3">
                                <Button
                                    className="bg-[#ff5252]! text-white! px-6! lg:px-8! py-1.5! lg:py-2! rounded-lg! font-bold! hover:bg-black! transition-all text-[12px] lg:text-[14px]"
                                    component={Link}
                                    to="/products/123"
                                >
                                    SHOP NOW
                                </Button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="w-full rounded-xl overflow-hidden relative flex items-center h-[250px] md:h-[300px] lg:h-100 bg-[#e4f0fc]">
                        <img
                            src={sampleImage2}
                            alt="iPhone 13 Pro"
                            className="absolute top-0 left-0 w-full h-full object-cover animate-fade-right"
                        />

                        <div className="flex flex-col justify-center p-6 md:p-8 z-50 w-full md:w-[60%] lg:w-[50%] h-full left-0 md:left-auto md:right-12 items-start text-left absolute bg-gradient-to-r from-white/40 to-transparent md:bg-none">
                            <h2 className="text-[20px] md:text-[24px] lg:text-[32px] font-bold text-[#333] mb-2 md:mb-4 leading-tight animate-fade-up delay-1">
                                Apple iPhone 13 Pro <br /> 256 GB, Blue
                            </h2>

                            <span className="text-[18px] md:text-[22px] lg:text-[26px] font-extrabold text-[#ff5252] mb-4 md:mb-6 animate-fade-up delay-2">
                                ₦435,500.00
                            </span>

                            <div className="animate-fade-up delay-3">
                                <Button
                                    className="bg-[#ff5252]! text-white! px-6! lg:px-8! py-1.5! lg:py-2! rounded-lg! font-bold! hover:bg-black! transition-all text-[12px] lg:text-[14px]"
                                    component={Link}
                                    to="/products"
                                >
                                    SHOP NOW
                                </Button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default HomebannerV2;