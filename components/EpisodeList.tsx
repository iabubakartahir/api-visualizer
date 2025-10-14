"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Stack,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";

type Episode = { id: number; name: string; episode: string; air_date: string };
type Paged<T> = { info?: { pages?: number }; results?: T[] };

const fetchEpisodes = async (page: number, name: string): Promise<Paged<Episode>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (name) params.set("name", name);
  const url = `https://rickandmortyapi.com/api/episode?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("No episodes found.");
  return res.json();
};

export default function EpisodeList() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["episodes", page, name],
    queryFn: () => fetchEpisodes(page, name),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const totalPages = data?.info?.pages ?? 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Episodes
      </Typography>

      <TextField
        label="Search by episode name"
        value={name}
        onChange={(e) => {
          setPage(1);
          setName(e.target.value);
        }}
        fullWidth
      />

      {isLoading && (
        <Stack spacing={1}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="text" height={32} />
          ))}
        </Stack>
      )}

      {isError && <Alert severity="warning">{(error as Error).message}</Alert>}

      <List dense>
        {data?.results?.map((e) => (
          <ListItem key={e.id} divider>
            <ListItemText
              primary={`${e.episode} — ${e.name}`}
              secondary={`Air date: ${e.air_date}`}
            />
            {isFetching && <CircularProgress size={18} />}
          </ListItem>
        ))}
      </List>

      {(data?.results?.length ?? 0) === 0 && !isLoading && !isFetching && (
        <Alert severity="info">No episodes match that search.</Alert>
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
