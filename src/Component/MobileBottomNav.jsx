import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from "../MyContext";

const MobileBottomNav = () => {
  const context = useContext(MyContext);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobileNav fixed bottom-0 left-0 right-0 z-50 flex lg:hidden bg-white" aria-label="Main navigation">
      <Link to="/" className={`mobileNav__link ${isActive("/") ? "mobileNav--active" : ""}`} aria-label="Home">
        <span className="mobileNav__btn">
          <IoIosHome className="mobileNav__icon" aria-hidden="true" />
          <span className="mobileNav__label">Home</span>
        </span>
      </Link>

      <Link to="/products" className={`mobileNav__link ${isActive("/products") ? "mobileNav--active" : ""}`} aria-label="Search">
        <span className="mobileNav__btn">
          <CiSearch className="mobileNav__icon" aria-hidden="true" />
          <span className="mobileNav__label">Search</span>
        </span>
      </Link>

      <Link to="/my-list" className={`mobileNav__link ${isActive("/my-list") ? "mobileNav--active" : ""}`} aria-label="My List">
        <span className="mobileNav__btn">
          <FaRegHeart className="mobileNav__icon" aria-hidden="true" />
          <span className="mobileNav__label">List</span>
        </span>
      </Link>

      <Link to="/cart" className={`mobileNav__link ${isActive("/cart") ? "mobileNav--active" : ""}`} aria-label="Shopping Cart">
        <span className="mobileNav__btn relative">
          <MdOutlineShoppingCart className="mobileNav__icon" aria-hidden="true" />
          {context.cart.length > 0 && (
            <span className="mobileNav__badge">
              {context.cart.length > 9 ? "9+" : context.cart.length}
            </span>
          )}
          <span className="mobileNav__label">Cart</span>
        </span>
      </Link>

      <Link to="/account" className={`mobileNav__link ${isActive("/account") ? "mobileNav--active" : ""}`} aria-label="Account">
        <span className="mobileNav__btn">
          <FaRegUser className="mobileNav__icon" aria-hidden="true" />
          <span className="mobileNav__label">Account</span>
        </span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
