import React from 'react'
import { Link } from 'react-router-dom'
import blogImg from '../../assets/image/BlogImage1.jpg'
import { CiLock } from 'react-icons/ci'
import { FaLongArrowAltRight } from "react-icons/fa";
const BlogsItems = () => {
    return (
        <div className='blogItem group'>
            <Link to='/blog/1' className=''>
                <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
                    <img src={blogImg} alt="Blog Image" className="w-full transition-all group-hover:scale-105  group-hover:rotate-1" />
                    <span className="flex items-center justify-center text-white absolute bottom-3.75 right-3.75 z-50 bg-[#ff5252] rounded-md p-1 text-[11px] font-medium gap-1">
                        <CiLock className='w-3.5' />
                        {"2025-03-12"}
                    </span>

                </div>
            </Link>
            <div className="info py-4">
                <h2 className='text-[15px] font-semibold text-black mb-1  lg:mb-3'>
                    <Link to='/blog/1' className='hover:text-[#ff5252] transition-colors'>How to Create a Successful E-commerce Business: A Step-by-Step Guide</Link>
                </h2>
                <div className="mb-3 text-[14px] lg:text-[16px]">
                    <div className="">
                        <ol className='list-none'>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda voluptatum pariatur facere, suscipit eaque iusto eum et optio. Cum, voluptate.</li>
                        </ol>
                    </div>
                </div>
                <Link to='/blog/1' className='text-[14px] text-[#ff5252] font-medium hover:underline'>Read More
                    <FaLongArrowAltRight className='w-3.5 inline-block ml-1' />
                </Link>
            </div>
        </div>
    )
}

export default BlogsItems