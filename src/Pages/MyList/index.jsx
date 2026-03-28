import React, { useState } from 'react'
import { Link } from 'react-router-dom'
//Components
import ProductItem from '../../Component/ProductItem/index'
//MUI
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//Icons
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const mockWishlist = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        brand: "Sony",
        price: 45000,
        oldPrice: 65000,
        rating: 4,
        discount: 30,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
    },
    {
        id: 2,
        name: "Smart Watch Series 8",
        brand: "Apple",
        price: 120000,
        oldPrice: 150000,
        rating: 5,
        discount: 20,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
    },
    {
        id: 3,
        name: "Leather Crossbody Bag",
        brand: "Coach",
        price: 28000,
        oldPrice: 40000,
        rating: 4,
        discount: 30,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"
    },
    {
        id: 4,
        name: "Running Shoes Pro",
        brand: "Nike",
        price: 35000,
        oldPrice: 50000,
        rating: 4,
        discount: 30,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
    },
    {
        id: 5,
        name: "Vintage Sunglasses",
        brand: "Ray-Ban",
        price: 18000,
        oldPrice: 25000,
        rating: 4,
        discount: 28,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
    },
    {
        id: 6,
        name: "Minimalist Desk Lamp",
        brand: "Philips",
        price: 15000,
        oldPrice: 22000,
        rating: 4,
        discount: 32,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"
    }
]

const MyList = () => {
    const [wishlistItems, setWishlistItems] = useState(mockWishlist)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveItem = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id))
    }

    const handleClearAll = () => {
        setWishlistItems([])
        handleClose()
    }

    const handleAddToCart = (id) => {
        console.log("Added to cart:", id)
    }

    // const handleShare = () => {
    //     if (navigator.share) {   
    //         navigator.share({
    //             title: 'My Wishlist',
    //             text: 'Check out my wishlist!',
    //             url: window.location.href
    //         })
    //     }
    // }

    const sortOptions = [
        { label: 'Date Added (Newest)', value: 'date-desc' },
        { label: 'Date Added (Oldest)', value: 'date-asc' },
        { label: 'Price (Low to High)', value: 'price-asc' },
        { label: 'Price (High to Low)', value: 'price-desc' },
        { label: 'Name (A-Z)', value: 'name-asc' },
    ]

    return (
        <section className='section py-8 pb-12 bg-gray-50 min-h-screen'>
            <div className="my-container">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link to="/" className="hover:text-[#ff5252] transition-colors">Home</Link>
                        <FaRegArrowAltCircleLeft className="rotate-180 text-xs" />
                        <span className="text-gray-800">My List</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                                <FaRegHeart className="text-[#ff5252]" />
                                My Wishlist
                            </h1>
                            <p className="mt-1 text-gray-500">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {wishlistItems.length > 0 && (
                                <>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleClick}
                                        startIcon={<FaSortAmountDown />}
                                        className="border-gray-300! text-gray-600! hover:border-[#ff5252]! hover:text-[#ff5252]!"
                                    >
                                        Sort
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.value} onClick={handleClose}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                    {/* <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<FaShareAlt />}
                                        onClick={handleShare}
                                        className="border-gray-300! text-gray-600! hover:border-[#ff5252]! hover:text-[#ff5252]!"
                                    >
                                        Share
                                    </Button> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {wishlistItems.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FiShoppingBag className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Save items you love by clicking the heart icon on any product. They'll appear here for easy access later.
                        </p>
                        <Button
                            variant="contained"
                            className="bg-linear-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]! text-white! px-8 py-2.5! rounded-lg!"
                        >
                            <Link to="/products" className="text-white!">
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveItem(product.id)}
                                    className="absolute top-25 right-4 z-50 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ff5252] hover:text-white cursor-pointer"
                                >
                                    <FaTrash className="text-sm" />
                                </button>

                                {/* Product Card */}
                                <ProductItem product={product} />

                            </div>
                        ))}
                    </div>
                )}

                {/* Clear All Button */}
                {wishlistItems.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="text"
                            startIcon={<FaTrash />}
                            onClick={handleClearAll}
                            className="text-gray-500! hover:text-[#ff5252]!"
                        >
                            Clear Wishlist
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default MyList