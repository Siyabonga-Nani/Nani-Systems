const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

const PORT = 5000;

// 🔐 CONFIG (replace with real keys later)
const PAYFAST_MERCHANT_ID = "10000100";
const PAYFAST_MERCHANT_KEY = "46f0cd694581a";
const PAYFAST_PASSPHRASE = "yourpassphrase";

const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID";

const COINBASE_API_KEY = "YOUR_COINBASE_API_KEY";

// TEMP DATABASE (replace later)
let orders = [];

app.post("/api/payfast", (req, res) => {

  const { product, price, name, email } = req.body;

  const paymentData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
    notify_url: "http://localhost:5000/api/payfast/notify",

    name_first: name,
    email_address: email,

    m_payment_id: Date.now(),
    amount: price,
    item_name: product
  };

  const query = new URLSearchParams(paymentData).toString();

  const paymentUrl = `https://sandbox.payfast.co.za/eng/process?${query}`;

  res.json({ url: paymentUrl });
});

app.post("/api/payfast/notify", (req, res) => {

  console.log("PayFast Notification:", req.body);

  // TODO: Verify signature (important in production)

  orders.push({
    ...req.body,
    status: "paid"
  });

  res.sendStatus(200);
});

const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID,
  "YOUR_PAYPAL_SECRET"
);

const client = new paypal.core.PayPalHttpClient(environment);

app.post("/api/paypal", async (req, res) => {

  const { product, price } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: (price / 18).toFixed(2) // convert ZAR → USD
      },
      description: product
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("PayPal error");
  }
});

const { Client, resources } = require("coinbase-commerce-node");
Client.init(COINBASE_API_KEY);

const Charge = resources.Charge;

app.post("/api/btc", async (req, res) => {

  const { product, price } = req.body;

  try {
    const charge = await Charge.create({
      name: product,
      description: "Digital Product Purchase",
      pricing_type: "fixed_price",
      local_price: {
        amount: price,
        currency: "ZAR"
      }
    });

    res.json({ url: charge.hosted_url });

  } catch (err) {
    console.error(err);
    res.status(500).send("BTC error");
  }
});
app.post("/api/inquiry", (req, res) => {

  console.log("New Inquiry:", req.body);

  // Save to DB later (MongoDB recommended)

  res.json({ message: "Inquiry received" });
});
