import React, { useContext, useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
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
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full h-8.75 focus:outline-none bg-inherit p-2 text-[15px]"
              />

              <Button onClick={handleSearch} className="absolute! top-2 right-1.25 z-50 w-9.25! min-w-9.25! h-9.25 rounded-full! text-black!">
                <CiSearch className="text-[#000000] text-[22px] font-bold" />
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
                <IconButton aria-label="cart">
                  <StyledBadge badgeContent={4} color="secondary">
                    <DiGitCompare className="text-[22px] lg:text-[26px] text-black" />
                  </StyledBadge>
                </IconButton>
              </li>

              <li className="list-none hidden lg:block">
                <IconButton aria-label="cart">
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
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-full focus:outline-none bg-inherit text-[14px]"
            />
            <Button onClick={handleSearch} className="min-w-10! w-10! h-10! rounded-full! text-black!">
              <CiSearch className="text-[20px]" />
            </Button>
          </div>
        </div>
      )}

      <div className="hidden lg:block border-b border-black/10">
        <Navigation />
      </div>

      {/* Bottom Nav */}

      <div className="mobileNav lg:hidden bg-white p-1 px-3 w-full flex items-center justify-between fixed bottom-0 left-0 gap-0 z-51">
        <Link to="/">
          <Button className="flex flex-col w-15! min-w-15! capitalize! text-black!">
            <IoIosHome className="text-black! text-[22px] font-bold" />
            <span className="text-[14px] font-medium text-black!">Home</span>
          </Button>
        </Link>

        <Button
          className="flex-col w-15! min-w-15! capitalize! text-black!"
          onClick={toggleSearch}
        >
          <CiSearch className="text-black! text-[22px] font-bold" />
          <span className="text-[14px] font-medium text-black!">Search</span>
        </Button>

        <Link to="/my-list">
          <Button className="flex flex-col w-15! min-w-15! capitalize! text-black!">
            <FaRegHeart className="text-black text-[22px] font-bold" />
            <span className="text-[12px]">My List</span>
          </Button>
        </Link>

        <Link to="/cart">
          <Button className="flex flex-col w-15! min-w-15! capitalize! text-black!">
            <MdOutlineShoppingCart className="text-black text-[22px] font-bold" />
            <span className="text-[14px] font-medium text-black">Cart</span>
          </Button>
        </Link>

        <Link to="/account">
          <Button className="flex flex-col w-15! min-w-15! capitalize! text-black!">
            <FaRegUser className="text-black text-[22px] font-bold" />
            <span className="text-[12px]">Account</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
