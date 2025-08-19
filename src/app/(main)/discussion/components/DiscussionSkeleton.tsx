"use client";

import { Box, Paper, Skeleton } from "@mui/material";

export default function DiscussionSkeleton({ items = 6 }: { items?: number }) {
  return (
    <Box sx={{ mb: 4 }}>
      {Array.from({ length: items }).map((_, i) => (
        <Paper
          key={i}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              {/* chips row */}
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
              </Box>
              {/* title */}
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              {/* content */}
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="85%" sx={{ mb: 1.5 }} />
              {/* tags */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Skeleton variant="rectangular" width={60} height={22} sx={{ borderRadius: 11 }} />
                <Skeleton variant="rectangular" width={72} height={22} sx={{ borderRadius: 11 }} />
                <Skeleton variant="rectangular" width={54} height={22} sx={{ borderRadius: 11 }} />
              </Box>
              {/* footer */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="text" width={90} />
                </Box>
                <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 16 }} />
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}