import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle billboard finding
export async function GET(
    req: Request,
    context: { params: { billboardId: string } } // Pass params as part of context
) {
    try {
        const { billboardId } = await Promise.resolve(context.params); 

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because userId is not unique
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.error("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle billboard update
export async function DELETE(
    req: Request,
    context: { params: { storeId: string, billboardId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { billboardId } = await Promise.resolve(context.params); 

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.error("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Handle individual billboard update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string, billboardId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId, billboardId } = await Promise.resolve(context.params);

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId,
                storeId // Add this to ensure we're updating the correct billboard
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.error("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}