"use client";

import { Box, Container, Paper, Skeleton, Typography } from "@mui/material";

export default function ProfileSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Skeleton variant="text" width={240} height={48} />
          <Skeleton variant="text" width={360} height={28} />
        </Box>
        <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Profile Picture & Basic Info */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4, mb: 4 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={36} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="55%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width={160} height={30} sx={{ borderRadius: 16 }} />
          </Box>
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 18 }} />
        </Box>

        {/* Bio */}
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={84} sx={{ borderRadius: 2, mb: 3 }} />

        {/* Location + Experience */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      </Paper>

      {/* Skills & Expertise */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />

        {/* Skills I'm Learning */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <Skeleton variant="text" width={220} height={28} />
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`learn-${i}`} variant="rectangular" width={90} height={28} sx={{ borderRadius: 14 }} />
          ))}
        </Box>

        {/* Skills I Can Teach */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <Skeleton variant="text" width={220} height={28} />
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`teach-${i}`} variant="rectangular" width={90} height={28} sx={{ borderRadius: 14 }} />
          ))}
        </Box>
      </Paper>

      {/* Learning Goals & Availability */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Skeleton variant="text" width={300} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={84} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      </Paper>

      {/* Save Button (when editing) */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 2 }} />
      </Box>
    </Container>
  );
}