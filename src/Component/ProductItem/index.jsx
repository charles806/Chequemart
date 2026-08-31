import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from '../../MyContext';
import { toast } from "sonner";

const ProductItem = ({ product }) => {
  const { addToCart, setOpenCartPanel, user, addToWishlist, removeFromWishlist, wishlist } = useContext(MyContext);
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const wishlistCheck = useMemo(() => wishlist.some(item => item.id === id), [wishlist, id]);
  useEffect(() => { setIsInWishlist(wishlistCheck); }, [wishlistCheck]);



  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add products to cart!", { icon: '⚠️', style: { background: '#eab308', color: '#fff' } });
      return;
    }
    setIsAddingToCart(true);
    addToCart({ id, name, brand, price, oldPrice, image, rating, qty: 1 });
    toast.success(`${name} added to cart!`);
    setOpenCartPanel(true);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist!", { icon: '⚠️', style: { background: '#eab308', color: '#fff' } });
      return;
    }
    if (isInWishlist) removeFromWishlist(id);
    else addToWishlist(id);
  };



  return (
    <div className="productItem rounded-xl overflow-hidden border border-neutral-100 bg-white">
      <div className="group imgWrapper w-full overflow-hidden rounded-t-xl relative">
        <Link to={`/products/${id}`}>
          <div className="img h-48 sm:h-52 md:h-56 overflow-hidden bg-neutral-50">
            {image && <img src={image} alt={name} loading="lazy" width={300} height={300} className="w-full h-full object-cover" />}
          </div>
        </Link>
        {discount > 0 && (
          <span className="discount flex items-center absolute top-3 left-3 z-50 bg-primary-500 text-white rounded-lg px-2 py-1 text-[11px] sm:text-xs font-bold shadow-md">
            -{discount}%
          </span>
        )}
        <div className="actions absolute -top-5 right-2 z-50 flex items-center gap-2 flex-col w-12">
          {/* <Button
            onClick={handleCompare}
            className={`w-9! h-9! min-w-9! rounded-full! bg-white! text-neutral-700 hover:bg-primary-500! hover:text-white! shadow-lg! transition-all! ${isInCompare ? 'bg-primary-500! text-white!' : ''}`}
            aria-label={isInCompare ? `Remove ${name} from compare` : `Add ${name} to compare`}
          >
            <DiGitCompare className="text-lg!" />
          </Button> */}
          <Button
            onClick={handleWishlist}
            className={`w-9! h-9! min-w-9! rounded-full! bg-white! text-neutral-700! hover:bg-primary-500! hover:text-white! shadow-lg! transition-all! ${isInWishlist ? 'bg-primary-500! text-white!' : ''}`}
            aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          >
            {isInWishlist ? <FaHeart className="text-lg text-white!" /> : <FaRegHeart className="text-lg!" />}
          </Button>
        </div>
      </div>

      <div className="info p-3 py-4 relative h-auto min-h-45 flex flex-col">
        <h6 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">
          {brand}
        </h6>
        <h3 className="text-sm sm:text-[14px] title mt-1 font-semibold mb-2 text-neutral-800 line-clamp-2 min-h-10">
          <Link to={`/products/${id}`} className="text-neutral-800 hover:text-primary-500 transition-colors">
            {name}
          </Link>
        </h3>
        <div className="mb-3">
          <Rating value={value} onChange={(_, newValue) => setValue(newValue)} readOnly size="small" />
        </div>
        <div className="flex items-center gap-3 mb-3 mt-auto">
          {oldPrice > 0 && (
            <span className="oldPrice line-through text-neutral-300 text-sm font-medium">
              ₦{oldPrice.toLocaleString()}
            </span>
          )}
          <span className="newPrice text-base sm:text-lg text-primary-500 font-bold">
            ₦{price.toLocaleString()}
          </span>
        </div>
        <div className="w-full">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-primary-500! text-white! hover:bg-primary-600! flex w-full items-center justify-center gap-2 py-2! rounded-lg! shadow-md! font-medium! text-[13px]! sm:text-sm! transition-colors!"
          >
            {isAddingToCart ? (
              <><CircularProgress size={18} color="inherit" /> Adding...</>
            ) : (
              <><MdOutlineShoppingCart className="text-lg" /> Add to Cart</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
