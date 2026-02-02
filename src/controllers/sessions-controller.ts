import { Request, Response } from 'express';

class SessionsController{
  async create(request: Request, response: Response){
    response.status(201).json({ message: "Session created successfully" })
  }
}

export { SessionsController }