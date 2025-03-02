import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handle individual store update
export async function PATCH(
    req: Request,
    context: { params: { storeId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const { storeId } = await Promise.resolve(context.params); 

        if (!storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.error("[STORE_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Handle store deletion
export async function DELETE(
    req: Request,
    context: { params: { storeId: string } } // Pass params as part of context
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { storeId } = await Promise.resolve(context.params); 

        if (!storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Use deleteMany instead of delete because userId is not unique
        const store = await prismadb.store.deleteMany({
            where: {
                id: storeId,
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.error("[STORE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
