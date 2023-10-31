import { dbConnection } from "../DB/dbConnection.js";
import ErrorClass from "./utils/errorClass.js";
import { errorHandel } from "./utils/errorHandling.js";
import { allMessages } from "./utils/localizationHelper.js";
import patientRouter from "./modules/patient/patient.router.js";
const initApp = (app, express) => {
  //convert Buffer Data
  app.use(express.json({}));

  //*Setup API Routing
  app.use("/patient", patientRouter);
  app.all("*", (req, res, next) => {
    return next(new ErrorClass(allMessages.en.IN_VALID_URL));
  });

  app.use(errorHandel);

  dbConnection();
};

export default initApp;
