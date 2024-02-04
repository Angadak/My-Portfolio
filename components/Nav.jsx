import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { path: "/", name: "home" },
  { path: "/Projects", name: "my projects" },
  { path: "/Contact", name: "contact" },
  // { path: "/About", name: "about" },
];

const Nav = ({ containerStyles, linkStyles, underlineStyles }) => {
  const path = usePathname();
  return (
    <nav className={`${containerStyles}`}>
      {links.map((link, index) => (
        <Link
          href={link.path}
          key={index}
          className={`capitalize ${linkStyles}`}
        >
          {link.path === path && (
            <motion.span
              intial={{ y: "-100%" }}
              animate={{ y: 0 }}
              transition={{ type: "tween" }}
              layoutId="underline"
              className={`${underlineStyles}`}
            />
          )}
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
