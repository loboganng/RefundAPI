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

  async index (request: Request, response: Response){
    //Schema to retrieve a single optional user
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),  //First page by default
      perPage: z.coerce.number().optional().default(10),  //10 items per page by default
    })

    const { name, page, perPage } = querySchema.parse(request.query)

    //Calculating skip values
    const skip = (page -1) * perPage

    //Finding refunds with pagination and optional name filtering
    const refunds = await prisma.refunds.findMany({
      skip, //Property to skip items for pagination
      take: perPage,  //Property to limit number of items per page
      //Object to filter refunds by user name using a contains query
      where: {
        user: {
          name: {
            contains: name.trim(),
          }
        }
      },
      orderBy: { createdAt: "desc"},
      include: { user: true } //Including user data in the response
    })

    //Get total count of refunds for pagination purposes
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          }
        }
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1
      }
    })
  }
} 

export { RefundsController }