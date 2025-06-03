require("dotenv").config(); //load env vars
const cors = require("cors");

const { spawn } = require("child_process"); //spawn is used to run Python commands or external tools
const express = require("express");
const app = express();

const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || 5000;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FRONTEND_PORT = process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

app.use(
  cors({
    // origin: `${FRONTEND_URL}/${FRONTEND_PORT}`,
    origin: `*`,
    methods: ["GET"],
  })
);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/stream-audio", async (req, res) => {
  const videoUrl = req.query.url; //youtubeURL is passed from frontend.

  if (!videoUrl) {
    return res.status(400).send("Youtube URL is required");
  }

  //we'll write streaming logic here next.
  //set response headers.
  res.setHeader("Content-Type", "audio/*");
  res.setHeader("Transfer-Encoding", "chunked");

  //Run yt-dlp to extract best audio and output to stdout.
  const path = require("path");

  const ytdlp = spawn(path.join(__dirname, "yt-dlp"), [
    "-f",
    "bestaudio",
    "-o",
    "-",
    videoUrl,
  ]);

  //Pipe yt-dlp output to response(frontend <audio>)
  if (ytdlp.stdout) {
    ytdlp.stdout.pipe(res);
  } else {
    return res.status(500).send("Failed to get audio stream");
  }

  //handle errors
  ytdlp.stderr.on("data", (data) => {
    console.error(`yt-dlp error:${data}`);
  });

  ytdlp.on("error", (err) => {
    console.error("Failed to start yt-dlp:", err);
    res.status(500).send("Internal Server error");
  });

  ytdlp.on("close", (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
  });
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server running on ${BACKEND_URL}`);
});
