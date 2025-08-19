"use client";

import {
  Box,
  Container,
  Paper,
  Skeleton,
} from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={48} />
        <Skeleton variant="text" width="60%" />
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(0, 123, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Skeleton variant="circular" width={120} height={120} />
            <Box>
              <Skeleton variant="text" width={220} height={32} />
              <Skeleton variant="text" width={280} />
              <Skeleton variant="rectangular" width={140} height={28} sx={{ borderRadius: 10 }} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width={110} height={36} sx={{ borderRadius: 18 }} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={180} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={28} sx={{ borderRadius: 14 }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={180} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={28} sx={{ borderRadius: 14 }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Paper key={i} sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="80%" />
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(0, 123, 255, 0.1)" }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
      </Paper>
    </Container>
  );
}
