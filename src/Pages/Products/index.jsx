import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SideBar from "../../Component/SideBar";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItem from "../../Component/ProductItem/index";
import { SkeletonProductGrid } from "../../Component/Skeleton";
import ErrorMessage from "../../components/ErrorMessage";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOption, setSortOption] = useState("name-asc");
    const [sortLabel, setSortLabel] = useState("Name, A to Z");
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const open = Boolean(anchorEl);
    const limit = 20;

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");

    // Filter state
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedRating, setSelectedRating] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set("search", searchQuery);
            if (selectedCategory) params.set("category", selectedCategory);
            if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
            if (priceRange[1] < 1000000) params.set("maxPrice", String(priceRange[1]));
            if (selectedRating > 0) params.set("rating", String(selectedRating));
            params.set("page", String(page));
            params.set("limit", String(limit));
            const url = `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages || 1);
                }
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategory, selectedRating]);

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, page, selectedCategory, priceRange, selectedRating]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (option, label) => {
        setSortOption(option);
        setSortLabel(label);
        handleClose();
    };

    // Sort products based on selected option
    const sortedProducts = useMemo(() => {
        const productsCopy = [...products];

        switch (sortOption) {
            case "name-asc":
                return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
            case "name-desc":
                return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
            case "price-asc":
                return productsCopy.sort((a, b) => a.price - b.price);
            case "price-desc":
                return productsCopy.sort((a, b) => b.price - a.price);
            default:
                return productsCopy;
        }
    }, [products, sortOption]);

    return (
        <section className="min-h-screen pb-20 lg:pb-3 mt-6">
            <div className="bg-white">
                <div className="my-container flex gap-0 lg:gap-3">
                    {/* Sidebar */}
                    <div className="sidebarWrapper fixed inset-0 lg:static lg:w-[20%] bg-white z-[102] lg:z-[100] p-3 lg:p-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 lg:opacity-100 opacity-0 pointer-events-none lg:pointer-events-auto">
                        <SideBar
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            selectedRating={selectedRating}
                            onRatingChange={setSelectedRating}
                        />
                    </div>
                    <div className="rightContent w-full lg:w-[80%] py-3 px-2 sm:px-3">
                        {/* Sort By Header */}
                        <div className="bg-white/95 backdrop-blur-md px-3 sm:px-4 w-full mb-4 mt-14 lg:mt-0 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between sticky top-14.5 lg:top-0 z-50 shadow-xs border border-neutral-200 gap-3 sm:gap-0">
                            <div className="text-xs sm:text-sm text-neutral-600">
                                <span className="font-semibold text-neutral-900">{sortedProducts.length}</span> products
                                {searchQuery && (
                                    <span> for "<span className="font-semibold text-neutral-900">{searchQuery}</span>"</span>
                                )}
                                {selectedCategory && (
                                    <span> in <span className="font-semibold text-neutral-900">{selectedCategory}</span></span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                                <span className="text-xs sm:text-[14px] font-medium text-neutral-700 hidden sm:block">Sort:</span>
                                <Button
                                    className="bg-white! border! border-primary-500! text-xs! sm:text-[13px]! text-neutral-800! font-medium! px-2! sm:px-4! py-1! sm:py-1.5! rounded-lg! shadow-sm! min-w-0! sm:min-w-auto!"
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    disableTouchRipple
                                >
                                    <span className="hidden md:inline">{sortLabel}</span>
                                    <span className="md:hidden text-lg">☰</span>
                                </Button>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
                                    PaperProps={{
                                        style: {
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                            marginTop: '8px',
                                            minWidth: '160px',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => handleSort("name-asc", "A-Z")} selected={sortOption === "name-asc"} className={`text-sm! ${sortOption === "name-asc" ? "bg-primary-50! text-primary-500!" : ""}`}>
                                        Name, A to Z
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSort("name-desc", "Z-A")} selected={sortOption === "name-desc"} className={`text-sm! ${sortOption === "name-desc" ? "bg-primary-50! text-primary-500!" : ""}`}>
                                        Name, Z to A
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSort("price-asc", "Low-High")} selected={sortOption === "price-asc"} className={`text-sm! ${sortOption === "price-asc" ? "bg-primary-50! text-primary-500!" : ""}`}>
                                        Price: Low to High
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSort("price-desc", "High-Low")} selected={sortOption === "price-desc"} className={`text-sm! ${sortOption === "price-desc" ? "bg-primary-50! text-primary-500!" : ""}`}>
                                        Price: High to Low
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>

                        {/* Active filters */}
                        {(selectedCategory || selectedRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-xs font-medium text-neutral-500">Active filters:</span>
                                {selectedCategory && (
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 transition cursor-pointer"
                                    >
                                        {selectedCategory} ×
                                    </button>
                                )}
                                {selectedRating > 0 && (
                                    <button
                                        onClick={() => setSelectedRating(0)}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 transition cursor-pointer"
                                    >
                                        {selectedRating}+ stars ×
                                    </button>
                                )}
                                {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                                    <button
                                        onClick={() => setPriceRange([0, 1000000])}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 transition cursor-pointer"
                                    >
                                        ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()} ×
                                    </button>
                                )}
                                <button
                                    onClick={() => { setSelectedCategory(''); setSelectedRating(0); setPriceRange([0, 1000000]); }}
                                    className="text-xs text-neutral-400 hover:text-error-500 transition cursor-pointer"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {error ? (
                            <ErrorMessage message={error} onRetry={fetchProducts} />
                        ) : loading ? (
                            <SkeletonProductGrid count={4} />
                        ) : sortedProducts.length === 0 ? (
                            <div className="flex justify-center items-center py-16 sm:py-20 w-full">
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl font-medium text-neutral-500 mb-2">No products found</p>
                                    {searchQuery && (
                                        <p className="text-sm text-neutral-400">Try a different search term</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 animate-fadeIn">
                                    {sortedProducts.map((product) => (
                                        <ProductItem
                                            key={product._id}
                                            product={{
                                                id: product._id,
                                                name: product.name,
                                                price: product.discountPrice || product.price,
                                                oldPrice: product.discountPrice ? product.price : null,
                                                image: product.images?.[0],
                                                brand: product.seller?.storeName || "Vendor",
                                                rating: product.averageRating || 0
                                            }}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                            .map((p, idx, arr) => (
                                                <React.Fragment key={p}>
                                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                        <span className="text-gray-400">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setPage(p)}
                                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition cursor-pointer ${
                                                            p === page
                                                                ? "bg-primary-500 text-white"
                                                                : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                </React.Fragment>
                                            ))}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
