const { spawn } = require("child_process"); //spawn is used to run Python commands or external tools
const path = require("path"); //this is for file paths.
const fs = require("fs"); //for file system

const ffmpegPath =
  "C:\\Users\\91819\\Downloads\\ffmpeg-7.1.1-essentials_build\\ffmpeg-7.1.1-essentials_build\\bin";

function downloadAudioFromYoutube(url, outputPath) {
  //❌Now outputPath is of no use.❌

  const args = [
    url,
    "-x",
    "--audio-format",
    "mp3",
    "--ffmpeg-location",
    ffmpegPath,
    "-o",
    "./audio/%(title)s.%(ext)s",
  ];

  return new Promise((resolve, reject) => {
    const audioDir = path.join(__dirname, "audio");

    //get all files before download
    const filesBefore = fs.readdirSync(audioDir);

    const process = spawn("yt-dlp", args);

    process.stderr.on("data", (data) => {
      console.error(`stderr:${data.toString()}`);
    });

    process.on("close", (code) => {
      if (code === 0) {
        //wait a bit, then click which file is new.
        const filesAfter = fs.readdirSync(audioDir);
        const newFiles = filesAfter.filter((f) => !filesBefore.includes(f));

        if (newFiles.length > 0) {
          const downloadedFile = newFiles[0];
          const filePath = path.join("audio", downloadedFile); //relative path for frontend.
          resolve(filePath);
        } else {
          reject("Download complete but no new file found");
        }
      } else {
        reject("yt-dlp exited with code" + code);
      }
    });
  });
}

module.exports = downloadAudioFromYoutube;
