import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function PasswordPrompt({ onPasswordCorrect }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const password = "nozeplots2";  // ✅ You can change this password here
    if (input === password) {
      onPasswordCorrect();
    } else {
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        gap: 2,
      }}
    >
      <Typography variant="h6">Enter Password to Access Help Page</Typography>
      <TextField
        label="Password"
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        error={error}
        helperText={error ? "Incorrect password. Try again." : ""}
        sx={{ width: "300px" }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          backgroundColor: "#00DE93",
          '&:hover': { backgroundColor: "#00c984" },
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
