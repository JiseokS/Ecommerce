import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params: asyncParams
}:{
    children: React.ReactNode;
    params: {storeId: string}
}){
    const params = await asyncParams;
    
    const {userId} = await auth();

    // if userId doesnt exist redirect to sign-in
    if (!userId){
        redirect('/sign-in');
    }

    //fetch store 
    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId,
            userId: userId
        }
    });

    // if store(user input) doesnt exist
    if (!store){
        redirect('/');
    }

    return(
        <>
            <div>This will be a navbar</div>
            {children}
        </>
    )
}