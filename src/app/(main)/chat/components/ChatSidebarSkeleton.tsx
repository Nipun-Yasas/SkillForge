"use client";

import { Box, Skeleton, Divider } from "@mui/material";

export default function ChatSidebarSkeleton({ items = 10 }: { items?: number }) {
  return (
    <Box
      sx={{
        width: 320,
        maxWidth: 360,
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      {/* Search / New chat actions */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="rectangular" height={36} width={140} sx={{ borderRadius: 2 }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Conversations header */}
      <Skeleton variant="text" width={160} height={28} sx={{ mb: 1 }} />

      {/* Conversations list */}
      <Box sx={{ overflowY: "auto" }}>
        {Array.from({ length: items }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1,
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={16} height={16} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}