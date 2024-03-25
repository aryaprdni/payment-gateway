import midtransClient from "midtrans-client";
import "dotenv/config";

export const processTransaction = async (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.gross_amount,
      },
      customer_details: {
        name: req.body.name,
        email: req.body.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    const dataPayment = {
      response: JSON.stringify(transaction),
    };

    const token = transaction.token;

    res.status(200).json({ message: "success", dataPayment, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
