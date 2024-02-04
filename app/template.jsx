"use client";
import React from "react";
import { motion } from "framer-motion";
//hooks
import useScrollProgress from "@/hooks/useScrollProgress";
//varients
const varients = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};
const template = ({ children }) => {
  const Completion = useScrollProgress();
  return (
    <>
      <motion.main
        variants={varients}
        initial="hidden"
        animate="enter"
        transition={{ type: "linear", delay: 0.2, duration: 0.4 }}
      >
        {children}
      </motion.main>
      {/* Completion bar */}
      <span style={{ transform:'translateY(${completion-100}%)' }} className="fixed z-50 bg-primary w-1 top-0 right-0 bottom-0 transition-all duration-700">
        <div className="h-[400px]"></div>
      </span>
    </>
  );
};

export default template;
