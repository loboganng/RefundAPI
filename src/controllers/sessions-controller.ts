import { Request, Response } from 'express';
import { prisma } from "@/database/prisma"
import { AppError } from '@/utils/AppError';
import { compare } from 'bcrypt';
import { z } from "zod"

class SessionsController{
  async create(request: Request, response: Response){
    //Validating request body
    const bodySchema = z.object({
      email: z.string().email({ message: "Invalid email address"}),
      password: z.string()  //Won't require min, let DB handle that
    })

    //Retrieve and parse body data
    const { email, password } = bodySchema.parse(request.body)

    //Verify if user exists
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {  
      throw new AppError("E-mail or password incorrect", 401)
    }

    //Verify if password matches
    const passwordMatched = await compare(password, user.password)
    if (!passwordMatched) {
      throw new AppError("E-mail or password incorrect", 401)
    }

    response.status(201).json({ message: "Session created successfully" })
  }
}

export { SessionsController }