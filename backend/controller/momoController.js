import crypto from "crypto";
import https from "https";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường

export const createPayment = (req, res) => {
  const { amount, orderInfo } = req.body;

  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const returnUrl = "http://localhost:3000/payment-success";
  const notifyUrl = "http://localhost:5000/api/payment/notify";

  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const extraData = ""; // Nếu không có dữ liệu thêm, để trống

  // Tạo chữ ký HMAC SHA256
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  // Chuẩn bị dữ liệu gửi đến MoMo
  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    returnUrl,
    notifyUrl,
    extraData,
    requestType: "captureWallet",
    signature,
    lang: "en",
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  // Gửi yêu cầu thanh toán đến MoMo
  const reqMoMo = https.request(options, (momoRes) => {
    let data = "";
    momoRes.on("data", (chunk) => {
      data += chunk;
    });

    momoRes.on("end", () => {
      const response = JSON.parse(data);
      res.json({ payUrl: response.payUrl });
    });
  });

  reqMoMo.on("error", (e) => {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo thanh toán", error: e.message });
  });

  reqMoMo.write(requestBody);
  reqMoMo.end();
};
