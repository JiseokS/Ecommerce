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

    return(
        <div className="p-4">
            Root Page
        </div>
    )
}

export default SetupPage;