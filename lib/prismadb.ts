import { PrismaClient } from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined 
};

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb; // only save prismadb in golbalthis.prisma in develop evn (not in production env)

export default prismadb;