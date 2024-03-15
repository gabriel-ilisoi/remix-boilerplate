import { enhance } from '@zenstackhq/runtime'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

export function getEnhancedPrisma(userId: string) {
  return enhance(prisma, { user: { id: userId } })
}

