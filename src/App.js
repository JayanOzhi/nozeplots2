import React, { useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";
import NavBar from "./components/NavBar";
import HelpPage from "./components/HelpPage";
import PasswordPrompt from "./components/PasswordPrompt";  // ✅ Add this line

import { Button, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function App() {
  const [mode, setMode] = useState("plot");
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [fileName, setFileName] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });
  const [error, setError] = useState("");
  const [helpUnlocked, setHelpUnlocked] = useState(false); // ✅ New state for password

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        let parsedData = results.data;

        if (!parsedData || parsedData.length === 0) {
          setData([]);
          setKeys([]);
          setError("Uploaded file has no data.");
          return;
        }

        if (Object.keys(parsedData[0]).every((k) => k === "")) {
          parsedData = parsedData.map((row) => {
            const values = Object.values(row);
            return values.reduce((acc, val, idx) => {
              acc[`Col${idx + 1}`] = val;
              return acc;
            }, {});
          });
        }

        const allKeys = Object.keys(parsedData[0]);
        const numericKeys = allKeys.filter(
          (k) => parsedData.every((row) => typeof row[k] === "number")
        );

        setKeys(numericKeys);
        setData(parsedData);
      },
    });
  };

  const normalizeData = () => {
    const startIdx = parseInt(range.start);
    const endIdx = parseInt(range.end);
    if (isNaN(startIdx) || isNaN(endIdx)) return [];

    return data.map((row) => {
      const normRow = { ...row };
      keys.forEach((key) => {
        const baseline = data.slice(startIdx, endIdx + 1).map((r) => r[key]);
        const avg = baseline.reduce((a, b) => a + b, 0) / baseline.length;
        normRow[key] = ((row[key] - avg) / avg) * 100;
      });
      return normRow;
    });
  };

  const humiditySlopeData = () => {
    const startIdx = parseInt(range.start);
    const endIdx = parseInt(range.end);
    if (isNaN(startIdx) || isNaN(endIdx)) return {};

    const humidityKey = keys.find(
      (k) => k.toLowerCase() === "humidity" || k.toLowerCase() === "h0"
    );
    if (!humidityKey) return {};

    const chrKeys = keys.filter((k) => k.toLowerCase().startsWith("chr"));

    const humidityStart = data[startIdx]?.[humidityKey] ?? 0;
    const humidityEnd = data[endIdx]?.[humidityKey] ?? 0;
    const deltaHumidity = humidityEnd - humidityStart;
    if (deltaHumidity === 0) return {};

    const slopeRow = {};
    chrKeys.forEach((key) => {
      const rStart = data[startIdx]?.[key] ?? 0;
      const rEnd = data[endIdx]?.[key] ?? 0;
      const deltaR = rEnd - rStart;
      const relativeChangePercent = (deltaR / rStart) * 100;
      slopeRow[key] = relativeChangePercent / deltaHumidity;
    });
    return slopeRow;
  };

  const normalized = normalizeData();
  const humiditySlopes = humiditySlopeData();

  return (
    <div>
      <NavBar setMode={setMode} mode={mode} />
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Upload Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <img src="/logo1.png" alt="Logo" style={{ height: "64px", width: "auto", marginBottom: "16px", objectFit: "contain" }} />
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
              backgroundColor: "#00DE93",
              '&:hover': { backgroundColor: "#00c984" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              padding: "8px 20px",
              borderRadius: "8px",
            }}
          >
            Upload CSV
            <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
          </Button>

          {(mode === "normalize" || mode === "humidity") && (
            <Box sx={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <input
                type="number"
                placeholder="Start Time Index"
                value={range.start}
                onChange={(e) => setRange({ ...range, start: e.target.value })}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "120px" }}
              />
              <input
                type="number"
                placeholder="End Time Index"
                value={range.end}
                onChange={(e) => setRange({ ...range, end: e.target.value })}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "120px" }}
              />
            </Box>
          )}
        </div>

        {/* File name */}
        {fileName && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 4 }}>
            <InsertDriveFileIcon sx={{ color: "#00DE93" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#007BFF" }}>{fileName}</Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Typography variant="body1" align="center" sx={{ color: "red", mb: 4 }}>
            {error}
          </Typography>
        )}

        {/* Display Modes */}
        {mode === "help" ? (
          !helpUnlocked ? (
            <PasswordPrompt onPasswordCorrect={() => setHelpUnlocked(true)} />
          ) : (
            <HelpPage />
          )
        ) : mode === "humidity" ? (
          <>
            {/* Humidity Slope Plot */}
            <div style={{ marginBottom: "40px", width: "80%", margin: "auto" }}>
              <Plot
                data={[{ x: Object.keys(humiditySlopes), y: Object.values(humiditySlopes), type: "bar", marker: { color: "#00DE93" } }]}
                layout={{
                  title: { text: "Relative Resistance Change per Humidity (%)", font: { size: 18 } },
                  xaxis: { title: { text: "CHR Sensor" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                  yaxis: { title: { text: "% Resistance Change / % Humidity Change" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                  margin: { t: 40, r: 20, l: 60, b: 60 },
                  autosize: true,
                  plot_bgcolor: "white",
                  paper_bgcolor: "white"
                }}
                useResizeHandler
                style={{ width: "100%", height: "400px" }}
              />
            </div>

            {/* Baseline Resistance Plot */}
            <div style={{ marginBottom: "40px", width: "80%", margin: "auto" }}>
              <Plot
                data={[{
                  x: Object.keys(humiditySlopes),
                  y: Object.keys(humiditySlopes).map(key => data[0]?.[key] ?? 0),
                  type: "bar",
                  marker: {
                    color: Object.keys(humiditySlopes).map(key => {
                      const val = data[0]?.[key] ?? 0;
                      if (val >= 2000000) return "red";
                      else if (val >= 1500000) return "yellow";
                      else return "green";
                    })
                  }
                }]}
                layout={{
                  title: { text: "Baseline Resistance at t=0", font: { size: 18 } },
                  xaxis: { title: { text: "CHR Sensor" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                  yaxis: { title: { text: "Resistance (Ω)" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                  margin: { t: 40, r: 20, l: 60, b: 60 },
                  autosize: true,
                  plot_bgcolor: "white",
                  paper_bgcolor: "white"
                }}
                useResizeHandler
                style={{ width: "100%", height: "400px" }}
              />
            </div>

            {/* Table */}
            <div style={{ marginTop: "20px", maxWidth: "1000px", margin: "auto" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Humidity Sensitivity and Baseline Resistance
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>CHR#</b></TableCell>
                      <TableCell><b>Humidity Sensitivity (%/%RH)</b></TableCell>
                      <TableCell><b>Baseline Resistance (Ω)</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {keys.filter(key => key.toLowerCase().startsWith("chr")).map((key) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{humiditySlopes[key]?.toFixed(4)}</TableCell>
                        <TableCell>{(data[0]?.[key] ?? 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          // Plot or Normalize
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", justifyItems: "center" }}>
            {(mode === "plot" ? data : normalized).length > 0 && keys.map((key, idx) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #00DE93", padding: "10px", borderRadius: "5px", maxWidth: "400px", width: "100%" }}>
                <Plot
                  data={[{
                    x: (mode === "plot" ? data : normalized).map((_, i) => i + 1),
                    y: (mode === "plot" ? data : normalized).map(row => row[key]),
                    type: "scatter",
                    mode: "lines",
                    line: { shape: "spline", width: 2 }
                  }]}
                  layout={{
                    title: { text: mode === "plot" ? key : `${key} (Normalized)`, font: { size: 16 } },
                    xaxis: { title: { text: "Time [s]" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                    yaxis: { title: { text: mode === "plot" ? key : "% Change from Baseline" }, showline: true, mirror: true, linecolor: "black", linewidth: 1, showgrid: true, gridcolor: "#e0e0e0", gridwidth: 0.5 },
                    margin: { t: 40, r: 20, l: 60, b: 60 },
                    autosize: true,
                    plot_bgcolor: "white",
                    paper_bgcolor: "white"
                  }}
                  useResizeHandler
                  style={{ width: "100%", height: "320px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
