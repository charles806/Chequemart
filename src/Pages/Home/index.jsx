import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
//Components
import Slider from '../../Component/Slider/index'
import CatSlider from '../../Component/catSlider'
import ProductItem from '../../Component/ProductItem/index'
import SliderV2 from "../../Component/SliderV2/index"
import BlogsItems from '../../Component/BlogItem/index'
import { SkeletonProductGrid, SkeletonBanner } from "../../Component/Skeleton";
//MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
//Image
import subbanner1 from "../../assets/image/sub-banner-2.jpg"
import subbanner2 from "../../assets/image/sub-banner-4.jpg"
import bag from "../../assets/image/bag.png"
import camera from "../../assets/image/sub-banner-1.jpg"
import phone from "../../assets/image/sub-banner-3.jpg"
//Icons
import { FaShippingFast } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { blogs } from "../../data/blogs";
import ErrorMessage from "../../components/ErrorMessage";


const Home = () => {
  const swiperRef1 = useRef(null);
  const swiperRef2 = useRef(null);
  const swiperRef3 = useRef(null);
  const swiperRef4 = useRef(null);
  const sentinelRef = useRef(null);
  const pageRef = useRef(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchProducts = async (pageNum = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?page=${pageNum}&limit=8`);
      const data = await res.json();
      if (data.success) {
        const newItems = data.data || [];
        if (append) {
          setProducts((prev) => [...prev, ...newItems]);
        } else {
          setProducts(newItems);
        }
        setHasMore(newItems.length >= 8);
        if (append) {
          pageRef.current = pageNum;
        } else {
          pageRef.current = 1;
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = pageRef.current + 1;
      fetchProducts(nextPage, true);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = pageRef.current + 1;
          fetchProducts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  return (
    <main className='mt-0'>
      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}
      <Slider />
      <CatSlider />

      <section className='bg-white py-3 lg:py-8'>
        <div className="my-container">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <div className="leftSec w-full lg:w-[40%]">
              <h2 className='text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-semibold uppercase'>
                Popular Products
              </h2>
              <p className='text-[12px] sm:text-[14px] md:text-[13px] lg:text-[14px] font-normal mt-0 mb-0'>
                Don't miss out the current offers until the end of the Month.
              </p>
            </div>
            <div className="rightSec w-full lg:w-[60%] mt-3 lg:mt-0">
              <Box className="w-full flex justify-start lg:justify-end">
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  className="hide-scrollbar"
                >
                  <Tab label="Fashion" />
                  <Tab label="Electronics" />
                  <Tab label="Bags" />
                  <Tab label="Footware" />
                  <Tab label="Beauty" />
                  <Tab label="Jewelery" />
                  <Tab label="Wellness" />
                </Tabs>
              </Box>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="productsSlider pt-1 lg:pt-3 pb-0 relative">
              <Swiper
                ref={swiperRef1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                slidesPerView={4}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
                centerInsufficientSlides={true}
                breakpoints={{
                  320: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                  }
                }}
              >
                {loading ? (
                  <SkeletonProductGrid count={4} />
                ) : products.length === 0 ? (
                  <div className="flex justify-center items-center py-10 w-full">
                    <p className="text-gray-400">No products available</p>
                  </div>
                ) : (
                  products.map((item) => (
                    <SwiperSlide key={item._id}>
                      <ProductItem product={{
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        oldPrice: item.price * 1.2, // Simulate old price
                        image: item.images?.[0],
                        brand: item.seller?.storeName || "Vendor"
                      }} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 pt-0 bg-white">
        <div className="my-container flex flex-col lg:flex-row gap-5">
          <div className="part1 w-full lg:w-[70%]">
            <SliderV2 />
          </div>
          <div className="part2 w-full lg:w-[30%] flex gap-5 lg:gap-8 flex-col">
            <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
              <img src={subbanner1} alt="Sub Banner 2" loading="eager" decoding="async" width={400} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
              <div className="info absolute p-4 lg:p-5 top-0 right-0 w-[60%] lg:w-[70%] h-full z-10 flex items-center justify-center flex-col gap-1 lg:gap-2">
                <h2 className="text-[14px] md:text-[18px] font-semibold leading-tight">
                  Buy Chairs at low price
                </h2>
                <span className='text-[16px] lg:text-[20px] text-[#ff5252] font-semibold w-full'>₦120,000</span>
              </div>
            </div>
            <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
              <img src={subbanner2} alt="Sub Banner 2" loading="eager" decoding="async" width={400} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
              <div className="info absolute p-4 lg:p-5 top-0 right-0 w-[60%] lg:w-[70%] h-full z-10 flex items-center justify-center flex-col gap-1 lg:gap-2">
                <h2 className="text-[14px] md:text-[18px] font-semibold leading-tight">
                  Get HeadPhones at low price
                </h2>
                <span className='text-[16px] lg:text-[20px] text-[#ff5252] font-semibold w-full'>₦32,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0 lg:py-4 pt-0 lg:pt-8 pb-0 bg-white">
        <div className="my-container">
          <div className="freeShipping w-full md:w-[80%] m-auto py-4 p-4  border-2 border-[#ff5252] flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-md mb-7">
            <div className="col1 flex items-center gap-4">
              <FaShippingFast className='text-[30px] lg:text-[50px]' />
              <span className="text-[16px] lg:text-[20px] font-semibold uppercase">
                Free Shipping
              </span>
            </div>
            <div className="col2">
              <p className='mb-0 mt-0 font-medium text-center'>Free Shipping on orders over ₦250,000</p>
            </div>
          </div>

          <div className="py-2 lg:py-5 w-full resBannersSlider">
            <Swiper
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              slidesPerView={4}
              spaceBetween={10}
              navigation={false}
              modules={[Navigation]}
              className="mySwiper"
              centerInsufficientSlides={true}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                }
              }}
            >
              <SwiperSlide>
                <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
                  <img src={bag} alt="Bag" loading="lazy" decoding="async" width={300} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
                  <div className="info absolute p-5 top-0 left-0 w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2">
                    <h2 className="text-[14px] md:text-[18px] font-semibold">
                      Stylish Bags
                    </h2>
                    <span className="text-[20px] text-[#ff5252] font-semibold w-full">
                      ₦10,000
                    </span>
                    <div className="w-full">
                      <Link to="/products" className="text-[14px] text-[#ff5252] font-medium hover:underline">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
                  <img src={camera} alt="Camera" loading="lazy" decoding="async" width={300} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
                  <div className="info absolute p-5 top-0 left-0 w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2">
                    <h2 className="text-[14px] md:text-[18px] font-semibold">
                      Digital Cameras
                    </h2>
                    <span className="text-[20px] text-[#ff5252] font-semibold w-full">
                      ₦90,000
                    </span>
                    <div className="w-full">
                      <Link to="/products" className="text-[14px] text-[#ff5252] font-medium hover:underline">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
                  <img src={phone} alt="Phone" loading="lazy" decoding="async" width={300} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
                  <div className="info absolute p-5 top-0 left-0 w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2">
                    <h2 className="text-[14px] md:text-[18px] font-semibold">
                      Mobile Phone
                    </h2>
                    <span className="text-[20px] text-[#ff5252] font-semibold w-full">
                      ₦310,000
                    </span>
                    <div className="w-full">
                      <Link to="/products" className="text-[14px] text-[#ff5252] font-medium hover:underline">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative h-40 lg:h-46">
                  <img src={subbanner2} alt="HeadPhone Banner" loading="lazy" decoding="async" width={300} height={180} className='w-full h-full object-cover transition-all duration-150 group-hover:scale-105' />
                  <div className="info absolute p-5 top-0 left-0 w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2">
                    <h2 className="text-[14px] md:text-[18px] font-semibold">
                      HeadPhone
                    </h2>
                    <span className="text-[20px] text-[#ff5252] font-semibold w-full">
                      ₦32,000
                    </span>
                    <div className="w-full">
                      <Link to="/products" className="text-[14px] text-[#ff5252] font-medium hover:underline">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-2 pt-0 bg-white">
        <div className="my-container">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold">
              Latest Products
            </h2>
            <Button className="text-[14px]! text-black! font-medium! hover:underline!">
              <Link to="/products" className="text-[14px] text-black font-medium hover:underline">View All</Link>
              <FaLongArrowAltRight className="ml-2" />
            </Button>
          </div>

          <div className="productsSlider pt-1 lg:pt-3 pb-0">
            <Swiper
              ref={swiperRef2}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              slidesPerView={4}
              spaceBetween={10}
              navigation={false}
              modules={[Navigation]}
              className="mySwiper"
              centerInsufficientSlides={true}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                }
              }}
            >
              {products.slice(4, 8).map((item) => (
                <SwiperSlide key={item._id}>
                  <ProductItem product={{
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    oldPrice: item.price * 1.2,
                    image: item.images?.[0],
                    brand: item.seller?.storeName || "Vendor"
                  }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-2 pt-0 bg-white">
        <div className="my-container">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold">
              Featured Products
            </h2>
            <Button className="text-[14px]! text-black! font-medium! hover:underline!">
              <Link to="/products" className="text-[14px] text-black font-medium hover:underline">View All</Link>
              <FaLongArrowAltRight className="ml-2" />
            </Button>
          </div>

          <div className="productsSlider pt-1 lg:pt-3 pb-0">
            <Swiper
              ref={swiperRef3}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              slidesPerView={4}
              spaceBetween={10}
              navigation={false}
              modules={[Navigation]}
              className="mySwiper"
              centerInsufficientSlides={true}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                }
              }}
            >
              {products.slice(8, 12).map((item) => (
                <SwiperSlide key={item._id}>
                  <ProductItem product={{
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    oldPrice: item.price * 1.2,
                    image: item.images?.[0],
                    brand: item.seller?.storeName || "Vendor"
                  }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className='py-5 pb-8 pt-0 bg-white blogSection'>
        <div className="my-container">
          <h2 className="text-[20px] font-semibold mb-4">From the Blog</h2>
          <div>
            <Swiper
              ref={swiperRef4}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              slidesPerView={4}
              spaceBetween={10}
              navigation={false}
              modules={[Navigation]}
              className="mySwiper"
              centerInsufficientSlides={true}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                }
              }}
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id}>
                  <BlogsItems blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      {/* All Products - Infinite Scroll */}
      <section className="py-5 pb-8 pt-0 bg-white">
        <div className="my-container">
          <h2 className="text-[20px] font-semibold mb-4">All Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((item) => (
              <ProductItem key={item._id} product={{
                id: item._id,
                name: item.name,
                price: item.price,
                oldPrice: item.price * 1.2,
                image: item.images?.[0],
                brand: item.seller?.storeName || "Vendor"
              }} />
            ))}
          </div>

          {loadingMore && <SkeletonProductGrid count={4} />}

          {hasMore && (
            <>
              <div ref={sentinelRef} className="h-4" />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-xl bg-[#ff5252] text-white font-semibold text-sm hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>

  )
}

export default Home