import { useState, useEffect } from "react"

export const useOrigin=()=>{
    const [mounted, setMounted] = useState(false);
    //checking window location exist
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(()=>{
        setMounted(true);
    },[]);

    if(!mounted){
        return '';
    };

    return origin;
}