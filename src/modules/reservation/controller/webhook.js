import Stripe from "stripe";
import reservationModel from "../../../../DB/models/Reservation.model.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";

const webhook = asyncErrorHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  const event = Stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.ENDPOINT_SECRET
  );

  if (event.type == "checkout.session.completed") {
    await reservationModel.updateOne(
      {
        _id: event.data.object.metadata.reservationId,
      },
      {
        status: "waiting",
      }
    );
    await doctorModel.updateOne(
      { _id: event.data.object.metadata.doctorId },
      {
        $push: { confirmReservation: { _id } },
      }
    );
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
});

export default webhook;
