"use client";

import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  AppBar,
  Box,
  Chip,
  Container,
  CssBaseline,
  Fab,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PublicIcon from "@mui/icons-material/Public";
import CelebrationIcon from "@mui/icons-material/Celebration";
import confetti from "canvas-confetti";

import CharacterSearch from "../components/CharacterSearch";
import EpisodeList from "../components/EpisodeList";
// If your file is still LocationResidents.tsx, change the next line to:
// import LocationExplorer from "../components/LocationResidents";
import LocationExplorer from "../components/LocationExplorer";

function getTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: "#2563eb" },
      secondary: { main: "#14b8a6" },
      background: {
        default: mode === "light" ? "#f7f9ff" : "#0b0f19",
        paper: mode === "light" ? "#ffffff" : "#111827",
      },
      text: {
        primary: mode === "light" ? "#0f172a" : "#e6edf3",
        secondary: mode === "light" ? "#334155" : "#9fb0c8",
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
      h4: { fontWeight: 800, letterSpacing: 0.2 },
    },
    components: {
      MuiCard: { styleOverrides: { root: { boxShadow: "0 10px 28px rgba(2,6,23,0.06)" } } },
    },
  });
}


function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
        height: { xs: 140, md: 180 },
        backgroundImage: "url('/portal.gif')", // <-- your GIF in /public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="glass"
    >
      {/* overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(11,15,25,0.75) 0%, rgba(11,15,25,0.25) 60%, rgba(11,15,25,0.05) 100%)",
        }}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ position: "relative", height: "100%", px: { xs: 2, md: 3 } }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 900 }}>
            API Visualization App
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
            TEAM Portal-4 • Abubakar Tahir & Urooj Fatima
          </Typography>
        </Box>
        <Chip
          label="TEAM #4"
          color="secondary"
          sx={{ fontWeight: 700, backdropFilter: "blur(4px)" }}
        />
      </Stack>
    </Box>
  );
}

export default function Page() {
 const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  // stable QueryClient (don’t recreate on every render)
  const [qc] = useState(() => new QueryClient());

  const [tab, setTab] = useState(0);

  const party = () => {
    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.2 },
      scalar: 0.9,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
       <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper" }}>


          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
              API Visualization App
            </Typography>
            <Chip
              label="TEAM Portal-4  •  #4"
              color="secondary"
              sx={{ mr: 1, fontWeight: 700 }}
            />
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

        {/* Animated background wrapper */}
        <Box className="animated-bg" sx={{ py: { xs: 2, md: 4 } }}>
          <Container maxWidth="lg">
            {/* Hero GIF banner */}
            <Hero />

            {/* Tabs content */}
            {tab === 0 && <CharacterSearch />}
            {tab === 1 && <EpisodeList />}
            {tab === 2 && <LocationExplorer />}
          </Container>
        </Box>

        {/* Confetti button */}
        <Tooltip title="Celebrate 🎉">
          <Fab
            color="secondary"
            onClick={party}
            sx={{
              position: "fixed",
              right: 20,
              bottom: 20,
              boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            }}
          >
            <CelebrationIcon />
          </Fab>
        </Tooltip>

        {/* Devtools – optional */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
