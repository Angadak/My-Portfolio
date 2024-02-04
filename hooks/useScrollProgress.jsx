import { updateScrollCompletion } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";

const useScrollProgress = () => {
  const [Completion, setCompletion] = useState(0);
  useEffect(() => {
    const currentProgress = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;

    if (scrollHeight) {
        setCompletion(Number(currentProgress/scrollHeight).toFixed(2)*100);
        
    };
    //event
    window.addEventListener('scroll',updateScrollCompletion);
    //clear event       
    return()=>window.removeEventListener('scroll',updateScrollCompletion);

  },[]);
  return Completion;
};

export default useScrollProgress;
