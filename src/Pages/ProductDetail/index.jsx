import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../MyContext";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";

// Components
import ProductZoom from "../../Component/ProductZoom";
import { QtyBox } from "../../Component/QtyBox";

// Icons
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, setOpenCartPanel, user } = useContext(MyContext);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [productActionIndex, setProductActionIndex] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

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

        addToCart({
            id: product._id,
            name: product.name,
            brand: product.seller?.storeName || "Vendor",
            price: product.price,
            oldPrice: product.price * 1.2,
            image: product.images?.[0],
            rating: 4.5,
            qty: qty
        });
        toast.success(`${product.name} added to cart!`);
        setOpenCartPanel(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <CircularProgress size={50} className="text-[#ff5252]" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
                <h2 className="text-xl font-semibold">Product not found</h2>
            </div>
        );
    }

    return (
        <section className="min-h-screen pb-8 py-5 bg-white">
            <div className="my-container flex flex-col lg:flex-row gap-6 lg:gap-8 mb-5">

                {/* IMAGE */}
                <div className="productZoomContainer w-full lg:w-[45%]">
                    <ProductZoom images={product.images} />
                </div>

                {/* CONTENT */}
                <div className="ProductContent w-full lg:w-[55%]">
                    <h1 className="text-[20px] sm:text-[22px] lg:text-[25px] font-semibold mb-3 text-black">
                        {product.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-400">
                            Brands: <span className="font-medium text-black opacity-75">{product.seller?.sellerInfo?.storeName || product.seller?.name || "Vendor"}</span>
                        </span>

                        <Rating name="size-small" defaultValue={4.5} size="small" precision={0.5} readOnly />
                        <span className="text-gray-400 text-[13px] cursor-pointer">
                            (4 reviews)
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="oldPrice line-through text-gray-400 text-[16px] sm:text-[18px] font-medium">₦{(product.price * 1.2).toLocaleString()}</span>
                        <span className="newPrice text-red-400 text-[16px] sm:text-[18px] font-medium">₦{product.price.toLocaleString()}</span>

                        <span className="text-[14px] text-green-500">
                            Available In Stock: <span className="font-medium text-black">{product.stock} items</span>
                        </span>
                    </div>

                    <p className="mt-3 mb-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    {/* SIZE (Optional) */}
                    {product.category === "Fashion" && (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[15px]">Size:</span>
                            <div className="flex flex-wrap items-center gap-2 actions">
                                {["S", "M", "L"].map((size, i) => (
                                    <Button
                                        key={i}
                                        className={`${productActionIndex === i
                                            ? 'bg-[#ff5252]! text-white!'
                                            : 'min-w-7.5! border! border-[rgba(0,0,0,0.1)]! text-black! bg-white!'
                                            }`}
                                        onClick={() => setProductActionIndex(i)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QTY + CART */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 mt-5">
                        <div className="qtyBoxWrapper w-24">
                            <QtyBox onChange={(val) => setQty(val)} />
                        </div>

                        <Button 
                            onClick={handleAddToCart}
                            className="btn-org flex gap-2 items-center"
                        >
                            <MdOutlineShoppingCart className="text-[22px]" />
                            Add to Cart
                        </Button>
                    </div>

                    {/* WISHLIST */}
                    <div className="flex flex-wrap items-center gap-4 mt-5">
                        <span className="text-[15px] flex items-center gap-2 link cursor-pointer text-gray-500 hover:text-[#ff5252] transition">
                            Add to Wishlist <FaRegHeart />
                        </span>
                        <span className="text-[15px] flex items-center gap-2 link cursor-pointer text-gray-500 hover:text-[#ff5252] transition">
                            Add to Compare <IoGitCompareOutline />
                        </span>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="my-container pt-10 mt-5">
                <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-3">
                    {["Description", "Product Details", "Reviews (5)"].map((tab, i) => (
                        <span
                            key={i}
                            className={`link text-[16px] sm:text-[18px] cursor-pointer font-semibold transition-all relative pb-3 ${activeTab === i ? 'text-[#ff5252]' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab}
                            {activeTab === i && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff5252]"></span>}
                        </span>
                    ))}
                </div>

                {/* DESCRIPTION */}
                {activeTab === 0 && (
                    <div className="rounded-md w-full py-8 mt-5 text-gray-600 leading-relaxed">
                        <p>{product.description}</p>
                        <h3 className="font-bold text-black mt-6 text-lg">Key Features</h3>
                        <ul className="list-disc pl-5 mt-3 space-y-2">
                            <li>High quality materials</li>
                            <li>Durable and long lasting</li>
                            <li>Official ChequeMart certified</li>
                        </ul>
                    </div>
                )}

                {/* PRODUCT DETAILS */}
                {activeTab === 1 && (
                    <div className="rounded-md w-full py-8 mt-5">
                        <div className="relative overflow-x-auto border border-gray-100 rounded-xl">
                            <table className="min-w-150 w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Attribute</th>
                                        <th className="px-6 py-4">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-900">Condition</td>
                                        <td className="px-6 py-4 text-gray-600">New</td>
                                    </tr>
                                    <tr>
                                         <td className="px-6 py-4 font-medium text-gray-900">Seller</td>
                                         <td className="px-6 py-4 text-gray-600">{product.seller?.sellerInfo?.storeName || product.seller?.name}</td>
                                     </tr>
                                     <tr>
                                         <td className="px-6 py-4 font-medium text-gray-900">Category</td>
                                         <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                     </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-900">Stock Status</td>
                                        <td className="px-6 py-4 text-gray-600">{product.stock > 0 ? "In Stock" : "Out of Stock"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* REVIEWS */}
                {activeTab === 2 && (
                    <div className="shadow-md rounded-md w-full py-5 px-4 sm:px-8 mt-5">
                        <div className="w-full lg:w-[80%]">

                            <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
                                <h2 className="text-[18px]">Add a review</h2>
                                <form className="w-full mt-5">
                                    <TextField
                                        multiline
                                        rows={5}
                                        placeholder="Write a review..."
                                        className="w-full"
                                    />
                                    <br />
                                    <br />
                                    <Rating defaultValue={0} />
                                    <br />
                                    <br />
                                    <div className="">
                                        <Button className="btn-org mt-4">Submit Review</Button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductDetail;