"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Autocomplete,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Location = { id: number; name: string; type: string; residents: string[] };
type Resident = { id: number; name: string; species: string; status: string };

const searchLocations = async (name: string): Promise<Location[]> => {
  if (!name) return [];
  const res = await fetch(`https://rickandmortyapi.com/api/location?name=${encodeURIComponent(name)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.results ?? [];
};

const getLocation = async (id: number): Promise<Location> => {
  const res = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
  if (!res.ok) throw new Error("Location not found");
  return res.json();
};

const fetchResidents = async (urls: string[]): Promise<Resident[]> => {
  if (!urls?.length) return [];
  const res = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
  return res as Resident[];
};

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useMemo(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);
  return v;
}

export default function LocationExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Location | null>(null);

  const debounced = useDebounced(query);

  const { data: options, isFetching: searching } = useQuery({
    queryKey: ["loc-search", debounced],
    queryFn: () => searchLocations(debounced),
    enabled: !!debounced,
    staleTime: 60_000,
  });

  const {
    data: location,
    error: locErr,
    isFetching: loadingLoc,
  } = useQuery({
    queryKey: ["location", selected?.id],
    queryFn: () => getLocation(selected!.id),
    enabled: !!selected?.id,
    staleTime: 60_000,
  });

  const {
    data: residents,
    error: resErr,
    isFetching: loadingRes,
  } = useQuery({
    queryKey: ["residents", location?.residents],
    queryFn: () => fetchResidents(location?.residents ?? []),
    enabled: !!location?.residents?.length,
    staleTime: 30_000,
  });

  const anyLoading = searching || loadingLoc || loadingRes;
  const anyError = (locErr as Error) || (resErr as Error);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Locations
      </Typography>

      <Autocomplete
        loading={searching}
        options={options ?? []}
        getOptionLabel={(o) => o.name}
        onChange={(_, val) => setSelected(val)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search locations by name (e.g., Earth)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      />

      {anyLoading && <CircularProgress />}

      {anyError && <Alert severity="warning">{anyError.message}</Alert>}

      {location && (
        <>
          <Typography variant="subtitle1">
            {location.name} — {location.type}
          </Typography>
          <List dense>
            {residents?.map((r) => (
              <ListItem key={r.id} divider>
                <ListItemText primary={r.name} secondary={`${r.species} — ${r.status}`} />
              </ListItem>
            ))}
          </List>
          {(residents?.length ?? 0) === 0 && !anyLoading && (
            <Alert severity="info">No residents listed for this location.</Alert>
          )}
        </>
      )}
    </Stack>
  );
}
