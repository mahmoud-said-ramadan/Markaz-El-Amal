import Router from "express";
import addDate from "./controller/addDates.js";
import { auth } from "../../middleware/auth.js";
import doctorEndpoint from "./doctor.endpoint.js";
import removeDate from "./controller/removeDates.js";
const router = Router();

export default router;
