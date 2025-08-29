"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import { Award, BookOpen, TrendingUp, Users } from "lucide-react";

import theme from "@/theme";

type ActivityItem = {
  id: string;
  type: "enroll" | "quiz" | "quiz_pass" | "complete" | "rating";
  title: string;
  subtitle?: string;
  at: string;
  href?: string;
};

export default function RecentActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/activity/recent?limit=100", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!ignore) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>All Activity</Typography>
        <Button variant="outlined" size="small" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper elevation={10}
              sx={{
                textAlign: "center",
                p: 4,
                mb: 4,
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
              }}>
        {loading ? (
          <Box sx={{ px: 1 }}>
            {[...Array(6)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", py: 1.5 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" height={20} />
                  <Skeleton width="60%" height={18} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <TrendingUp size={60} color="#ccc" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No activity yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((a, idx) => {
              const dt = new Date(a.at);
              const when = dt.toLocaleString();
              const iconBg =
                a.type === "complete" ? "#e9f7ef"
                : a.type === "quiz_pass" ? "#e7f2ff"
                : a.type === "quiz" ? "#fff7e8"
                : a.type === "rating" ? "#f5e9ff"
                : "#eaf2ff";
              const icon =
                a.type === "complete" ? <Award size={22} color="#28a745" />
                : a.type === "quiz_pass" ? <TrendingUp size={22} color="#007BFF" />
                : a.type === "quiz" ? <TrendingUp size={22} color="#FF7A00" />
                : a.type === "rating" ? <Users size={22} color="#6A0DAD" />
                : <BookOpen size={22} color="#007BFF" />;
              return (
                <Box key={a.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ px: 0, cursor: a.href ? "pointer" : "default" }}
                    onClick={() => a.href && router.push(a.href)}
                  >
                    <ListItemAvatar>
                      <Box sx={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: iconBg }}>
                        {icon}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={a.title}
                      secondary={<span>{a.subtitle ? `${a.subtitle} • ` : ""}{when}</span>}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {idx < items.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
}