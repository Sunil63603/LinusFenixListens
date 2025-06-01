"use client";

import { AppBar, Toolbar, Button, Box } from "@mui/material";

const NavbarButtons = [
  "Home",
  "philosophy",
  "AI",
  "solopreneurship",
  "software dev",
  "listen-later",
  "personal-brand",
  "regional-wisdom",
];

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {NavbarButtons.map((NavbarButton) => (
            <Button
              key={NavbarButton}
              variant="contained"
              sx={{
                backgroundColor: "#39FF14", //Neon green
                fontWeight: "bold",
                color: "black",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#66ff66", //Lighter neon green on hover
                  boxShadow: "0 0 10px #66ff66, 0 0 20px #66ff66",
                },
              }}
            >
              {NavbarButton}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
