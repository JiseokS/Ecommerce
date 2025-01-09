import prismadb from "@/lib/prismadb"

interface DashboardPageProps{
    params: {storeId: string}
};

//Define function component(FC)
const DashboardPage: React.FC<DashboardPageProps> = async ({
    params: asyncParams
})=>{
    const params = await asyncParams;

    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId
        }
    })
    return (
        <div>
            Active Store: {store?.name};
        </div>
    )
}

export default DashboardPage;