/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { CategoryTwoTone } from "@mui/icons-material";
import { ArrowBackRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";  

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await fetch(`https://kickpik-backend.vercel.app/api/products/categories`)
          .then((response) => response.json())
          .then((response) => {
            setCategories(response);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className={`bg-primary max-h-full pr-7 pl-3 pt-8 relative rounded-tr-full rounded-br-full sidebar ${
        open ? "w-40 max-sm:w-28" : "w-14"
      } duration-1000 flex-col`}
    >
      <ArrowBackRounded
        className={`bg-amber text-primary w-9 h-9 rounded-full  absolute -right-3 top-40 cursor-pointer ${
          !open && "rotate-180"
        } duration-1000`}
        onClick={() => setOpen(!open)}
      />
      <div className="inline-flex mt-16 max-sm:pr-2">
        <CategoryTwoTone
          className={`text-amber text-2xl max-sm:text-lg mr-2 float-left block -left-3`}
        />
        <h1
          className={`text-white text-lg max-sm:text-sm mr-5 font-primary  ${
            !open && "scale-0"
          } duration-1000 origin-left font-normal`}
        >
          Categories
        </h1>
      </div>
      <div className={`ml-10 mt-5 flex-wrap ${
            !open && "scale-0"
          } duration-1000 origin-left font-normal`}
       >
        <ul>
          {categories.map((item) => (
            <Link to={`/search?category=${item}`}>
              <li key={item.length}>
                <div className="text-white text-lg max-sm:text-sm">{item}</div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
