import prismadb from "@/lib/prismadb"

import { ProductForm } from "./components/product-form"

const ProductPage = async ({
    params
}:{
    params: {productId: string, storeId: string}
})=>{
    const resolvedParams = await params;

    const product = await prismadb.product.findUnique({
        where:{
            id: resolvedParams.productId
        },
        include:{
            images: true
        }
    });

    // Convert the Decimal price to a number before passing to the client component
    //const formattedProduct = product ? {
    //    ...product,
    //   price: parseFloat(String(product.price))
    //} : null;

    const categories = await prismadb.category.findMany({
        where:{
            storeId: resolvedParams.storeId,
        }
    });

    const sizes = await prismadb.size.findMany({
        where:{
            storeId: resolvedParams.storeId,
        }
    });

    const colors = await prismadb.color.findMany({
        where:{
            storeId: resolvedParams.storeId,
        }
    });

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                categories={categories}
                colors={colors}
                sizes={sizes}
                initialData={product}/>
            </div>
        </div>
    )
}

export default ProductPage;