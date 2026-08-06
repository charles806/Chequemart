import React, { useContext, useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//Images
import logo from "../../assets/image/logo1.png";
//Ui Material
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import Divider from "@mui/material/Divider";
//Icons
import { CiLogout, CiMenuBurger, CiSearch } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import { DiGitCompare } from "react-icons/di";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { RiShoppingBag2Fill } from "react-icons/ri";
//Components
import Navigation from "./Navigation";
import { MyContext } from "../../MyContext";


// Define StyledBadge component
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {

  const navigate = useNavigate();

  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  const openCategoryPanel = () => {
    context.setIsOpenCatPanel(true);
  };


  const handleLogout = () => {
    handleCloseMenu();
    if (context.logout) {
      context.logout();
    }
    navigate("/");
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Search effect - only navigate, don't set loading here
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      navigate(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
      // Navigate away - search panel will close on unmount/route change
    }
  }, [debouncedSearch, navigate]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchInput.trim()) {
        setSearchLoading(true);
        navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
        setIsSearchOpen(false);
        // Reset loading after navigation
        setTimeout(() => setSearchLoading(false), 300);
      }
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-white fixed lg:sticky left-0 w-full top-0 lg:-top-11.75 z-101 shadow-md">
      <div className="top-strip hidden lg:block py-2 border-t border-b">
        <div className="my-container">
          <div className="flex items-center justify-between px-4">
            <div className="col1 hidden lg:block">
              <p className="text-[12px] font-medium mt-0 mb-0">
                Trusted By 100+ Customers across Nigeria
              </p>
            </div>

            <div className="col2 flex items-center justify-end gap-6">
              <Link
                to="/help-center"
                className="text-[11px] lg:text-[13px] link font-medium transition"
              >
                Help Center
              </Link>
              <Link
                to={context.user?.role === "seller" && context.user?.sellerInfo?.onboardingComplete ? "/seller/dashboard" : "/account?openBecomeSeller=true"}
                className="text-[11px] lg:text-[13px] link font-medium transition"
              >
                {context.user?.role === "seller" && context.user?.sellerInfo?.onboardingComplete ? "Seller Dashboard" : "Sell on Chequemart"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="header py-2 lg:py-4 border-b border-black/10">
        <div className="my-container h-16 lg:h-22.5 flex items-center justify-between gap-4 lg:gap-0">
          <Button className="w-8.75! min-w-8.75! h-8.75! rounded-full! font-bold text-black! lg:hidden! shrink-0!"
            onClick={openCategoryPanel}>
            <CiMenuBurger className="w-6 h-6 text-[20px] text-bold" />
          </Button>

          {/* Logo */}
          <div className="col1 w-[40%] lg:w-[25%] shrink-0!">
            <Link to="/">
              <img
                src={logo}
                alt="ChequeMart Logo"
                className="max-w-35 lg:max-w-50 h-auto"
              />
            </Link>
          </div>

<div className="col2 hidden lg:block lg:w-[30%] lg:shrink-0!">
            <div className="searchBox w-full h-12.5 bg-[#e5e5e5] rounded-[5px] relative p-2">
              <label htmlFor="header-search" className="sr-only">Search products</label>
              <input
                id="header-search"
                type="text"
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full h-8.75 focus:outline-none bg-inherit p-2 text-[15px]"
                aria-label="Search products"
              />

              <Button onClick={handleSearch} className="absolute! top-2 right-1.25 z-50 w-9.25! min-w-9.25! h-9.25 rounded-full! text-black!" aria-label="Search">
                {searchLoading ? <CircularProgress size={18} /> : <CiSearch className="text-[#000000] text-[22px] font-bold" />}
              </Button>
            </div>
          </div>

          <div className="col3 w-auto lg:w-[40%] flex items-center shrink-0!">


            <ul className="flex items-center justify-end gap-3 w-full">
              {!context.isLogin ? (
                <li className="list-none whitespace-nowrap hidden lg:block">
                  <Link
                    to="/login"
                    className="text-[13px] lg:text-[15px] link font-medium transition"
                  >
                    Login
                  </Link>{" "}
                  |{" "}
                  <Link
                    to="/register"
                    className="text-[13px] lg:text-[15px] link font-medium transition"
                  >
                    Register
                  </Link>
                </li>
              )

                :
                (
                  <>
                    <Button className="myAccountWrap hidden! lg:flex! items-center gap-3 text-black! h-15!" onClick={handleClickMenu}>
                      <span className="w-10! h-10! min-w-10! rounded-full! bg-[#f1f1f1]! text-black! flex items-center justify-center">
                        <FaRegUser className="text-black text-[20px]" />
                      </span>

                      <div className="info flex flex-col cursor-pointer">
                        <h4 className="leading-3 text-[13px] mb-0 capitalize text-left justify-start">{context.user?.name || "User"}</h4>
                        <span className="text-[14px] lowercase">{context.user?.email || "user@example.com"}</span>
                      </div>
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleCloseMenu}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => { handleCloseMenu(); navigate('/account'); }} className="flex gap-3">
                        <FaRegUser className="text-[18px] mr-2" />
                        My Account
                      </MenuItem>
                      <MenuItem onClick={() => { handleCloseMenu(); navigate('/orders'); }} className="flex gap-3">
                        <RiShoppingBag2Fill className="text-[18px] mr-2" />
                        Orders
                      </MenuItem>
                      <MenuItem onClick={() => { handleCloseMenu(); navigate('/my-list'); }} className="flex gap-3">
                        <CiHeart className="text-[18px] mr-2" />
                        My List
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className="flex gap-3">
                        <CiLogout className="text-[18px] mr-2" />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )
              }

              <li className="list-none">
                <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                  <StyledBadge badgeContent={context.cart.length} color="secondary">
                    <MdOutlineShoppingCart className="text-[22px] lg:text-[26px] text-black" />
                  </StyledBadge>
                </IconButton>
              </li>

              <li className="list-none hidden lg:block">
                <IconButton aria-label="compare products">
                  <StyledBadge badgeContent={4} color="secondary">
                    <DiGitCompare className="text-[22px] lg:text-[26px] text-black" />
                  </StyledBadge>
                </IconButton>
              </li>

              <li className="list-none hidden lg:block">
                <IconButton aria-label="wishlist">
                  <StyledBadge badgeContent={4} color="secondary">
                    <FaRegHeart className="text-[22px] lg:text-[26px] text-black" />
                  </StyledBadge>
                </IconButton>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="lg:hidden p-3 bg-white border-b border-black/10">
          <div className="searchBox w-full h-11 bg-[#f0f0f0] rounded-md relative flex items-center px-3">
            <label htmlFor="mobile-search" className="sr-only">Search products</label>
            <input
              id="mobile-search"
              type="text"
              placeholder="Search for products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-full focus:outline-none bg-inherit text-[14px]"
              aria-label="Search products"
            />
            <Button onClick={handleSearch} className="min-w-10! w-10! h-10! rounded-full! text-black!" aria-label="Submit search">
              {searchLoading ? <CircularProgress size={18} /> : <CiSearch className="text-[20px]" />}
            </Button>
          </div>
        </div>
      )}

      <div className="hidden md:block border-b border-black/10">
        <Navigation />
      </div>

      {/* Bottom Nav - Fixed mobile bottom navigation */}
      <div className="mobileNav flex lg:hidden" aria-label="Main navigation" style={{ backgroundColor: 'white', padding: '0.5rem 0.25rem max(0.5rem, env(safe-area-inset-bottom, 0.5rem))', width: '100%', justifyContent: 'space-between', position: 'fixed', bottom: 0, left: 0, zIndex: 51, boxShadow: '0 -1px 3px rgba(0,0,0,0.08)' }}>
        <Link
          to="/"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.25rem', textDecoration: 'none', color: '#000' }}
          aria-label="Home"
        >
          <IoIosHome style={{ fontSize: 22, color: '#000' }} aria-hidden="true" />
          <span style={{ fontSize: 10, marginTop: 2, color: '#000', fontWeight: 500 }}>Home</span>
        </Link>

        <button
          type="button"
          onClick={toggleSearch}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.25rem', border: 'none', background: 'none', cursor: 'pointer' }}
          aria-label="Search"
        >
          <CiSearch style={{ fontSize: 22, color: '#000' }} aria-hidden="true" />
          <span style={{ fontSize: 10, marginTop: 2, color: '#000', fontWeight: 500 }}>Search</span>
        </button>

        <Link
          to="/my-list"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.25rem', textDecoration: 'none', color: '#000' }}
          aria-label="My List"
        >
          <FaRegHeart style={{ fontSize: 22, color: '#000' }} aria-hidden="true" />
          <span style={{ fontSize: 10, marginTop: 2, color: '#000', fontWeight: 500 }}>List</span>
        </Link>

        <Link
          to="/cart"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.25rem', textDecoration: 'none', color: '#000', position: 'relative' }}
          aria-label="Shopping Cart"
        >
          <MdOutlineShoppingCart style={{ fontSize: 22, color: '#000' }} aria-hidden="true" />
          {context.cart.length > 0 && (
            <span style={{ position: 'absolute', top: -2, right: 'calc(50% - 14px)', backgroundColor: '#ff5252', color: 'white', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {context.cart.length > 9 ? '9+' : context.cart.length}
            </span>
          )}
          <span style={{ fontSize: 10, marginTop: 2, color: '#000', fontWeight: 500 }}>Cart</span>
        </Link>

        <Link
          to="/account"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.25rem', textDecoration: 'none', color: '#000' }}
          aria-label="Account"
        >
          <FaRegUser style={{ fontSize: 22, color: '#000' }} aria-hidden="true" />
          <span style={{ fontSize: 10, marginTop: 2, color: '#000', fontWeight: 500 }}>Account</span>
        </Link>
      </div>


    </header >
  );
};

export default Header;
