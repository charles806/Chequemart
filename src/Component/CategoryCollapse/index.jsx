import React, { useState, useEffect } from "react";
import "../../index.css";
import { CiSquarePlus } from "react-icons/ci";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { getCategories } from "../../api";

const CategoryCollapse = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const defaultCategories = [
    "Fashion",
    "Electronics",
    "Bags",
    "Footware",
    "Beauty",
    "Jewelery",
    "Wellness",
    "Games"
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div>
      <>

        <div className="overflow-y-auto">
          <ul className="list-none m-0 p-0">
            {displayCategories.map((cat, index) => {
              const catName = typeof cat === 'string' ? cat : cat.name;
              const catId = typeof cat === 'string' ? '' : cat._id;
              return (
                <li key={index} className="flex items-center relative">
                  <Link to={catId ? `/products?category=${catId}` : "/products"} className="flex-1 no-underline">
                    <Button className="w-full! text-left! justify-start! p-3! text-gray-800! capitalize!">
                      {catName}
                    </Button>
                  </Link>
                  <CiSquarePlus className="absolute right-3 text-lg cursor-pointer" />
                </li>
              );
            })}
          </ul>
        </div>
      </>
    </div>
  );
};

export default CategoryCollapse;
