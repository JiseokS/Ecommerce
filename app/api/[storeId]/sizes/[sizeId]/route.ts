import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle size finding
export async function GET(
    req: Request,
    context: { params: { sizeId: string } } // Pass params as part of context
) {
    try {
        const { sizeId } = await Promise.resolve(context.params); 

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because userId is not unique
        const size = await prismadb.size.findUnique({
            where: {
                id: sizeId,
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.error("[SIZE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle size update
export async function DELETE(
    req: Request,
    context: { params: { storeId: string, sizeId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { sizeId } = await Promise.resolve(context.params); 

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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
        const size = await prismadb.size.deleteMany({
            where: {
                id: sizeId,
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.error("[SIZE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle individual size update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string, sizeId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId, sizeId } = await Promise.resolve(context.params);

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        const size = await prismadb.size.updateMany({
            where: {
                id: sizeId,
                storeId // Add this to ensure we're updating the correct size
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.error("[SIZE_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}