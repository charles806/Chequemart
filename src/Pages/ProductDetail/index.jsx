import { Button, Rating } from "@mui/material";
import ProductZoom from "../../Component/ProductZoom";
import { useState } from "react";
import { QtyBox } from "../../Component/QtyBox";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import TextField from '@mui/material/TextField';

const ProductDetail = () => {

    const [productActionIndex, setProductActionIndex] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="min-h-screen pb-8 py-5 bg-white">
            <div className="my-container flex flex-col lg:flex-row gap-6 lg:gap-8 mb-5">

                {/* IMAGE */}
                <div className="productZoomContainer w-full lg:w-[45%]">
                    <ProductZoom />
                </div>

                {/* CONTENT */}
                <div className="ProductContent w-full lg:w-[55%]">
                    <h1 className="text-[20px] sm:text-[22px] lg:text-[25px] font-semibold mb-3 text-black">
                        Barca Jersey
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-400">
                            Brands: <span className="font-medium text-black opacity-75">Barcelona Home Jersey</span>
                        </span>

                        <Rating name="size-small" defaultValue={4} size="small" readOnly />
                        <span className="text-gray-400 text-[13px] cursor-pointer">
                            (4 reviews)
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="oldPrice line-through text-gray-400 text-[16px] sm:text-[18px] font-medium">₦20,000</span>
                        <span className="newPrice text-red-400 text-[16px] sm:text-[18px] font-medium">₦10,000</span>

                        <span className="text-[14px] text-green-500">
                            Available In Stock: <span className="font-medium text-black">2 items</span>
                        </span>
                    </div>

                    <p className="mt-3 mb-5 text-sm sm:text-base">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint consequatur voluptates eaque harum alias ad vero cumque reprehenderit modi vel at quod temporibus praesentium.
                    </p>

                    {/* SIZE */}
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

                    {/* QTY + CART */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 mt-5">
                        <div className="qtyBoxWrapper w-24">
                            <QtyBox />
                        </div>

                        <Button className="btn-org flex gap-2 items-center">
                            <MdOutlineShoppingCart className="text-[22px]" />
                            Add to Cart
                        </Button>
                    </div>

                    {/* WISHLIST */}
                    <div className="flex flex-wrap items-center gap-4 mt-5">
                        <span className="text-[15px] flex items-center gap-2 link cursor-pointer">
                            Add to Wishlist <FaRegHeart />
                        </span>
                        <span className="text-[15px] flex items-center gap-2 link cursor-pointer">
                            Add to Compare <IoGitCompareOutline />
                        </span>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="my-container pt-10 mt-5">
                <div className="flex flex-wrap gap-4">
                    {["Description", "Product Details", "Reviews (5)"].map((tab, i) => (
                        <span
                            key={i}
                            className={`link text-[16px] sm:text-[18px] lg:text-[20px] cursor-pointer font-medium ${activeTab === i && 'text-[#ff5252]'}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab}
                        </span>
                    ))}
                </div>

                {/* DESCRIPTION */}
                {activeTab === 0 && (
                    <div className="shadow-md rounded-md w-full py-5 px-5 sm:px-8 mt-5">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <h3 className="font-semibold mt-3">Lightweight Design</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                )}

                {/* PRODUCT DETAILS */}
                {activeTab === 1 && (
                    <div className="shadow-md rounded-md w-full py-5 px-4 sm:px-8 mt-5">
                        <div className="relative overflow-x-auto">
                            <table className="min-w-150 w-full text-sm text-left">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Color</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-6 py-4">Jersey</td>
                                        <td className="px-6 py-4">Red</td>
                                        <td className="px-6 py-4">Sports</td>
                                        <td className="px-6 py-4">₦10,000</td>
                                        <td className="px-6 py-4">2</td>
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