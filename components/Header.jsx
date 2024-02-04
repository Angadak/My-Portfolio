"use client";

import React, { useState, useEffect } from "react";
//components
import Logo from "./Logo";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import ThemeToggler from "./ThemeToggler";
import { usePathname } from "next/navigation";

const Header = () => {
  const [header, setHeader] = useState(false);
  const Pathname = usePathname();
  console.log(Pathname);

  useEffect(() => {
    const scrollYPos = window.addEventListener("scroll", () => {
      window.scrollY < 50 ? setHeader(true) : setHeader(false);
    });
    //remove event
    return () => window.removeEventListener("scroll", scrollYPos);
  });
  return (
    <header
      className={`p-20 ${
        header
          ? "py-2 bg-white shadow-lg dark:bg-accent"
          : "py-2 bg-white shadow-lg dark:bg-accent"
      } sticky top-0 z-30 transition-all`}
    >
      <div className="contanier mx-auto ">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-x-6">
            {/* navbar */}
            <Nav
              containerStyles="hidden xl:flex gap-x-8 items-center"
              linkStyles="relative hover:text-primary transition-all"
              underlineStyles=" absolute left-0 top-full h-[2px] bg-primary w-full"
            />
            <ThemeToggler />
            {/* mobile nav  */}
            <div className="xl:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
