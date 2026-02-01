import { Router } from "express";

import { usersRoutes } from "./users-routes";

const routes = Router()

//Public routes
routes.use("/users", usersRoutes)

export { routes}