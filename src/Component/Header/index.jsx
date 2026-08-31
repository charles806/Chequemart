import React, { useContext, useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo1.png";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CiLogout, CiMenuBurger, CiSearch } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { RiShoppingBag2Fill } from "react-icons/ri";
import Navigation from "./Navigation";
import { MyContext } from "../../MyContext";

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
  const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const openCategoryPanel = () => context.setIsOpenCatPanel(true);

  const handleLogout = () => {
    handleCloseMenu();
    if (context.logout) context.logout();
    navigate("/");
  };

  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      navigate(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, navigate]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchInput.trim()) {
        setSearchLoading(true);
        navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
        setTimeout(() => setSearchLoading(false), 300);
      }
    }
  };



  return (
    <header className="bg-white fixed lg:sticky left-0 w-full top-0 lg:-top-11.75 z-[101] shadow-xs">
      {/* Top strip — desktop only */}
      <div className="top-strip hidden lg:block py-2 border-b border-neutral-100">
        <div className="my-container">
          <div className="flex items-center justify-between px-4">
            <p className="text-xs font-medium text-neutral-500 mt-0 mb-0">
              Trusted by 100+ customers across Nigeria
            </p>
            <div className="flex items-center gap-6">
              <Link to="/help-center" className="text-xs font-medium text-neutral-500 hover:text-primary-500 transition-colors">
                Help Center
              </Link>
              <Link
                to={context.user?.role === "seller" && context.user?.sellerInfo?.onboardingComplete ? "/seller/dashboard" : "/account?openBecomeSeller=true"}
                className="text-xs font-medium text-neutral-500 hover:text-primary-500 transition-colors"
              >
                {context.user?.role === "seller" && context.user?.sellerInfo?.onboardingComplete ? "Seller Dashboard" : "Sell on Chequemart"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="header py-2 lg:py-3 border-b border-neutral-100">
        <div className="my-container h-14 lg:h-[60px] flex items-center justify-between gap-3 lg:gap-0">
          {/* Hamburger — mobile */}
          <Button
            className="w-10! min-w-10! h-10! rounded-lg! lg:hidden! shrink-0! bg-neutral-100!"
            onClick={openCategoryPanel}
            aria-label="Open menu"
          >
            <CiMenuBurger className="w-5 h-5 text-neutral-700" />
          </Button>

          {/* Logo */}
          <div className="w-[40%] lg:w-[22%] shrink-0">
            <Link to="/">
              <img src={logo} alt="ChequeMart Logo" className="max-w-32 lg:max-w-44 h-auto" />
            </Link>
          </div>

          {/* Search — desktop */}
          <div className="hidden lg:block lg:w-[32%] lg:shrink-0">
            <div className="searchBox w-full h-11 bg-neutral-100 rounded-lg relative p-2">
              <label htmlFor="header-search" className="sr-only">Search products</label>
              <input
                id="header-search"
                type="text"
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full h-7 focus:outline-none bg-transparent p-2 text-sm text-neutral-800 placeholder-neutral-400"
                aria-label="Search products"
              />
              <Button onClick={handleSearch} className="absolute! top-2 right-1! z-50 w-7! min-w-7! h-7! rounded-full! text-neutral-600!" aria-label="Search">
                {searchLoading ? <CircularProgress size={16} /> : <CiSearch className="text-[20px]" />}
              </Button>
            </div>
          </div>

          {/* Right side — icons + account */}
          <div className="flex items-center shrink-0">
            <ul className="flex items-center justify-end gap-2 lg:gap-3">
              {!context.isLogin ? (
                <li className="list-none whitespace-nowrap hidden lg:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors px-3 py-1.5">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors px-4 py-1.5 rounded-lg">
                    Register
                  </Link>
                </li>
              ) : (
                <>
                  <Button className="myAccountWrap hidden! lg:flex! items-center gap-2.5 text-neutral-800! h-12!" onClick={handleClickMenu}>
                    <span className="w-9! h-9! min-w-9! rounded-full! bg-neutral-100! flex items-center justify-center">
                      <FaRegUser className="text-neutral-500 text-[16px]" />
                    </span>
                    <div className="info flex flex-col cursor-pointer text-left">
                      <h4 className="text-[13px] font-medium mb-0 capitalize">{context.user?.name || "User"}</h4>
                      <span className="text-xs text-neutral-400 lowercase">{context.user?.email || ""}</span>
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
                          overflow: "visible",
                          filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.1))",
                          mt: 1.5,
                          borderRadius: "12px",
                          border: "1px solid #e5e5e5",
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => { handleCloseMenu(); navigate("/account"); }} className="gap-3 text-sm">
                      <FaRegUser className="text-[16px] text-neutral-400" />
                      My Account
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); navigate("/orders"); }} className="gap-3 text-sm">
                      <RiShoppingBag2Fill className="text-[16px] text-neutral-400" />
                      Orders
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); navigate("/my-list"); }} className="gap-3 text-sm">
                      <CiHeart className="text-[16px] text-neutral-400" />
                      My List
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className="gap-3 text-sm text-error!">
                      <CiLogout className="text-[16px]" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* Cart */}
              <li className="list-none">
                <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)} className="text-neutral-700! hover:text-primary-500!">
                  <StyledBadge badgeContent={context.cart.length} color="secondary">
                    <MdOutlineShoppingCart className="text-[22px] lg:text-[24px]" />
                  </StyledBadge>
                </IconButton>
              </li>

              {/* Compare — desktop */}
              {/* <li className="list-none hidden lg:block">
                <Link to="/compare">
                  <IconButton aria-label="compare products" className="text-neutral-700! hover:text-primary-500!">
                    <DiGitCompare className="text-[22px] lg:text-[24px]" />
                  </IconButton>
                </Link>
              </li> */}

              {/* Wishlist — desktop */}
              <li className="list-none hidden lg:block">
                <Link to="/my-list">
                  <IconButton aria-label="wishlist" className="text-neutral-700! hover:text-primary-500!">
                    <FaRegHeart className="text-[22px] lg:text-[24px]" />
                  </IconButton>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category navigation — desktop */}
      <div className="hidden md:block border-b border-neutral-100">
        <Navigation />
      </div>

    </header>
  );
};

export default Header;
