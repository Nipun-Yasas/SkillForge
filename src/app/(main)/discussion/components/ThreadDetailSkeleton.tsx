"use client";

import { Box, Paper, Skeleton } from "@mui/material";

export default function ThreadDetailSkeleton() {
  return (
    <Box sx={{ width: "100%", p: 0 }}>
      {/* Back button */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" width={160} height={36} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Main thread */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
          <Skeleton variant="circular" width={64} height={64} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>

            {/* content */}
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="85%" />
            <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />

            {/* tags */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Skeleton variant="rectangular" width={72} height={26} sx={{ borderRadius: 13 }} />
              <Skeleton variant="rectangular" width={64} height={26} sx={{ borderRadius: 13 }} />
              <Skeleton variant="rectangular" width={54} height={26} sx={{ borderRadius: 13 }} />
            </Box>

            {/* actions */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Replies section */}
      <Paper sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Skeleton variant="text" width={180} height={30} sx={{ mb: 2 }} />

        {/* Reply input */}
        <Skeleton variant="text" width={160} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 2, mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Replies list */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Skeleton variant="text" width={160} height={22} />
                  <Skeleton variant="text" width={120} height={18} />
                  <Skeleton variant="rectangular" width={140} height={22} sx={{ borderRadius: 12 }} />
                </Box>
                <Skeleton variant="text" width="92%" />
                <Skeleton variant="text" width="80%" sx={{ mb: 1.5 }} />
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Skeleton variant="rectangular" width={70} height={28} sx={{ borderRadius: 14 }} />
                  <Skeleton variant="rectangular" width={70} height={28} sx={{ borderRadius: 14 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}