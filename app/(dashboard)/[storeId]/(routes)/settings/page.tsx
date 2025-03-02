'use server';

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

import prismadb from "@/lib/prismadb";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

const SettingPage: React.FC<SettingsPageProps> = async ({
    params
})=>{
    const {userId} = await auth();

    if(!userId){
        redirect("/sign-in");
    }

    const resolvedParams = await params;
    
    if (!resolvedParams.storeId || typeof resolvedParams.storeId !== 'string') {
        redirect("/");
    }

    const store = await prismadb.store.findFirst({
        where:{
            id: resolvedParams.storeId,
            userId
        }
    });

    //user experience protection
    if(!store){
        redirect("/");
    }

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    )
}

export default SettingPage;