// import orderModel from "../models/orderModel.js";

// const verifyPayment = async (req, res) => {
//   try {
//     const { orderId,success } = req.body;
//     console.log(req.body, "verifyPayment"); 
//     const order = await orderModel.findById(orderId);

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found!" });
//     }

//     order.status = success; // Mark order as paid
//     await order.save();

//     res.json({ success: true, message: "Payment verified successfully!" });
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error verifying payment!" });
//   }
// };
// export default verifyPayment;

import orderModel from "../models/orderModel.js";
const verifyPayment = async (req, res) => {
  const { orderId, success } = req.body;
  console.log(req.body, "verifyPayment");
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export default verifyPayment;
