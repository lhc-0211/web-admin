
import { useState, useEffect } from "react";

export default function useResponsive(){
    const [device, setDeveice]= useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    });
    useEffect(()=>{
    const updateDevice =() =>{
        const width = window.innerWidth;
        setDeveice({
            isMobile : width <768,
            isTablet: width >= 768 && width <1280,
            isDesktop: width>=1280,
        });
    };
    updateDevice();
    window.addEventListener("resize",updateDevice);
    return()=> window.removeEventListener("resize", updateDevice);
},[]);
return device
}
