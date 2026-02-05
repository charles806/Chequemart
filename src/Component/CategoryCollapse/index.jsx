import React from "react";
import "../../index.css";
import { CiSquarePlus } from "react-icons/ci";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const CategoryCollapse = () => {
  return (
    <div>
      <>

        <div className="overflow-y-auto">
          <ul className="list-none m-0 p-0">
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Fashion</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Electronics</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Bags</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Footware</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Beauty</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Jewelery</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Wellness</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
            <li className="flex items-center relative">
              <Link to="/products" className="flex-1 no-underline">
                <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">Games</Button>
              </Link>
              <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default CategoryCollapse;
