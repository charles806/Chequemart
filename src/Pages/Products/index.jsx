import React, { useState, useMemo } from "react";
import SideBar from "../../Component/SideBar";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItem from "../../Component/ProductItem/index";
import productImg1 from '../../assets/image/product1.jpg';

// Mock product data - can be replaced with API data later
const MOCK_PRODUCTS = [
    { id: 1, name: "Barcelona Home Jersey", brand: "BARCA", price: 10000, oldPrice: 20000, rating: 4, image: productImg1, discount: 50 },
    { id: 2, name: "Wireless Headphones", brand: "SONY", price: 15000, oldPrice: 25000, rating: 5, image: productImg1, discount: 40 },
    { id: 3, name: "Smart Watch", brand: "APPLE", price: 45000, oldPrice: 60000, rating: 5, image: productImg1, discount: 25 },
    { id: 4, name: "Running Shoes", brand: "NIKE", price: 12000, oldPrice: 18000, rating: 4, image: productImg1, discount: 33 },
    { id: 5, name: "Laptop Backpack", brand: "SAMSONITE", price: 8000, oldPrice: 15000, rating: 3, image: productImg1, discount: 47 },
    { id: 6, name: "Bluetooth Speaker", brand: "JBL", price: 18000, oldPrice: 30000, rating: 5, image: productImg1, discount: 40 },
    { id: 7, name: "Gaming Mouse", brand: "LOGITECH", price: 7000, oldPrice: 12000, rating: 4, image: productImg1, discount: 42 },
    { id: 8, name: "Yoga Mat", brand: "ADIDAS", price: 5000, oldPrice: 8000, rating: 4, image: productImg1, discount: 38 },
    { id: 9, name: "Coffee Maker", brand: "PHILIPS", price: 22000, oldPrice: 35000, rating: 5, image: productImg1, discount: 37 },
    { id: 10, name: "Desk Lamp", brand: "IKEA", price: 6000, oldPrice: 10000, rating: 3, image: productImg1, discount: 40 },
    { id: 11, name: "Water Bottle", brand: "THERMOS", price: 3500, oldPrice: 6000, rating: 4, image: productImg1, discount: 42 },
    { id: 12, name: "Phone Case", brand: "SPIGEN", price: 2500, oldPrice: 5000, rating: 5, image: productImg1, discount: 50 },
    { id: 13, name: "Sunglasses", brand: "RAY-BAN", price: 25000, oldPrice: 40000, rating: 5, image: productImg1, discount: 38 },
    { id: 14, name: "Fitness Tracker", brand: "FITBIT", price: 20000, oldPrice: 32000, rating: 4, image: productImg1, discount: 38 },
    { id: 15, name: "Portable Charger", brand: "ANKER", price: 8500, oldPrice: 14000, rating: 5, image: productImg1, discount: 39 },
    { id: 16, name: "Travel Pillow", brand: "TRTL", price: 4500, oldPrice: 7500, rating: 4, image: productImg1, discount: 40 },
];

const Products = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOption, setSortOption] = useState("name-asc");
    const [sortLabel, setSortLabel] = useState("Name, A to Z");
    const open = Boolean(anchorEl);

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
        const productsCopy = [...MOCK_PRODUCTS];

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
    }, [sortOption]);

    return (
        <section className="min-h-screen pb-8">
            <div className="bg-white p-2">
                <div className="my-container flex gap-3">
                    <div className="sidebarWrapper fixed -bottom-full left-0 w-full lg:h-full lg:static lg:w-[20%] bg-white z-102 lg:z-100 p-3 lg:p-0 transition-all lg:opacity-100 opacity-0">
                        <SideBar />
                    </div>
                    <div className="rightContent w-full lg:w-[80%] py-3">
                        {/* Sort By Header - Sticky with backdrop blur */}
                        <div className="bg-white/90 backdrop-blur-md p-3 px-4 w-full mb-6 rounded-lg flex items-center justify-between sticky top-[135px] z-50 shadow-md border border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                            </div>
                            <div className="flex items-center gap-3">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 animate-fadeIn">
                            {sortedProducts.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
