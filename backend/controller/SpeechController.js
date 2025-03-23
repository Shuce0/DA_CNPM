import { SpeechClient } from "@google-cloud/speech";
import fs from "fs";
const speechClient = new SpeechClient();
process.env.NO_GCE_CHECK = "true";
export const voiceSearch = async (req, res) => {
  try {
    const audio = req.file; // File audio từ frontend
    const audioBytes = fs.readFileSync(audio.path).toString("base64");

    const request = {
      audio: { content: audioBytes },

      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "vi-VN", // Tiếng Việt
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcript = response.results
      .map((r) => r.alternatives[0].transcript)
      .join(" ");

    res.json({ text: transcript });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi xử lý giọng nói!", details: error.message });
  }
};
