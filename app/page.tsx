"use client";

import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PublicIcon from "@mui/icons-material/Public";

import CharacterSearch from "../components/CharacterSearch";
import EpisodeList from "../components/EpisodeList";
import LocationExplorer from "../components/LocationExplorer";

function getTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === "light" ? "#2563eb" : "#90caf9" },
      secondary: { main: mode === "light" ? "#14b8a6" : "#80cbc4" },
      background: {
        default: mode === "light" ? "#f6f7fb" : "#0b0f19",
        paper: mode === "light" ? "#ffffff" : "#111827",
      },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h4: { fontWeight: 700, letterSpacing: 0.2 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
        },
      },
    },
  });
}

export default function Page() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(prefersDark ? "dark" : "light");
  const theme = useMemo(() => getTheme(mode), [mode]);

  // stable QueryClient
  const [qc] = useState(() => new QueryClient());

  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
        <AppBar position="sticky" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
              API Visualization App
            </Typography>
            <IconButton
              aria-label="toggle theme"
              color="inherit"
              onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Toolbar>
          <Box sx={{ px: 2, pb: 1 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              allowScrollButtonsMobile
            >
              <Tab icon={<PersonSearchIcon />} iconPosition="start" label="Characters" />
              <Tab icon={<LiveTvIcon />} iconPosition="start" label="Episodes" />
              <Tab icon={<PublicIcon />} iconPosition="start" label="Locations" />
            </Tabs>
          </Box>
        </AppBar>

        <Box
          sx={{
            minHeight: "100vh",
            background:
              mode === "light"
                ? "linear-gradient(180deg,#f6f7fb 0%, #eef2ff 40%, #fff 100%)"
                : "linear-gradient(180deg,#0b0f19 0%, #0b1224 40%, #0b0f19 100%)",
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            {tab === 0 && <CharacterSearch />}
            {tab === 1 && <EpisodeList />}
            {tab === 2 && <LocationExplorer />}
          </Container>
        </Box>

        {/* Devtools – optional, helps debugging */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
