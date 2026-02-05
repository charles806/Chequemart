import React from 'react'
import { Link } from 'react-router-dom'
//Images
import productImg1 from '../../assets/image/product1.jpg'
//UI
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
//Icons
import { DiGitCompare } from "react-icons/di";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";



const ProductItem = () => {
    const [value, setValue] = React.useState(2);
    return (
        <div className='productItem shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]'>
            <div className="group imgWrapper w-full  overflow-hidden  rounded-md rounded-bl-none rounded-br-none relative">
                <Link to="/products/123">
                    <div className="img h-50 overflow-hidden">
                        <img src={productImg1} alt="Product 1" className='w-full' />
                    </div>
                </Link>
                <span className="discount flex items-center absolute top-2.5 left-2.5 z-50 bg-[#ff5252] text-white rounded-lg p-1 text-[12px] font-medium">
                    {"50"}
                    {"%"}
                </span>
                <div className="actions absolute -top-5 right-1.25 z-50 flex items-center gap-2 flex-col w-12.5 transition-all duration-300 group-hover:top-3.75 opacity-0 group-hover:opacity-100">
                    <Button className='w-8.75! h-8.75! min-w-8.75! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white group'>
                        <DiGitCompare className='text-[18px] text-black! group-hover:text-white hover:text-white!' />
                    </Button>
                    <Button className='w-8.75! h-8.75! min-w-8.75! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white group'>
                        <FaRegHeart className='text-[18px] text-black! group-hover:text-white hover:text-white!' />
                    </Button>
                </div>

            </div>
            <div className="info p-3 py-5 relative pb-12.5 h-47.5">
                <h6 className='text-[13px] font-normal! link transition-all'>
                    BARCA
                </h6>

                <h3 className="text-[12px] lg:text-[13px] title mt-1 font-medium mb-1 text-black">
                    <Link to="/products/123" className='link transition-all'>Barca Jeresy</Link>
                </h3>

                <Rating
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    readOnly={true}
                    size='small'
                />

                <div className="flex items-center gap-4 justify-between">
                    <span className="oldPrice line-through text-gray-500 text-[12px] lg:text-[14px] font-medium">
                        ₦20,000
                    </span>
                    <span className="newPrice text-[14px] lg:text-[16px] text-[#ff5252] font-semibold text-primary">
                        ₦10,000
                    </span>
                </div>

                <div className="absolute! bottom-3.75 left-0 pl-3 pr-3 w-full">
                    <Button className='btn-org hover:bg-[#ff5252]! hover:text-white! addToCartBtn btn-border flex w-full btn-sm gap-2'>
                        <MdOutlineShoppingCart className='text-[18px] hover:text-white!' />
                        {"Add to Cart"}
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default ProductItem