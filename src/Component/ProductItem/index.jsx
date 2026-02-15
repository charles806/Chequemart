import React from 'react'
import { Link } from 'react-router-dom'
//UI
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
//Icons
import { DiGitCompare } from "react-icons/di";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";

const ProductItem = ({ product }) => {
    // Destructure product data with fallback values
    const {
        id = 123,
        name = "Product Name",
        brand = "BRAND",
        price = 10000,
        oldPrice = 20000,
        rating = 4,
        image = null,
        discount = 50
    } = product || {};

    const [value, setValue] = React.useState(rating);

    return (
        <div className='productItem shadow-md hover:shadow-2xl rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 bg-white'>
            <div className="group imgWrapper w-full overflow-hidden rounded-t-xl relative">
                <Link to={`/products/${id}`}>
                    <div className="img h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
                        {image && <img src={image} alt={name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />}
                    </div>
                </Link>
                {discount > 0 && (
                    <span className="discount flex items-center absolute top-3 left-3 z-50 bg-gradient-to-r from-[#ff5252] to-[#ff7b7b] text-white rounded-lg px-2 py-1 text-[11px] sm:text-[12px] font-bold shadow-lg">
                        -{discount}%
                    </span>
                )}
                <div className="actions absolute -top-5 right-2 z-50 flex items-center gap-2 flex-col w-12.5 transition-all duration-300 group-hover:top-3 opacity-0 group-hover:opacity-100">
                    <Button className='w-9! h-9! min-w-9! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white! transition-all! duration-300! shadow-lg! group/btn'>
                        <DiGitCompare className='text-[18px] text-black! group-hover/btn:text-white!' />
                    </Button>
                    <Button className='w-9! h-9! min-w-9! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white! transition-all! duration-300! shadow-lg! group/btn'>
                        <FaRegHeart className='text-[18px] text-black! group-hover/btn:text-white!' />
                    </Button>
                </div>
            </div>

            <div className="info p-3 py-4 relative h-auto min-h-[180px] flex flex-col">
                <h6 className='text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    {brand}
                </h6>

                <h3 className="text-[13px] sm:text-[14px] title mt-1 font-semibold mb-2 text-gray-800 line-clamp-2 min-h-[40px]">
                    <Link to={`/products/${id}`} className='link transition-all hover:text-[#ff5252]'>
                        {name}
                    </Link>
                </h3>

                <div className="mb-3">
                    <Rating
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        readOnly={true}
                        size='small'
                    />
                </div>

                <div className="flex items-center gap-3 mb-3 mt-auto">
                    <span className="oldPrice line-through text-gray-400 text-[13px] sm:text-[14px] font-medium">
                        ₦{oldPrice.toLocaleString()}
                    </span>
                    <span className="newPrice text-[16px] sm:text-[18px] text-[#ff5252] font-bold">
                        ₦{price.toLocaleString()}
                    </span>
                </div>

                <div className="w-full">
                    <Button className='bg-gradient-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]! text-white! flex w-full items-center justify-center gap-2 py-2! rounded-lg! shadow-md! hover:shadow-lg! transition-all! duration-300! font-medium! text-[13px]! sm:text-[14px]!'>
                        <MdOutlineShoppingCart className='text-[18px]' />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem