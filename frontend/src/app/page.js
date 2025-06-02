"use client";

import { useState } from "react";
//used to store user's input(ie.youtube URL) and audio file which is in backend
import {
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
//Container contains both input and 'submit' button.
//TextField is used by user to paste URL.
//Button is used to extract audio.
//Stack is like flex spacing
//Typography is used for text styling.
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const categories = [
  "philosophy",
  "AI",
  "solopreneurship",
  "Software Dev",
  "listen-later",
  "personal-brand",
  "regional-wisdom",
];

const getYoutubeEmbedURL = (youtubeUrl) => {
  const videoId = extractVideoId(youtubeUrl);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const extractVideoId = (youtubeUrl) => {
  const regex = /(?:v=|\/embed\/|\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = youtubeUrl.match(regex);
  return match ? match[1] : null;
};

export default function Home() {
  //URL which user pastes is stored here.
  const [youtubeUrl, setYoutubeUrl] = useState(""); //empty by default.
  const [audioSrc, setAudioSrc] = useState(null); //backend audio file's URL.
  const [embedUrl, setEmbedUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); //user will decide in which playlist to save audio-file.

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = async () => {
    if (!youtubeUrl) return;

    const url = getYoutubeEmbedURL(youtubeUrl);
    if (url) setEmbedUrl(url);
    else alert("Invalid Youtube URL");

    try {
      //call the nw streaming route(we wont expect JSON now.)
      const streamUrl = `${BACKEND_URL}/stream-audio?url=${encodeURIComponent(
        youtubeUrl
      )}`;
      console.log(streamUrl);
      setAudioSrc(streamUrl);
    } catch (error) {
      console.error("Error extracting audio:", error);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        {/*Stack is like flex spacing*/}
        <Stack spacing={3}>
          <Typography variant="h5" align="center">
            Youtube Audio Extractor
          </Typography>
          <TextField
            label="Paste Youtube URL"
            variant="outlined"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff", backgroundColor: "#333" } }}
          ></TextField>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#fff" }}>Select Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Select Category"
              onChange={handleCategoryChange}
              sx={{
                backgroundColor: "#424242", //dark-grey background
                color: "#fff", //white text
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                  sx={{ backgroundColor: "#424242", color: "#000" }}
                >
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#00FFFF", //Neon blue
              color: "black",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#66FCf1", //Lighter neon blue
                boxShadow: "0 0 10px #66FCF1, 0 0 20px #66FCF1",
              },
            }}
          >
            Extract Audio
          </Button>
          <audio
            controls
            style={{ marginTop: "20px", width: "100%" }}
            src={audioSrc}
            autoPlay
          >
            Your browser does not support the audio element
          </audio>
        </Stack>
      </Container>
      <Box p={2} sx={{ maxWidth: 800, margin: "auto" }}>
        <Typography variant="h5" align="center">
          Youtube Video
        </Typography>

        {embedUrl && (
          <Box sx={{ position: "relative", padding: "100px" }}>
            <iframe
              width="560"
              height="315"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </Box>
        )}
      </Box>
    </>
  );
}
