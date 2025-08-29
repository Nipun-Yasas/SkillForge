"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAuth } from "@/contexts/AuthContext";

import theme from "@/theme";

type User = {
  _id: string;
  name: string;
  role: "learner" | "mentor" | "both";
  avatar?: string;
  bio?: string;
  location?: string;
  experience?: string;
  skills?: { teaching?: string[]; learning?: string[] };
  university?: string;
  major?: string;
};

type Props = {
  query?: string;
  filters?: string[];
};

export default function MentorsCards({ query = "", filters = [] }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = (user as any)?._id || (user as any)?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        // Ask API to exclude the current user on the server
        params.set("excludeSelf", "1");

        // skill/category -> query params
        const skillValues = (filters || [])
          .filter((f) => f.startsWith("skill:"))
          .map((f) => f.split(":")[1]);
        for (const s of skillValues) params.append("skill", s);

        const categoryValues = (filters || [])
          .filter((f) => f.startsWith("category:"))
          .map((f) => f.split(":")[1]);
        for (const c of categoryValues) params.append("category", c);

        // availability -> ?availability=
        const availabilityValues = (filters || [])
          .filter((f) => f.startsWith("availability:"))
          .map((f) => f.split(":")[1]);
        for (const a of availabilityValues) params.append("availability", a);

        const url = `/api/findmentor${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (active) {
          let list: User[] = data.users ?? [];
          // Client-side safeguard: filter out current user if present
          if (currentUserId) {
            list = list.filter((u: User) => String(u._id) !== String(currentUserId));
          }
          setUsers(list);
        }
      } catch (e: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (active && (e as any).name !== "AbortError")
          setError((e as Error).message || "Failed to load mentors");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [query, filters, currentUserId]);

  const handleViewProfile = (mentorId: string) => {
    router.push(`/mentor/${mentorId}`);
  };

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Card>
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="60%" />}
                subheader={<Skeleton width="40%" />}
              />
              <CardContent>
                <Skeleton height={80} />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={28} />
                  <Skeleton variant="rectangular" width={80} height={28} />
                  <Skeleton variant="rectangular" width={50} height={28} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  if (users.length === 0)
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No mentors found.
      </Alert>
    );

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {users.map((u) => {
        const initials =
          u.name
            ?.split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";
        const teaching = u.skills?.teaching?.slice(0, 6) || [];
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={u._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
                backdropFilter: "blur(10px) saturate(1.08)",
                WebkitBackdropFilter: "blur(10px) saturate(1.08)",
                borderRadius: 3,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 10px 40px rgba(0,0,0,0.45)"
                    : "0 10px 40px rgba(0,0,0,0.12)",
                transition:
                  "background-color 200ms ease, backdrop-filter 200ms ease",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
                },
              }}
              elevation={10}
            >
              <CardHeader
                avatar={
                  u.avatar ? (
                    <Avatar src={u.avatar} alt={u.name} />
                  ) : (
                    <Avatar>{initials}</Avatar>
                  )
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {u.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {u.role === "both"
                      ? "Mentor & Learner"
                      : u.role || "Mentor"}
                    {u.experience ? ` • ${u.experience}` : ""}
                    {u.location ? ` • ${u.location}` : ""}
                  </Typography>
                }
              />
              <CardContent sx={{ flex: 1 }}>
                {u.bio && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {u.bio}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {teaching.length > 0 ? (
                    teaching.map((s, i) => (
                      <Chip key={i} size="small" label={s} sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Chip size="small" label="No skills added" />
                  )}
                </Stack>
                {(u.university || u.major) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {[u.university, u.major].filter(Boolean).join(" • ")}
                  </Typography>
                )}
              </CardContent>

              <Box sx={{ display: "flex", justifyContent: "flex-end",mb:2, px:2 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleViewProfile(u._id)}
                >
                  View Profile
                </Button>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
