import { Router } from "express";

import { RefundsController } from "@/controllers/refunds-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post(
  "/", 
  verifyUserAuthorization(["employee"]),  //Middleware to verify if user has employee role
  refundsController.create
)

refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]), //Middleware to verify if user has manager role
  refundsController.index
)

refundsRoutes.get(
  "/:id", 
  verifyUserAuthorization(["employee", "manager"]), 
  refundsController.show
)

export { refundsRoutes }