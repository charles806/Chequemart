import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { RiMenu2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { MyContext } from "../../../MyContext";
import CategoryPanel from "./CategoryPanel";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Fashion", to: "/products?category=fashion" },
  { label: "Electronics", to: "/products?category=electronics" },
  { label: "Bags", to: "/products?category=bags" },
  { label: "Footwear", to: "/products?category=footwear" },
  { label: "Jewellery", to: "/products?category=jewellery" },
  { label: "Wellness", to: "/products?category=wellness" },
  { label: "Beauty", to: "/products?category=beauty" },
  { label: "Games", to: "/products?category=games" },
];

const Navigation = () => {
  const context = useContext(MyContext);

  return (
    <>
      <nav className="navigation bg-neutral-50 border-b border-neutral-100">
        <div className="my-container">
          <div className="flex items-center gap-2">
            {/* Categories button */}
            <div className="hidden lg:block lg:w-[20%]">
              <Button
                className="text-neutral-800! gap-2 w-full cursor-pointer px-4! py-2.5! rounded-lg! normal-case! font-medium! text-sm!"
                onClick={() => context.setIsOpenCatPanel(true)}
              >
                <RiMenu2Fill size={18} />
                <span>Shop By Categories</span>
                <FaAngleDown size={10} />
              </Button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <ul className="flex items-center gap-0.5 lg:gap-1">
                {navLinks.map((link) => (
                  <li key={link.label} className="list-none shrink-0">
                    <Link to={link.to}>
                      <Button className="font-medium! text-neutral-500! hover:text-neutral-900! hover:bg-neutral-100! py-2.5! px-3! lg:px-4! normal-case! text-xs! lg:text-sm! rounded-lg! whitespace-nowrap! transition-colors!">
                        {link.label}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <CategoryPanel
        setIsOpenCatPanel={context.setIsOpenCatPanel}
        isOpenCatPanel={context.isOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
