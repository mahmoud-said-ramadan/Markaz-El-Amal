import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * Needed data =>  "appointment": [{ from , to , time, categoryId , duration}] (body)
 * Logic => Doctor add time of appointments and his category => if time <= ? ❎ : ✔️ Create reservations of doctor
 * Returned data => Message
 * Who authorized => doctor
 */
const addDate = asyncErrorHandler(async (req, res, next) => {
  //Should time not be the same day or less than
  for (let i = 0; i < req.body.appointment.length; i++) {
    const time = new Date(req.body.appointment[i].time);
    if (
      time.toISOString().slice(0, 10) <= new Date().toISOString().slice(0, 10)
    ) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].RESERVATION_TIMES_ERROR,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  }
  //Function get price of seasion
  function price(categoryId) {
    const category = req.user.categories.find((category) => {
      category.id.equals(categoryId);
      return category;
    });
    return category.consultationFee;
  }
  // const duration = req.user.duration; // 30
  for (let i = 0; i < req.body.appointment.length; i++) {
    //check if this appointment made before
    if (
      req.user.appointment.find(
        (x) =>
          x.time.toString() ==
            new Date(req.body.appointment[i].time).toString() &&
          x.from.toString() == req.body.appointment[i].from
      )
    ) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].DUPLICATE_APPOINTMENT,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    req.user.appointment.push({
      from: req.body.appointment[i].from,
      to: req.body.appointment[i].to,
      time: req.body.appointment[i].time,
      categoryId: req.body.appointment[i].categoryId,
      duration: req.body.appointment[i].duration,
    });
    //Create reservations
    const appointmentEnd = req.body.appointment[i].to; //12
    const appointmentStart = req.body.appointment[i].from; //14
      //From != to
    if (appointmentStart == appointmentEnd) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].RESERVATION_BAD_REQ,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const minutesSessions = (appointmentEnd - appointmentStart) * 60; // (14-12)*60 = 120 m
    const duration = req.body.appointment[i].duration; // 30
    const numberOfSeasions = minutesSessions / duration; // 120 / 30 = 4
    if (numberOfSeasions < 1) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].RESERVATION_BAD_REQ,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const iterator = duration / 60; // 30 / 60 = 0.5
    let counter = appointmentStart; // from
    for (let z = 1; z <= numberOfSeasions; z++) {
      const to = Number(counter) + Number(iterator); // 12 + 0.5 = 12.5
      const reservation = new reservationModel({
        consultationFees: price(req.body.appointment[i].id),
        appointmentSeasion: {
          from: counter,
          to: to,
          duration,
        },
        categoryId: req.body.appointment[i].categoryId,
        doctorId: req.user._id,
        time: req.body.appointment[i].time,
      });
      counter = to;
      await reservation.save();
    }
  }
  await req.user.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, Doctor: req.user });
});

export default addDate;
