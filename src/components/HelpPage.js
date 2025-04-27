import React from "react";
import { Typography, Box } from "@mui/material";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export default function HelpPage() {
  return (
    <MathJaxContext>
      <Box sx={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom>
          📋 Noze Plots 2 - Help & Documentation
        </Typography>

        {/* 1. Overview */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          1. Overview
        </Typography>
        <Typography>
          Noze Plots 2 is a browser-based scientific tool to visualize sensor CSV data,
          plot raw resistance signals, normalize them, analyze resistance slopes over time,
          and evaluate sensitivity to humidity changes.
        </Typography>

        {/* 2. CSV File Requirements */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          2. CSV File Requirements
        </Typography>
        <Typography>
          - Input file must be CSV format.<br />
          - Expected columns:
          <ul>
            <li><b>CHR0</b>, <b>CHR1</b>, ..., <b>CHR31</b> → Sensor resistance readings (numeric)</li>
            <li><b>Humidity</b> or <b>H0</b> → Humidity readings (%RH)</li>
          </ul>
          - Humidity column detection is automatic (case insensitive).
        </Typography>

        {/* 3. Modes of Operation */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          3. Modes of Operation
        </Typography>

        {/* Plot */}
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          📈 Plot Mode
        </Typography>
        <Typography>
          - Plots raw resistance vs time.<br />
          - <b>X-axis:</b> Time index (1,2,3...)<br />
          - <b>Y-axis:</b> Resistance (Ω)<br />
          - <b>Purpose:</b> Visualize baseline drift, response patterns, and stability. <br />
          <b>Note:</b> In Plot mode, the uploaded resistance data is displayed directly against time without any modification. Each sensing element's resistance is shown as a line, allowing you to observe trends, patterns, or drifts over time. The X-axis represents time steps, while the Y-axis represents the raw resistance values. This mode provides a clear visualization of the actual behavior of the sensors during the experiment.<br />

        </Typography>

        {/* Normalize */}
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          📈 Normalize Mode
        </Typography>
        <Typography>
          - Plots % change relative to selected baseline.<br />
          - Formula:
        </Typography>
        <MathJax>
          {"\\( \\text{Normalized Y} = \\frac{Y - \\text{avg baseline}}{\\text{avg baseline}} \\times 100 \\)"}
        </MathJax>
        <Typography>
          - <b>Purpose:</b> Normalize signal drift and highlight small changes.<br />
          - <b>X-axis:</b> Time index<br />
          - <b>Y-axis:</b> % Resistance Change <br />
          <b>Note:</b> Normalization requires selecting a stable baseline period where the resistance is unaffected by external changes. The start and stop times define this baseline window, allowing the average resistance to be calculated accurately. All subsequent resistance values are then compared to this baseline to determine their percentage change. Without specifying start and stop times, normalization would have no meaningful reference and could lead to incorrect interpretations.
        </Typography>

        {/* Slope */}
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          📈 Slope Mode
        </Typography>
        <Typography>
          - Calculates change of resistance over time (ΔResistance/ΔTime).<br />
          - Constant Slope (Bar Chart) formula:
        </Typography>
        <MathJax>
          {"\\( \\text{Constant Slope} = \\frac{R_{\\text{end}} - R_{\\text{start}}}{\\Delta t} \\)"}
        </MathJax>
        <Typography>
          - Dynamic Slope (Smoothed Line Plot): Pointwise slope between adjacent time steps.<br />
          - <b>X-axis:</b> Time index<br />
          - <b>Y-axis:</b> ΔResistance / Time (Ω/step) <br />
          <b>Note:</b> In Slope mode, the rate of resistance change over time is calculated for each sensor. It quantifies how quickly the resistance is increasing or decreasing between measurements. The constant slope provides an overall average change, while dynamic slope plots show how the rate evolves over time. This mode helps detect sharp transitions, gradual drifts, or stable periods in sensor behavior.
        </Typography>

        {/* Humidity Slope */}
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          📈 Humidity Slope Mode
        </Typography>
        <Typography>
          - Quantifies resistance sensitivity relative to humidity changes.<br />
          - Formula:
        </Typography>
        <MathJax>
          {"\\( \\text{Humidity Slope} = \\left( \\frac{R_{\\text{end}} - R_{\\text{start}}}{R_{\\text{start}}} \\times 100 \\right) \\div (H_{\\text{end}} - H_{\\text{start}}) \\)"}
        </MathJax>
        <Typography>
          - <b>Purpose:</b> Compare sensor sensitivity to humidity.<br />
          - <b>Units:</b> % Resistance Change / % Humidity Change <br />
          <b>Note:</b> In Humidity Slope mode, the relative change in resistance is analyzed as a function of humidity change. It calculates how sensitive each sensing element's resistance is to changes in humidity. A higher slope indicates a stronger response to humidity, while a lower slope shows weaker sensitivity. This mode helps compare the humidity responsiveness of different sensors in the array.
        </Typography>

        {/* 4. Units Summary */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          4. Units Summary
        </Typography>
        <Typography>
          <ul>
            <li><b>Plot Mode:</b> Resistance (kΩ)</li>
            <li><b>Normalize Mode:</b> % Resistance Change</li>
            <li><b>Slope Mode:</b> ΔResistance / ΔTime (kΩ/time step)</li>
            <li><b>Humidity Slope Mode:</b> % Resistance Change / % Humidity Change (%/%)</li>
          </ul>
        </Typography>

        {/* 5. Scientific Interpretations */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          5. Scientific Interpretations
        </Typography>
        <Typography>
          - <b>High Positive Humidity Slope:</b> Resistance increases strongly with humidity.<br />
          - <b>High Negative Humidity Slope:</b> Resistance decreases strongly with humidity.<br />
          - <b>Stable Baseline:</b> Low dynamic slope.<br />
          - <b>High Dynamic Slope:</b> Possible gas exposure, instability, or event detection.<br />
        </Typography>

        {/* End */}
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          🎯 Contact Jayan : jkandathil@noze.ca for any help. 
        </Typography>
      </Box>
    </MathJaxContext>
  );
}
