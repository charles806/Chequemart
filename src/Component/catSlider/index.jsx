import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import fashioncatSlider from "../../assets/image/fashioncatSlider.png";
import electronicsCatSlider from "../../assets/image/electronicsCatSlider.png";
import bagcat from "../../assets/image/bagcat.png";
import footwarecat from "../../assets/image/footwarecat.png";
import beautycat from "../../assets/image/beautycat.png";
import jewelerycat from "../../assets/image/jewelerycat.png";
import wellnessCat from "../../assets/image/wellnessCat.png";
import gameCat from "../../assets/image/gamesCat.png";


const CatSlider = () => {
    return (
        <>
            <div className="homeCatSlider pt-0 lg:pt-4 py-4 lg:py-8">
                <div className="my-container">
                    <Swiper
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                        slidesPerView={8}
                        spaceBetween={10}
                        navigation={false}
                        modules={[Navigation]}
                        className="mySwiper"
                        centerInsufficientSlides={true}
                        breakpoints={{
                            320: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 5,
                                spaceBetween: 10,
                            },
                            1024: {
                                slidesPerView: 8,
                                spaceBetween: 10,
                            }
                        }}
                    >
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={fashioncatSlider} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Fashion</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        {/* <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={electronicsCatSlider} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Electronics</h3>
                                </div>
                            </Link>
                        </SwiperSlide> */}
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={electronicsCatSlider} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Electronics</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={bagcat} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Bags</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={footwarecat} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Footware</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={beautycat} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Beauty</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={jewelerycat} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Jewelery</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={wellnessCat} alt="" className="w-10 lg:w-15 transition-all" />
                                    <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Wellness</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to="/products">
                                <div className="item py-4 lg:py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col cursor-pointer transition-all hover:shadow-md">
                                    <img src={gameCat} alt="" className="w-10 lg:w-15 transition-all" />
                                        <h3 className='text-[12px] lg:text-[15px] font-medium mt-3'>Games</h3>
                                </div>
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>

    )
}

export default CatSlider