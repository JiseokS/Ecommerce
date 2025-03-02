import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle color finding
export async function GET(
    req: Request,
    context: { params: { colorId: string } } // Pass params as part of context
) {
    try {
        const { colorId } = await Promise.resolve(context.params); 

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because colorId is not unique
        const color = await prismadb.color.findUnique({
            where: {
                id: colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error("[COLOR_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle color update
export async function DELETE(
    req: Request,
    context: { params: { storeId: string, colorId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { colorId } = await Promise.resolve(context.params); 

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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

        // Use deleteMany instead of delete because colorId is not unique
        const color = await prismadb.color.deleteMany({
            where: {
                id: colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error("[COLOR_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle individual color update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string, colorId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId, colorId } = await Promise.resolve(context.params);

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

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: colorId,
                storeId // Add this to ensure we're updating the correct color
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error("[COLOR_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}