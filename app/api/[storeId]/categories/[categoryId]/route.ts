import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle billboard finding
export async function GET(
    req: Request,
    context: { params: { categoryId: string } } // Pass params as part of context
) {
    try {
        const { categoryId } = await Promise.resolve(context.params); 

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because userId is not unique
        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId,
            },
            include:{
                billboard: true,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.error("[CATEGORY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle billboard update
export async function DELETE(
    req: Request,
    context: { params: { storeId: string, categoryId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { categoryId } = await Promise.resolve(context.params); 

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
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
        const category = await prismadb.category.deleteMany({
            where: {
                id: categoryId,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle individual billboard update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string, categoryId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId, categoryId } = await Promise.resolve(context.params);

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: categoryId,
                storeId // Add this to ensure we're updating the correct billboard
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.error("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}