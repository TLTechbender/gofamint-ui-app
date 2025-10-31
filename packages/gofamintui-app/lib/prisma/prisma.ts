import { PrismaClient } from "@prisma/client";

//we dont ant multiple instances of the same queryclient
declare global {
  // allow global `prisma` in dev
  // this merges into NodeJS global type
  // so TS knows prisma exists on globalThis
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

export const prisma = prismaClient;
