"use client";

import { Box, List, ListItem, Paper, Skeleton } from "@mui/material";

export default function MessageBubblesSkeleton({ items = 3 }: { items?: number }) {
  return (
    <List sx={{ p: 0 }}>
      {Array.from({ length: items }).map((_, i) => {
        const isOwn = i % 2 === 0; // first bubble on the right
        return (
          <ListItem
            key={i}
            sx={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
              p: 0.5,
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                display: "flex",
                flexDirection: isOwn ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 1,
                mb: 1,
              }}
            >
              {!isOwn ? (
                <Skeleton variant="circular" width={32} height={32} />
              ) : (
                <Box sx={{ width: 32 }} />
              )}

              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  px: 2,
                  borderRadius: "20px",
                  width: { xs: "80%", sm: 320 },
                  backgroundColor:
                    isOwn ? '#007BFF' : '#0056CC',
                
                }}
              >
                <Skeleton variant="text" width="80%" height={20} sx={{ opacity: 0.6 }} />
                <Skeleton variant="text" width="60%" height={18} sx={{ opacity: 0.5 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                  <Skeleton variant="text" width={60} height={14} sx={{ opacity: 0.4 }} />
                </Box>
              </Paper>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}