import React, { useContext } from "react";
import { Link } from "react-router-dom";
//Ui Material
import { Button } from "@mui/material";
//Icons
import { RiMenu2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { MyContext } from "../../../MyContext";
//Components
import CategoryPanel from "./CategoryPanel";

const Navigation = () => {
  const context = useContext(MyContext);

  const openCategoryPanel = () => {
    context.setIsOpenCatPanel(true);
  };

  return (
    <>
      <nav className="navigation bg-[#f0f0f0] border-b border-gray-200">
        <div className="my-container">
          <div className="flex items-center gap-4">
            <div className="col_1 hidden lg:block lg:w-[20%]">
              <Button
                className="text-black! gap-2 w-full cursor-pointer px-4! py-3! rounded-md! normal-case! font-medium! text-[14px]!"
                onClick={openCategoryPanel}
              >
                <RiMenu2Fill size={20} />
                <span>Shop By Categories</span>
                <FaAngleDown size={12} />
              </Button>
            </div>

            <div className="col_2 flex-1 overflow-x-auto scrollbar-hide">
              <ul className="flex items-center gap-1 lg:gap-2 nav">
                <li className="list-none shrink-0">
                  <Link to="/">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Home
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Fashion
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Electronics
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Bags
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Footwear
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Jewellery
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Wellness
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Beauty
                    </Button>
                  </Link>
                </li>

                <li className="list-none shrink-0">
                  <Link to="/products">
                    <Button className="link transition font-medium! text-[rgba(0,0,0,0.8)]! hover:text-black! hover:bg-gray-100! py-3! px-3! lg:px-4! normal-case! text-[13px]! lg:text-[14px]! rounded-md! whitespace-nowrap!">
                      Games
                    </Button>
                  </Link>
                </li>
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
