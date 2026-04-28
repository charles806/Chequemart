import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SideBar from "../../Component/SideBar";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItem from "../../Component/ProductItem/index";
import CircularProgress from "@mui/material/CircularProgress";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOption, setSortOption] = useState("name-asc");
    const [sortLabel, setSortLabel] = useState("Name, A to Z");
    const open = Boolean(anchorEl);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${import.meta.env.VITE_API_URL}/api/products`;
                if (searchQuery) {
                    url += `?search=${encodeURIComponent(searchQuery)}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery]);

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
        <section className="min-h-screen pb-8">
            <div className="bg-white p-2">
                <div className="my-container flex gap-3">
                    <div className="sidebarWrapper fixed -bottom-full left-0 w-full lg:h-full lg:static lg:w-[20%] bg-white z-102 lg:z-100 p-3 lg:p-0 transition-all lg:opacity-100 opacity-0">
                        <SideBar />
                    </div>
                    <div className="rightContent w-full lg:w-[80%] py-3">
                        {/* Sort By Header - Sticky with backdrop blur */}
                        <div className="bg-white/90 backdrop-blur-md p-3 px-4 w-full mb-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between sticky top-33.75 z-50 shadow-md border border-gray-200 gap-3 sm:gap-0">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                                {searchQuery && (
                                    <span> for "<span className="font-semibold text-gray-900">{searchQuery}</span>"</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className="text-[14px] font-medium text-gray-700 hidden sm:block">Sort By:</span>
                                <Button
                                    className="bg-white! border-2! border-[#ff5252]! text-[13px]! text-black! hover:bg-[#ff5252]! hover:text-white! transition-all! font-medium! px-4! py-1.5! rounded-lg! shadow-sm!"
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    {sortLabel}
                                </Button>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                    PaperProps={{
                                        style: {
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                            marginTop: '8px',
                                        }
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => handleSort("name-asc", "Name, A to Z")}
                                        selected={sortOption === "name-asc"}
                                        style={{
                                            backgroundColor: sortOption === "name-asc" ? '#fff5f5' : 'transparent',
                                            color: sortOption === "name-asc" ? '#ff5252' : 'inherit',
                                            fontWeight: sortOption === "name-asc" ? 600 : 400
                                        }}
                                    >
                                        Name, A to Z
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSort("name-desc", "Name, Z to A")}
                                        selected={sortOption === "name-desc"}
                                        style={{
                                            backgroundColor: sortOption === "name-desc" ? '#fff5f5' : 'transparent',
                                            color: sortOption === "name-desc" ? '#ff5252' : 'inherit',
                                            fontWeight: sortOption === "name-desc" ? 600 : 400
                                        }}
                                    >
                                        Name, Z to A
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSort("price-asc", "Price, Low to High")}
                                        selected={sortOption === "price-asc"}
                                        style={{
                                            backgroundColor: sortOption === "price-asc" ? '#fff5f5' : 'transparent',
                                            color: sortOption === "price-asc" ? '#ff5252' : 'inherit',
                                            fontWeight: sortOption === "price-asc" ? 600 : 400
                                        }}
                                    >
                                        Price, Low to High
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSort("price-desc", "Price, High to Low")}
                                        selected={sortOption === "price-desc"}
                                        style={{
                                            backgroundColor: sortOption === "price-desc" ? '#fff5f5' : 'transparent',
                                            color: sortOption === "price-desc" ? '#ff5252' : 'inherit',
                                            fontWeight: sortOption === "price-desc" ? 600 : 400
                                        }}
                                    >
                                        Price, High to Low
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>

                        {/* Product Grid - Fully Responsive */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20 w-full">
                                <CircularProgress size={40} className="text-[#ff5252]" />
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-20 w-full text-gray-400">
                                <p className="text-lg font-medium">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 animate-fadeIn">
                                {sortedProducts.map((product) => (
                                    <ProductItem
                                        key={product._id}
                                        product={{
                                            id: product._id,
                                            name: product.name,
                                            price: product.price,
                                            oldPrice: product.price * 1.2,
                                            image: product.images?.[0],
                                            brand: product.seller?.storeName || "Vendor"
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
