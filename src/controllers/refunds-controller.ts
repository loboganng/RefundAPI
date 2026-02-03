import { AppError } from '@/utils/AppError';
import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from "zod"

//Defining list os possible categories using zod enum
const CategoriesEnum = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accommodation"
])

class RefundsController{
  async create (request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "Name is a required field" }),
      category: CategoriesEnum,
      amount: z.number().positive({ message: "Amount must be a positive number" }),
      filename: z.string().min(20, { message: "Filename is required and must be at least 20 characters long" })
    })

    const { name, category, amount, filename } = bodySchema.parse(request.body)

    if (!request.user?.id) {
      throw new AppError("User not authorized", 401)
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user?.id
      }
    })

    response.status(201).json(refund)
  }
} 

export { RefundsController }