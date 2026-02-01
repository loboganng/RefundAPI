import { Request, Response } from "express"
import { UserRole } from "@prisma/client"
import { z } from "zod"

class UsersController {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Name is required"}),
      email: z.string().trim().email({ message: "E-mail is invalid"}).toLowerCase(),
      password: z.string().min(6, { message: "Password must be at least 6 characters long"}),
      role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee)
    })

    // const { name, email, password, role } = bodySchema.parse(request.body)
    const result = bodySchema.safeParse(request.body)

    if (!result.success) {
      return response.status(400).json({ errors: result.error.flatten() })
    }

    const { name, email, password, role } = result.data

    response.json({ name, email, password, role })
  }
}

export { UsersController }