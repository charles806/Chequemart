import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
//UI
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
//Icons
import { DiGitCompare } from "react-icons/di";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";

import { MyContext } from '../../MyContext';
import { toast } from "sonner";

const ProductItem = ({ product }) => {
    const { addToCart, setOpenCartPanel, user, addToWishlist, removeFromWishlist, wishlist } = useContext(MyContext);
    // Destructure product data with fallback values
    const {
        id,
        name = "Loading...",
        brand = "",
        price = 0,
        oldPrice = 0,
        rating = 0,
        image = "",
        discount = 0
    } = product || {};

    const [value, setValue] = useState(rating);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [compareItems, setCompareItems] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Use useMemo for derived state to avoid useEffect
    const wishlistCheck = useMemo(() => wishlist.some(item => item.id === id), [wishlist, id]);
    useEffect(() => {
        setIsInWishlist(wishlistCheck);
    }, [wishlistCheck]);

    useEffect(() => {
        const saved = localStorage.getItem('compareItems');
        if (saved) {
            setCompareItems(JSON.parse(saved));
        }
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to add products to cart!", {
                icon: '⚠️',
                style: {
                    background: '#eab308',
                    color: '#fff',
                }
            });
            return;
        }

        setIsAddingToCart(true);
        addToCart({
            id,
            name,
            brand,
            price,
            oldPrice,
            image,
            rating,
            qty: 1
        });
        toast.success(`${name} added to cart!`);
        setOpenCartPanel(true);
        
        // Reset loading state after a short delay
        setTimeout(() => setIsAddingToCart(false), 500);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to add to wishlist!", {
                icon: '⚠️',
                style: {
                    background: '#eab308',
                    color: '#fff',
                }
            });
            return;
        }

        if (isInWishlist) {
            removeFromWishlist(id);
        } else {
            addToWishlist(id);
        }
    };

    const handleCompare = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const current = JSON.parse(localStorage.getItem('compareItems') || '[]');
        const exists = current.find(p => p.id === id);

        if (exists) {
            const updated = current.filter(p => p.id !== id);
            localStorage.setItem('compareItems', JSON.stringify(updated));
            setCompareItems(updated);
            toast.info("Removed from compare");
        } else {
            if (current.length >= 4) {
                toast.error("Compare max 4 products");
                return;
            }
            const updated = [...current, { id, name, price, image, brand }];
            localStorage.setItem('compareItems', JSON.stringify(updated));
            setCompareItems(updated);
            toast.success("Added to compare");
        }
    };

    const isInCompare = compareItems.some(p => p.id === id);

    return (
        <div className='productItem rounded-xl overflow-hidden border border-gray-100 bg-white'>
            <div className="group imgWrapper w-full overflow-hidden rounded-t-xl relative">
                <Link to={`/products/${id}`}>
                    <div className="img h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
                        {image && <img src={image} alt={name} loading="lazy" decoding="async" width={300} height={300} className='w-full h-full object-cover' />}
                    </div>
                </Link>
                {discount > 0 && (
                    <span className="discount flex items-center absolute top-3 left-3 z-50 bg-gradient-to-r from-[#ff5252] to-[#ff7b7b] text-white rounded-lg px-2 py-1 text-[11px] sm:text-[12px] font-bold shadow-lg">
                        -{discount}%
                    </span>
                )}
                <div className="actions absolute -top-5 right-2 z-50 flex items-center gap-2 flex-col w-12.5">
                    <Button 
                        onClick={handleCompare} 
                        className={`w-9! h-9! min-w-9! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white! shadow-lg! ${isInCompare ? '!bg-[#ff5252] !text-white' : ''}`}
                        aria-label={isInCompare ? `Remove ${name} from compare` : `Add ${name} to compare`}
                    >
                        <DiGitCompare className='text-[18px] text-black!' />
                    </Button>
                    <Button 
                        onClick={handleWishlist} 
                        className={`w-9! h-9! min-w-9! rounded-full! bg-white! text-black hover:bg-[#ff5252]! hover:text-white! shadow-lg! ${isInWishlist ? '!bg-[#ff5252] !text-white' : ''}`}
                        aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
                    >
                        {isInWishlist ? <FaHeart className='text-[18px] text-white!' /> : <FaRegHeart className='text-[18px] text-black!' />}
                    </Button>
                </div>
            </div>

            <div className="info p-3 py-4 relative h-auto min-h-[180px] flex flex-col">
                <h6 className='text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    {brand}
                </h6>

                <h3 className="text-[13px] sm:text-[14px] title mt-1 font-semibold mb-2 text-gray-800 line-clamp-2 min-h-[40px]">
                    <Link to={`/products/${id}`} className='link'>
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
                    <Button 
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className='bg-gradient-to-r from-[#ff5252] to-[#ff7b7b]! text-white! flex w-full items-center justify-center gap-2 py-2! rounded-lg! shadow-md! font-medium! text-[13px]! sm:text-[14px]!'
                    >
                        {isAddingToCart ? (
                          <>
                            <CircularProgress size={18} color="inherit" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <MdOutlineShoppingCart className='text-[18px]' />
                            Add to Cart
                          </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem