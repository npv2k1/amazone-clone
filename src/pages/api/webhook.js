import { buffer } from "micro";
// import * as admin from "firebase-admin";
import admin from "firebase-admin";
// Secure a connection to firebase from backend
const serviceAccount = require("../../../permissions.json");

// console.log("serviceAccount :>> ", serviceAccount);

const app = admin.apps.length===0
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  console.log('fulfilling order :>> ', session);

  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Success :>> ", session.id);
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;
    console.log('POST WH :>> ', "POST WH");
    // veryfy EVENT
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      console.log('event.type :>> ', event.type);
    } catch (err) {
      console.log("ERROR :>> ", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // fulfill the order ...
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => {
          res.status(400).send(`Webhook ERROR ${err.message}`);
        });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
