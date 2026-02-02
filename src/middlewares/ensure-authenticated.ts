import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";



interface TokenPayload {
  role: string
  sub: string
}

//Function to ensure the user is authenticated
function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    //Get the token from the Authorization header
    const authHeader = request.headers.authorization;

    //Check if the Authorization header is present
    if (!authHeader) {
      throw new AppError("JWT token not found", 401)
    }

    //Split the header to get the token
    //"Bearer" and token
    const [, token] = authHeader.split(" ")

    //Verify the token
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

    //To be able to use request.user we need to create a type declaration file
    //Add user information to the request object
    request.user = {
      id: user_id,
      role
    }

    return next()

  } catch (error) {
    throw new AppError("Invalid JWT token", 401)
  }
}

export { ensureAuthenticated}