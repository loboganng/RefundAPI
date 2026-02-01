import { AppError } from "@/utils/AppError";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

// Middleware to handle errors globally
export const errorHandling: ErrorRequestHandler = (
  error,
  request,  //Won't use this
  response,
  next  //Want to prevent error to go forward
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return;
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    response.status(400).json({ 
      message: "validation error",
      issues: error.format() 
    })
    return;
  }

  // Fallback for unhandled errors
  response.status(500).json({ message: error.message || "Internal server error" })

  return;
}