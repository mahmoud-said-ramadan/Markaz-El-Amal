import { dbConnection } from "../DB/dbConnection.js";
import ErrorClass from "./utils/errorClass.js";
import { errorHandel } from "./utils/errorHandling.js";
import { allMessages } from "./utils/localizationHelper.js";
import patientRouter from "./modules/patient/patient.router.js";
import commonRouter from "./modules/common/common.router.js";
import authRouter from "./modules/auth/auth.router.js";
import doctorRouter from "./modules/doctor/doctor.router.js";
import categoryRouter from "./modules/category/category.router.js";
import reviewRouter from "./modules/review/review.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";
import chatRouter from "./modules/chat/chat.router.js";

const initApp = (app, express) => {
  //convert Buffer Data
  app.use(express.json({}));

  //*Setup API Routing
  app.use("/patient", patientRouter);
  app.use("/Doctor", doctorRouter);
  app.use(["/patient", "/doctor"], commonRouter);
  app.use("/auth", authRouter);
  app.use("/patient", patientRouter);
  app.use("/category", categoryRouter);
  app.use("/review", reviewRouter);
  app.use("/reservation", reservationRouter);
  app.use("/chat", chatRouter);
  app.all("*", (req, res, next) => {
    return next(new ErrorClass(allMessages.en.IN_VALID_URL + '0000000000', ));
  });

  app.use(errorHandel);

  dbConnection();
};

export default initApp;
