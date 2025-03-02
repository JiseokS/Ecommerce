import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle product finding
export async function GET(
    req: Request,
    context: { params: { productId: string } } // Pass params as part of context
) {
    try {
        const { productId } = await Promise.resolve(context.params); 

        if (!productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because userId is not unique
        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
            include:{
                images: true,
                category: true,
                size: true,
                color: true
            }
        });
        
        return NextResponse.json(product);

    } catch (error) {
        console.error("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle product update
export async function DELETE(
    req: Request,
    context: { params: { storeId: string, productId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { productId } = await Promise.resolve(context.params); 

        if (!productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: context.params.storeId,
                userId //current userid
            }
        });

        if(!storeByUserId){
            //User is authenticated(logged in) but doesn't have permission to access the requested resource
            return new NextResponse("Unauthorized", {status: 403});
        }

        // Use deleteMany instead of delete because userId is not unique
        const product = await prismadb.product.deleteMany({
            where: {
                id: productId,
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle individual product update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string, productId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId, productId } = await Promise.resolve(context.params);

        const { 
            name,
            price,
            categoryId, 
            colorId, 
            sizeId, 
            images, 
            isFeatured, 
            isArchived} = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if(!images || !images.length){
            return new NextResponse("Images are required", {status: 400});
        }

        if(!price){
            return new NextResponse("Price is required", {status: 400});
        }

        if(!categoryId){
            return new NextResponse("Category id is required", {status: 400});
        }

        if(!sizeId){
            return new NextResponse("Size id is required", {status: 400});
        }

        if(!colorId){
            return new NextResponse("Color id is required", {status: 400});
        }

        if (!productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId // current id
            }
        });

        if(!storeByUserId){
            //User is authenticated(logged in) but doesn't have permission to access the requested resource
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.product.update({
            where: {
                id: productId,
                storeId // Add this to ensure we're updating the correct product
            },
            data: {
                name, 
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where:{
                id: productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url:string})=> image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}