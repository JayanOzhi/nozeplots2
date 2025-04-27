import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";



const Logo = styled("img")({
  height: 40,
  marginRight: 16,
});

export default function NavBar({ setMode, mode }) {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>

        {/* ✅ Logo */}
        <Logo src="/logo1.png" alt="Logo" />

        {/* ✅ Buttons next to logo */}
        <Box sx={{ display: "flex", gap: 1, marginLeft: "16px" }}>
          <Button
            onClick={() => setMode("plot")}
            sx={{
              color: mode === "plot" ? "#00DE93" : "#666",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Plot
          </Button>

          <Button
            onClick={() => setMode("normalize")}
            sx={{
              color: mode === "normalize" ? "#00DE93" : "#666",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Normalize
          </Button>

          <Button
            onClick={() => setMode("slope")}
            sx={{
              color: mode === "slope" ? "#00DE93" : "#666",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Slope
          </Button>

          <Button
            onClick={() => setMode("humidity")}
            sx={{
              color: mode === "humidity" ? "#00DE93" : "#666",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Humidity Slope
          </Button>

        </Box>
        <Button
            onClick={() => setMode("help")}
        sx={{
            color: mode === "help" ? "#00DE93" : "#666",
        fontWeight: 600,
        textTransform: "none",
        }}
>
  Info
</Button>


      </Toolbar>
    </AppBar>
  );
}
