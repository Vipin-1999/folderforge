"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  CssBaseline,
  Box
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Brightness5Icon from '@mui/icons-material/Brightness5';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';

// Define the FileNode type similar to the backend
interface FileNode {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: FileNode[];
}

// Helper: Parse a single line of the tree input.
// This version supports various branch marker variants (e.g. "├── ", "└── ", "── ", or "- ").
function parseLine(line: string): { level: number; name: string; content: string } {
  // Regex explanation:
  //   - Group 1: Any leading whitespace or vertical line characters.
  //   - Group 2: An optional branch marker which can be one of:
  //         "├── ", "└── ", "── ", or a single/double dash ("- " or "-- ").
  //   - Group 3: The rest of the line (node name and optional comment).
  const regex = /^([\s│]*)(?:(├── |└── |── |[-]{1,2}\s))?(.*)$/;
  const match = line.match(regex);
  if (!match) {
    return { level: 0, name: line.trim(), content: "" };
  }
  const indent = match[1];
  // Compute the base level from indentation (replace "│" with four spaces)
  let level = Math.floor(indent.replace(/│/g, "    ").length / 4);
  // If a branch marker is present, increase the level by one.
  if (match[2]) {
    level += 1;
  }
  let rest = match[3].trim();

  // Split on '#' to separate the name and optional content (comment)
  const [namePart, ...commentParts] = rest.split("#");
  let name = namePart.trim();
  const content = commentParts.length > 0 ? "# " + commentParts.join("#").trim() : "";
  // Remove trailing slash if present (indicates a directory)
  if (name.endsWith("/")) {
    name = name.slice(0, -1);
  }
  return { level, name, content };
}

// Parser: Converts the complete tree text into a nested JSON object.
function parseTreeString(input: string): FileNode | null {
  const lines = input.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return null;

  let root: FileNode | null = null;
  // Stack to track nodes and their levels.
  const stack: { node: FileNode; level: number }[] = [];

  lines.forEach((line) => {
    const { level, name, content } = parseLine(line);
    // Heuristic: if the name contains a dot or there is content, treat it as a file.
    const isFile = name.includes(".") || content !== "";
    const node: FileNode = {
      name,
      type: isFile ? "file" : "directory",
      ...(isFile ? { content } : { children: [] })
    };

    if (stack.length === 0) {
      // The first node is the root.
      root = node;
      stack.push({ node, level });
    } else {
      // Pop nodes until finding a parent with a lower level.
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      if (stack.length === 0) {
        // Fallback: if no parent is found, treat this as a new root.
        stack.push({ node, level });
      } else {
        const parent = stack[stack.length - 1].node;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
        stack.push({ node, level });
      }
    }
  });

  return root;
}

export default function Home() {
  const [treeText, setTreeText] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Persist the theme by reading from localStorage on mount.
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  // Save the theme to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Create theme based on darkMode state with customized typography and border radius.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light"
        },
        shape: {
          borderRadius: 24
        },
        typography: {
          h4: {
            fontWeight: 700,
            marginBottom: "16px"
          },
          body1: {
            marginBottom: "12px"
          },
          body2: {
            marginBottom: "8px"
          }
        }
      }),
    [darkMode]
  );

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleSubmit = async () => {
    setMessage(null);
    const parsed = parseTreeString(treeText);
    console.log("parsed:", parsed);
    if (!parsed) {
      setMessage({ type: "error", text: "Invalid input. Please check your tree structure." });
      setOpenSnackbar(true);
      return;
    }

    try {
      // Change the URL if your backend endpoint differs.
      const response = await fetch("http://localhost:8000/create-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.detail || "Error creating structure." });
      } else {
        setMessage({ type: "success", text: "File structure created successfully." });
      }
      setOpenSnackbar(true);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Network error." });
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: 'calc(100vh - 21px)' }}>
        <Box sx={{ width: "100%" }}>
          {/* Header with project name and icon-based dark mode toggle */}
          <Box
            sx={{
              mb: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h4" sx={{ mt: "16px" }}>
              FolderForge
            </Typography>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {darkMode ? <Brightness5Icon fontSize="large" /> : <BrightnessHighIcon fontSize="large" />}
            </IconButton>
          </Box>

          {/* Input Guide */}
          <Box
            sx={{
              backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#424242",
              p: 3,
              borderRadius: "16px",
              whiteSpace: "pre-wrap",
              mb: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Input Guide:
            </Typography>
            <Typography variant="body2">
              Provide your file structure as a tree. Each line represents a file or directory.
            </Typography>
            <Typography variant="body2">
              Use any of the following branch markers to denote hierarchy:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 4, mb: 1 }}>
              <li>
                <strong>├──</strong>, <strong>└──</strong>, <strong>──</strong>
              </li>
              <li>
                <strong>-</strong> or <strong>--</strong> followed by a space
              </li>
            </Typography>
            <Typography variant="body2">
              For directories, end the name with a slash ("/"). You can also add an optional comment after a "#".
            </Typography>
          </Box>
          <TextField
            placeholder={`backend/
├── config.py                                    # Application configuration and environment settings
├── decrypt_middleware.py              # Middleware for decrypting incoming requests
├── ...`}
            multiline
            fullWidth
            minRows={10}
            variant="outlined"
            value={treeText}
            onChange={(e) => setTreeText(e.target.value)}
            sx={{
              mb: 1,
              "& .MuiInputBase-root": {
                padding: "24px"
              }
            }}
            InputLabelProps={{
              sx: {
                ml: 2,
                transformOrigin: "top left"
              }
            }}
            InputProps={{
              sx: {
                pl: 2
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mb: 3, borderRadius: "16px", py: 1.5, px: 3 }}
          >
            Create Structure
          </Button>
          {message && (
            <Snackbar
              open={openSnackbar}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={handleSnackbarClose} severity={message.type} sx={{ width: "100%" }}>
                {message.text}
              </Alert>
            </Snackbar>
          )}
        </Box>
        {/* Footer with tech stack information */}
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: "divider", textAlign: "center", width: "100%" }}>
          <Typography variant="caption" color="textSecondary">
            Built with Next.js, TypeScript, and Material UI.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
