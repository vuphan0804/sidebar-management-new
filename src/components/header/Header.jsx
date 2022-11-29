import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [headerFixed, setHeaderFixed] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const fixedClass = window.scrollY >= 100 ? "!h-16" : "";
    setHeaderFixed(fixedClass);
  };
  return (
    <div
      className={`h-20 w-full z-10 text-white bg-slate-500 flex items-center justify-around fixed transition-primary ${headerFixed}`}
    >
      <div className="text-3xl font-normal">VP</div>
      <div className="flex ">
        <div className="px-5">
          <Link to="/">Home</Link>
        </div>
        <div className="px-5">
          {" "}
          <Link to="/">About</Link>
        </div>
        <div className="px-5">
          {" "}
          <Link to="/">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
