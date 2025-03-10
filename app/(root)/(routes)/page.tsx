"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
    const isOpen = useStoreModal((state)=>state.isOpen);
    const onOpen = useStoreModal((state)=>state.onOpen);
    
    //if user's first visit, cant close create store modal
    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen])

    return null;
}

export default SetupPage;