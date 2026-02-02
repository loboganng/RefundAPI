import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

//Params will be an array of roles that are authorized to access the route
function verifyUserAuthorization(role: string[]){
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if user is authenticated and has one of the required roles
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("User not authorized", 401)
    }
    return next();
  }

}

export { verifyUserAuthorization}