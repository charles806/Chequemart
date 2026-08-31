import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../MyContext";
import { authFetch } from "../../api";
import { toast } from "sonner";
import { SkeletonProductDetail } from "../../Component/Skeleton";
import ProductZoom from "../../Component/ProductZoom";
import { QtyBox } from "../../Component/QtyBox";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt, FaShippingFast, FaShieldAlt, FaUndo, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";

const decodeHTML = (html) => {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const StarRating = ({ rating, size = "text-sm" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className={`${size} text-amber-400`} />);
    else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} className={`${size} text-amber-400`} />);
    else stars.push(<FaRegStar key={i} className={`${size} text-neutral-300`} />);
  }
  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, setOpenCartPanel, user, addToWishlist, removeFromWishlist, wishlist } = useContext(MyContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [compareItems, setCompareItems] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('compareItems');
    if (saved) setCompareItems(JSON.parse(saved));
  }, []);

  const isInCompare = compareItems.some(p => p.id === product?._id);
  const isInWishlist = wishlist.some(item => item.id === product?._id);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      const data = await res.json();
      if (data.success) setProduct(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.data?.reviews || []);
    } catch { /* silent */ }
    finally { setReviewsLoading(false); }
  };

  useEffect(() => { fetchProduct(); }, [id]);
  useEffect(() => { if (product) fetchReviews(); }, [product?._id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login to add products to cart!", { icon: '⚠️', style: { background: '#eab308', color: '#fff' } });
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      brand: product.seller?.storeName || "Vendor",
      price: product.price,
      oldPrice: product.discountPrice || null,
      image: product.images?.[0],
      rating: product.averageRating || 0,
      qty
    });
    toast.success(`${product.name} added to cart!`);
    setOpenCartPanel(true);
  };

  const handleCompare = () => {
    if (!product) return;
    const current = JSON.parse(localStorage.getItem('compareItems') || '[]');
    const exists = current.find(p => p.id === product._id);
    if (exists) {
      const updated = current.filter(p => p.id !== product._id);
      localStorage.setItem('compareItems', JSON.stringify(updated));
      setCompareItems(updated);
      toast.info("Removed from compare");
    } else {
      if (current.length >= 4) { toast.error("Compare max 4 products"); return; }
      const updated = [...current, { id: product._id, name: product.name, price: product.price, image: product.images?.[0], brand: product.seller?.storeName || 'Vendor' }];
      localStorage.setItem('compareItems', JSON.stringify(updated));
      setCompareItems(updated);
      toast.success("Added to compare");
    }
  };

  const handleWishlist = () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login to add to wishlist!", { icon: '⚠️', style: { background: '#eab308', color: '#fff' } });
      return;
    }
    if (isInWishlist) removeFromWishlist(product._id);
    else addToWishlist(product._id);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to submit a review"); return; }
    if (reviewRating === 0) { toast.error("Please select a rating"); return; }
    setSubmittingReview(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/rate`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, review: reviewText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully");
        setReviewRating(0);
        setReviewText("");
        fetchReviews();
        fetchProduct();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Group variants by name (e.g., "Size", "Color")
  const variantGroups = (product?.variants || []).reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  const isLowStock = product && product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product && product.stock <= 0;
  const avgRating = product?.averageRating || 0;
  const totalReviews = product?.totalReviews || 0;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <SkeletonProductDetail />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} fullPage />;
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-neutral-400">
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    );
  }

  const tabLabels = [
    "Description",
    "Product Details",
    `Reviews (${totalReviews})`,
  ];

  return (
    <section className="min-h-screen pt-6 pb-20 lg:pb-8 bg-white">
      <div className="my-container flex flex-col lg:flex-row gap-12 lg:gap-10 mb-8">
        {/* Image */}
        <div className="w-full lg:w-[45%] mt-8!">
          <ProductZoom images={product.images} />
        </div>

        {/* Content */}
        <div className="w-full lg:w-[55%]">
          <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold mb-3 text-neutral-900">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-neutral-400 text-sm">
              Sold by: <span className="font-medium text-neutral-700">{product.seller?.sellerInfo?.storeName || product.seller?.name || "Vendor"}</span>
            </span>
            {avgRating > 0 && (
              <>
                <StarRating rating={avgRating} />
                <span className="text-neutral-400 text-[13px]">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {product.discountPrice && (
              <span className="line-through text-neutral-300 text-base sm:text-lg font-medium">₦{product.price.toLocaleString()}</span>
            )}
            <span className="text-primary-500 text-base sm:text-lg font-bold">
              ₦{(product.discountPrice || product.price).toLocaleString()}
            </span>
          </div>

          {/* Stock + condition */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {isOutOfStock ? (
              <span className="text-sm text-error-500 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-sm text-amber-600 font-medium">Only {product.stock} left in stock — order soon</span>
            ) : (
              <span className="text-sm text-success-500 font-medium">In Stock ({product.stock} available)</span>
            )}
            {product.condition && (
              <span className="text-sm text-neutral-400">Condition: <span className="font-medium text-neutral-700">{product.condition}</span></span>
            )}
          </div>

          {/* Delivery fee */}
          {product.deliveryFee > 0 && (
            <p className="mt-2 text-sm text-neutral-400">
              Delivery fee: <span className="font-medium text-neutral-700">₦{product.deliveryFee.toLocaleString()}</span>
            </p>
          )}

          <p className="mt-3 mb-5 text-sm sm:text-base text-neutral-500 leading-relaxed">
            {decodeHTML(product.description)}
          </p>

          {/* Variants (e.g., Size, Color) */}
          {Object.entries(variantGroups).map(([variantName, options]) => (
            <div key={variantName} className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[15px] text-neutral-700">{variantName}:</span>
              <div className="flex flex-wrap items-center gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedVariant(opt)}
                    disabled={opt.stock <= 0}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition cursor-pointer
                      ${selectedVariant?.value === opt.value
                        ? 'bg-primary-500 text-white border-primary-500'
                        : opt.stock <= 0
                          ? 'bg-neutral-50 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300'}`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Qty + Cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 mt-5">
            <div className="w-24">
              <QtyBox onChange={(val) => setQty(val)} />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition cursor-pointer
                ${isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-200'}`}
            >
              <MdOutlineShoppingCart className="text-xl" /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Wishlist + Compare */}
          <div className="flex flex-wrap items-center gap-4 mt-5">
            <span
              onClick={handleWishlist}
              className={`text-[15px] flex items-center gap-2 cursor-pointer transition ${isInWishlist ? 'text-primary-500' : 'text-neutral-400 hover:text-primary-500'}`}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'} <FaRegHeart className={isInWishlist ? 'text-primary-500' : ''} />
            </span>
            <span
              onClick={handleCompare}
              className={`text-[15px] flex items-center gap-2 cursor-pointer transition ${isInCompare ? 'text-primary-500' : 'text-neutral-400 hover:text-primary-500'}`}
            >
              {isInCompare ? 'Remove from Compare' : 'Add to Compare'} <IoGitCompareOutline className={isInCompare ? 'text-primary-500' : ''} />
            </span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="my-container mt-8!">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-neutral-50 rounded-xl border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <FaShippingFast className="text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Fast Delivery</p>
              <p className="text-xs text-neutral-400">Within your city</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Secure Payment</p>
              <p className="text-xs text-neutral-400">Paystack protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <FaUndo className="text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Easy Returns</p>
              <p className="text-xs text-neutral-400">If not satisfied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="my-container pt-12 mt-6!">
        <div className="flex flex-wrap gap-4 border-b border-neutral-100 pb-3">
          {tabLabels.map((tab, i) => (
            <span
              key={i}
              className={`text-base sm:text-lg cursor-pointer font-semibold transition-all relative pb-3 ${activeTab === i ? 'text-primary-500' : 'text-neutral-400 hover:text-neutral-600'}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
              {activeTab === i && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500" />}
            </span>
          ))}
        </div>

        {/* Description tab */}
        {activeTab === 0 && (
          <div className="w-full py-8 mt-5 text-neutral-500 leading-relaxed">
            <p>{decodeHTML(product.description)}</p>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <>
                <h3 className="font-bold text-neutral-900 mt-6 text-lg">Key Features</h3>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium text-neutral-700">{key}:</span> {String(value)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Product Details tab */}
        {activeTab === 1 && (
          <div className="w-full py-8 mt-5">
            <div className="relative overflow-x-auto border border-neutral-100 rounded-xl">
              <table className="min-w-150 w-full text-sm text-left">
                <thead className="bg-neutral-50 text-neutral-400 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Attribute</th>
                    <th className="px-6 py-4">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-neutral-900">Condition</td>
                    <td className="px-6 py-4 text-neutral-500">{product.condition || "Brand New"}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-neutral-900">Seller</td>
                    <td className="px-6 py-4 text-neutral-500">{product.seller?.sellerInfo?.storeName || product.seller?.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-neutral-900">Category</td>
                    <td className="px-6 py-4 text-neutral-500">{product.category}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-neutral-900">Stock Status</td>
                    <td className="px-6 py-4 text-neutral-500">{isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}</td>
                  </tr>
                  {product.sku && (
                    <tr>
                      <td className="px-6 py-4 font-medium text-neutral-900">SKU</td>
                      <td className="px-6 py-4 text-neutral-500 font-mono text-xs">{product.sku}</td>
                    </tr>
                  )}
                  {product.deliveryFee > 0 && (
                    <tr>
                      <td className="px-6 py-4 font-medium text-neutral-900">Delivery Fee</td>
                      <td className="px-6 py-4 text-neutral-500">₦{product.deliveryFee.toLocaleString()}</td>
                    </tr>
                  )}
                  {avgRating > 0 && (
                    <tr>
                      <td className="px-6 py-4 font-medium text-neutral-900">Rating</td>
                      <td className="px-6 py-4 text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                          <StarRating rating={avgRating} size="text-xs" />
                          <span className="text-xs text-neutral-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                        </span>
                      </td>
                    </tr>
                  )}
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 font-medium text-neutral-900">{key}</td>
                      <td className="px-6 py-4 text-neutral-500">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 2 && (
          <div className="w-full py-8 mt-5">
            <div className="w-full lg:w-[80%]">
              {/* Review form */}
              {user && (
                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 mb-8">
                  <h2 className="text-lg text-neutral-900 font-semibold mb-4">Add a Review</h2>
                  <form onSubmit={handleSubmitReview}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-neutral-500">Your Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="cursor-pointer transition hover:scale-110"
                          >
                            {star <= reviewRating ? (
                              <FaStar className="text-xl text-amber-400" />
                            ) : (
                              <FaRegStar className="text-xl text-neutral-300 hover:text-amber-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review... (optional)"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingReview || reviewRating === 0}
                      className={`mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer
                        ${submittingReview || reviewRating === 0
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-200'}`}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews list */}
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-neutral-400">
                  <p className="text-sm font-medium">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-neutral-100 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-500">
                              {(review.user || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-neutral-800">{review.user || 'Anonymous'}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{formatDate(review.createdAt)}</span>
                      </div>
                      <StarRating rating={review.rating} size="text-xs" />
                      {review.review && (
                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{review.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
