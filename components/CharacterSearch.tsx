"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";

type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
};

type Paged<T> = {
  info?: { pages?: number; count?: number };
  results?: T[];
};

const fetchCharacters = async ({
  name,
  status,
  species,
  page,
}: {
  name: string;
  status: string;
  species: string;
  page: number;
}): Promise<Paged<Character>> => {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (status) params.set("status", status);
  if (species) params.set("species", species);
  if (page) params.set("page", String(page));
  const url = `https://rickandmortyapi.com/api/character?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("No characters found with these filters.");
  return res.json();
};

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useMemo(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);
  return v;
}

export default function CharacterSearch() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string>("");
  const [species, setSpecies] = useState("");
  const [page, setPage] = useState(1);

  const debouncedName = useDebounced(name);
  const debouncedSpecies = useDebounced(species);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["characters", debouncedName, status, debouncedSpecies, page],
    queryFn: () => fetchCharacters({ name: debouncedName, status, species: debouncedSpecies, page }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const totalPages = data?.info?.pages ?? 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Characters
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Search by name"
          value={name}
          onChange={(e) => {
            setPage(1);
            setName(e.target.value);
          }}
          fullWidth
        />
        <Select
          displayEmpty
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as string);
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Alive">Alive</MenuItem>
          <MenuItem value="Dead">Dead</MenuItem>
          <MenuItem value="unknown">Unknown</MenuItem>
        </Select>
        <TextField
          label="Species (e.g., Human, Alien)"
          value={species}
          onChange={(e) => {
            setPage(1);
            setSpecies(e.target.value);
          }}
          sx={{ minWidth: 220 }}
        />
      </Stack>

      {isLoading && (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && <Alert severity="warning">{(error as Error).message}</Alert>}

      <Grid container spacing={2}>
        {data?.results?.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card>
              <CardMedia component="img" height="200" image={c.image} alt={c.name} />
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" noWrap title={c.name}>
                    {c.name}
                  </Typography>
                  <Chip
                    label={c.status}
                    color={c.status === "Alive" ? "success" : c.status === "Dead" ? "error" : "default"}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Species: {c.species}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(data?.results?.length ?? 0) === 0 && !isLoading && !isFetching && (
        <Alert severity="info">No characters match your filters.</Alert>
      )}

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
}
