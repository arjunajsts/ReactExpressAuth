import { getSessionsHandler,deleteSessionHandler } from "@/controllers/session.controller.js";
import { Router } from "express";


const sessionRoutes = Router()

sessionRoutes.get("/", getSessionsHandler)
sessionRoutes.delete("/:id", deleteSessionHandler)


export default sessionRoutes