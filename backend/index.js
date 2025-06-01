require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const downloadAudioFromYoutube = require("./ytDlpHelper");
const path = require("path");

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;
const BACKEND_PORT = process.env.BACKEND_PORT;

app.use(
  cors({
    origin: FRONTEND_URL, //❌change this to *,if you get any CORS errors❌
    credentials: true,
  })
);
app.use(express.json());
//this below line tells express to make files inside '/audio' folder, publicly accessible at ${BACKEND_URL}/audio/<filename>.
app.use("/audio", express.static(path.join(__dirname, "audio")));

//when this route is hit, execute below function.
app.get("/extract-audio", async (req, res) => {
  const youtubeUrl = req.query.url; //extract URL from request.
  if (!youtubeUrl)
    return res.status(400).json({ error: "Missing youtube URL" });

  //❌Logically speaking, This outputPath is of no use.❌
  const outputPath = path.join(__dirname, "audio", "%(title)s.%(ext)s");
  console.log(outputPath);

  try {
    const file = await downloadAudioFromYoutube(youtubeUrl, outputPath);
    res.status(200).json({ file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to extract audio" });
  }
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server running on ${BACKEND_URL}`);
});
