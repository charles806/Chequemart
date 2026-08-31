import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../../Component/Slider/index';
import CatSlider from '../../Component/catSlider';
import ProductItem from '../../Component/ProductItem/index';
import SliderV2 from "../../Component/SliderV2/index";
import BlogsItems from '../../Component/BlogItem/index';
import { SkeletonProductGrid } from "../../Component/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import subbanner1 from "../../assets/image/sub-banner-2.jpg";
import subbanner2 from "../../assets/image/sub-banner-4.jpg";
import bag from "../../assets/image/bag.png";
import camera from "../../assets/image/sub-banner-1.jpg";
import phone from "../../assets/image/sub-banner-3.jpg";
import { FaShippingFast, FaLongArrowAltRight } from "react-icons/fa";
import { blogs } from "../../data/blogs";
import ErrorMessage from "../../components/ErrorMessage";

const Home = () => {
  const swiperRef1 = useRef(null);
  const swiperRef2 = useRef(null);
  const swiperRef4 = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?sort=popular&limit=8`);
      const data = await res.json();
      if (data.success) setPopularProducts(data.data || []);
    } catch (err) {
      console.error("Failed to load popular products:", err);
    }
  };

  const fetchLatestProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?sort=newest&limit=8`);
      const data = await res.json();
      if (data.success) setLatestProducts(data.data || []);
    } catch (err) {
      console.error("Failed to load latest products:", err);
    }
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchPopularProducts(), fetchLatestProducts()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const renderBannerSwiper = (items) => (
    <Swiper
      slidesPerView={4}
      spaceBetween={10}
      navigation={false}
      modules={[Navigation]}
      className="mySwiper"
      centerInsufficientSlides
      breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 640: { slidesPerView: 3, spaceBetween: 10 }, 1024: { slidesPerView: 4, spaceBetween: 10 } }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.title}>
          <div className="w-full overflow-hidden rounded-xl group relative h-40 lg:h-46">
            <img src={item.img} alt={item.title} loading="lazy" width={300} height={180} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
            <div className="absolute p-4 lg:p-5 top-0 left-0 w-[70%] h-full z-10 flex items-start justify-center flex-col gap-1 lg:gap-2">
              <h3 className="text-sm md:text-base font-semibold text-white drop-shadow">{item.title}</h3>
              <span className="text-lg lg:text-xl text-primary-500 font-bold">{item.price}</span>
              <Link to="/products" className="text-sm text-white font-medium hover:underline drop-shadow">Shop Now</Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  const bannerItems = [
    { img: bag, title: "Stylish Bags", price: "₦10,000" },
    { img: camera, title: "Digital Cameras", price: "₦90,000" },
    { img: phone, title: "Mobile Phone", price: "₦310,000" },
    { img: subbanner2, title: "HeadPhone", price: "₦32,000" },
  ];

  return (
    <main className="mt-0">
      {error && <ErrorMessage message={error} onRetry={fetchAll} />}
      <Slider />
      <CatSlider />

      {/* Popular Products */}
      <section className="bg-white py-6 lg:py-10">
        <div className="my-container">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <div className="w-full lg:w-[40%]">
              <h2 className="text-base lg:text-xl font-semibold text-neutral-900 uppercase tracking-wide">
                Popular Products
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Most bought and highly rated products.
              </p>
            </div>
            <Link to="/products" className="text-sm text-neutral-500 font-medium hover:text-primary-500 transition-colors flex items-center gap-1.5 mt-3 lg:mt-0">
              View All <FaLongArrowAltRight className="text-xs" />
            </Link>
          </div>

          <div className="w-full mt-4">
            <div className="productsSlider pt-1 lg:pt-3 pb-0 relative">
              <Swiper
                ref={swiperRef1}
                slidesPerView={4}
                spaceBetween={10}
                navigation
                modules={[Navigation]}
                className="mySwiper"
                centerInsufficientSlides
                breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 640: { slidesPerView: 3, spaceBetween: 10 }, 1024: { slidesPerView: 4, spaceBetween: 10 } }}
              >
                {loading ? (
                  <SkeletonProductGrid count={4} />
                ) : popularProducts.length === 0 ? (
                  <div className="flex justify-center items-center py-10 w-full">
                    <p className="text-neutral-300">No products available</p>
                  </div>
                ) : (
                  popularProducts.map((item) => (
                    <SwiperSlide key={item._id}>
                      <ProductItem product={{
                        id: item._id,
                        name: item.name,
                        price: item.discountPrice || item.price,
                        oldPrice: item.discountPrice ? item.price : null,
                        image: item.images?.[0],
                        brand: item.seller?.storeName || "Vendor",
                        rating: item.averageRating || 0
                      }} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Banner row */}
      <section className="py-6 bg-white">
        <div className="my-container flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[70%]">
            <SliderV2 />
          </div>
          <div className="w-full lg:w-[30%] flex gap-5 flex-col">
            {[
              { img: subbanner1, title: "Buy Chairs at low price", price: "₦120,000" },
              { img: subbanner2, title: "Get HeadPhones at low price", price: "₦32,000" },
            ].map((item) => (
              <div key={item.title} className="w-full overflow-hidden rounded-xl group relative h-40 lg:h-46">
                <img src={item.img} alt={item.title} loading="eager" width={400} height={180} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute p-4 lg:p-5 top-0 right-0 w-[60%] lg:w-[70%] h-full z-10 flex items-center justify-center flex-col gap-1 lg:gap-2">
                  <h3 className="text-sm md:text-base font-semibold leading-tight text-white drop-shadow">
                    {item.title}
                  </h3>
                  <span className="text-lg lg:text-xl text-primary-500 font-bold w-full">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Shipping + Banner Swiper */}
      <section className="py-6 bg-white">
        <div className="my-container">
          <div className="w-full md:w-[80%] mx-auto py-4 px-4 border-2 border-primary-200 bg-primary-50 flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-xl mb-7">
            <div className="flex items-center gap-4">
              <FaShippingFast className="text-3xl lg:text-5xl text-primary-500" />
              <span className="text-base lg:text-xl font-semibold text-primary-700 uppercase">Free Shipping</span>
            </div>
            <p className="font-medium text-sm text-primary-600 mt-2 lg:mt-0">Free Shipping on orders over ₦250,000</p>
          </div>

          <div className="py-2 lg:py-5">
            {renderBannerSwiper(bannerItems)}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-3 lg:py-6 bg-white">
        <div className="my-container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Latest Products</h2>
              <p className="text-sm text-neutral-400 mt-1">Recently added to the marketplace.</p>
            </div>
            <Link to="/products" className="text-sm text-neutral-500 font-medium hover:text-primary-500 transition-colors flex items-center gap-1.5">
              View All <FaLongArrowAltRight className="text-xs" />
            </Link>
          </div>

          <div className="productsSlider pt-1 lg:pt-3 pb-0">
            <Swiper
              ref={swiperRef2}
              slidesPerView={4}
              spaceBetween={10}
              navigation={false}
              modules={[Navigation]}
              className="mySwiper"
              centerInsufficientSlides
              breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 640: { slidesPerView: 3, spaceBetween: 10 }, 1024: { slidesPerView: 4, spaceBetween: 10 } }}
            >
              {loading ? (
                <SkeletonProductGrid count={4} />
              ) : latestProducts.length === 0 ? (
                <div className="flex justify-center items-center py-10 w-full">
                  <p className="text-neutral-300">No products available</p>
                </div>
              ) : (
                latestProducts.map((item) => (
                  <SwiperSlide key={item._id}>
                    <ProductItem product={{
                      id: item._id,
                      name: item.name,
                      price: item.discountPrice || item.price,
                      oldPrice: item.discountPrice ? item.price : null,
                      image: item.images?.[0],
                      brand: item.seller?.storeName || "Vendor",
                      rating: item.averageRating || 0
                    }} />
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-5 pb-10 bg-white">
        <div className="my-container">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">From the Blog</h2>
          <Swiper
            ref={swiperRef4}
            slidesPerView={4}
            spaceBetween={10}
            navigation={false}
            modules={[Navigation]}
            className="mySwiper"
            centerInsufficientSlides
            breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 640: { slidesPerView: 3, spaceBetween: 10 }, 1024: { slidesPerView: 4, spaceBetween: 10 } }}
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <BlogsItems blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </main>
  );
};

export default Home;
