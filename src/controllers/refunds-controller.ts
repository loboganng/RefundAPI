import { Request, Response } from 'express';
import { z } from "zod"

//Defining list os possible categories using zod enum
const CategoriesEnum = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accomodation"
])

class RefundsController{
  async create (request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "Name is a required field" }),
      category: CategoriesEnum,
      amount: z.number().positive({ message: "Amount must be a positive number" }),
      filename: z.string().min(20, { message: "Filename is required" })
    })

    const { name, category, amount, filename } = bodySchema.parse(request.body)

    response.json({ message: "Refund created successfully!"})
  }
} 

export { RefundsController }