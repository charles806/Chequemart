import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductItem from '../../Component/ProductItem/index';
import { MyContext } from '../../MyContext';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaRegHeart, FaTrash, FaSortAmountDown, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const MyList = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleRemoveItem = (id) => removeFromWishlist(id);

  const handleClearAll = async () => {
    for (const item of wishlist) await removeFromWishlist(item.id);
    setAnchorEl(null);
  };

  const sortOptions = [
    { label: 'Date Added (Newest)', value: 'date-desc' },
    { label: 'Date Added (Oldest)', value: 'date-asc' },
    { label: 'Price (Low to High)', value: 'price-asc' },
    { label: 'Price (High to Low)', value: 'price-desc' },
    { label: 'Name (A-Z)', value: 'name-asc' },
  ];

  return (
    <section className="py-8 pb-12 bg-neutral-50 min-h-screen">
      <div className="my-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
            <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <FaRegArrowAltCircleLeft className="rotate-180 text-xs" />
            <span className="text-neutral-700">My List</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <FaRegHeart className="text-primary-500" /> My Wishlist
              </h1>
              <p className="mt-1 text-neutral-400">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlist.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<FaSortAmountDown />}
                className="border-neutral-200! text-neutral-500! hover:border-primary-500! hover:text-primary-500!"
              >
                Sort
              </Button>
            )}
            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} onClick={() => setAnchorEl(null)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-neutral-100">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <FiShoppingBag className="text-4xl text-neutral-300" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-400 text-center max-w-md mb-6">
              Save items you love by clicking the heart icon on any product. They&apos;ll appear here for easy access later.
            </p>
            <Link to="/products">
              <Button variant="contained" className="btn-org! px-8 py-2.5!">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="absolute top-25 right-4 z-50 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:text-white cursor-pointer"
                >
                  <FaTrash className="text-sm" />
                </button>
                <ProductItem product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  oldPrice: product.oldPrice || null,
                  image: product.image,
                  brand: product.brand
                }} />
              </div>
            ))}
          </div>
        )}

        {/* Clear all */}
        {wishlist.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="text"
              startIcon={<FaTrash />}
              onClick={handleClearAll}
              className="text-neutral-400! hover:text-primary-500!"
            >
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyList;
