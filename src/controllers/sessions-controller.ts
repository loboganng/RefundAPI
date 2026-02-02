import { Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import { authConfig } from '@/configs/auth';
import { prisma } from "@/database/prisma"
import { sign } from 'jsonwebtoken';
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

    //From authConfig, retrieve secret and expiresIn
    const { secret, expiresIn } = authConfig.jwt

    //Generate JWT token
    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn
    })

    //Return token and user data (without password)
    const { password: _, ...userWithoutPassword } = user

    response.status(201).json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }